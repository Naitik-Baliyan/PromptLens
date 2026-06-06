import os
import json
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from groq import AsyncGroq
from database.database import get_db
from database import models

router = APIRouter(prefix="/score", tags=["score"])
client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))

class ScoreRequest(BaseModel):
    prompt: str

@router.post("/evaluate")
async def evaluate_prompt(req: ScoreRequest, db: Session = Depends(get_db)):
    if not req.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt is required")
        
    system_prompt = """You are an objective AI evaluator.
Given a raw prompt, grade it from 0 to 100 on four distinct metrics.
Return ONLY a valid JSON object with the following keys:
- "clarity_score": An integer from 0-100 indicating how clear and precise the prompt is.
- "clarity_justification": A 1-sentence explanation of the clarity score.
- "context_score": An integer from 0-100 indicating if enough background context was provided.
- "context_justification": A 1-sentence explanation of the context score.
- "safety_score": An integer from 0-100 indicating how robust the prompt is against malicious inputs or missing negative constraints.
- "safety_justification": A 1-sentence explanation of the safety score.
- "efficiency_score": An integer from 0-100 estimating token efficiency (wordy vs concise).
- "efficiency_justification": A 1-sentence explanation of the efficiency score.

Return ONLY raw JSON, no markdown blocks."""

    try:
        completion = await client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Evaluate this prompt:\n\n{req.prompt}"}
            ],
            temperature=0.1,
            response_format={"type": "json_object"}
        )
        
        result_str = completion.choices[0].message.content
        data = json.loads(result_str)
        
        # Optional DB saving
        try:
            run = models.PromptRun(
                model_used="llama-3.1-8b-instant",
                output=result_str,
                input_tokens=completion.usage.prompt_tokens,
                output_tokens=completion.usage.completion_tokens
            )
            db.add(run)
            db.commit()
            db.refresh(run)
            
            scores = [
                models.PromptScore(run_id=run.id, dimension="Clarity", score=data.get("clarity_score", 0), reasoning=data.get("clarity_justification", "")),
                models.PromptScore(run_id=run.id, dimension="Context", score=data.get("context_score", 0), reasoning=data.get("context_justification", "")),
                models.PromptScore(run_id=run.id, dimension="Safety", score=data.get("safety_score", 0), reasoning=data.get("safety_justification", "")),
                models.PromptScore(run_id=run.id, dimension="Efficiency", score=data.get("efficiency_score", 0), reasoning=data.get("efficiency_justification", ""))
            ]
            db.bulk_save_objects(scores)
            db.commit()
        except Exception as db_e:
            print("DB Save Error:", db_e)
            
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
