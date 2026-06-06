import os
import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from groq import AsyncGroq

router = APIRouter(prefix="/mutate", tags=["mutate"])
client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))

class MutateRequest(BaseModel):
    prompt: str

@router.post("/generate")
async def generate_variants(req: MutateRequest):
    if not req.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt is required")
        
    system_prompt = """You are an expert prompt engineer.
Given a base prompt, generate 5 distinct improved variants. 
Return ONLY a valid JSON object with the following keys, containing the full text of each variant:
- "specific": A more specific version adding precision and removing ambiguity.
- "cot": A Chain-of-Thought version forcing step-by-step reasoning.
- "fewshot": A version that includes 1 or 2 examples to guide the model.
- "compressed": A version that achieves the same goal in the fewest possible tokens without losing meaning.
- "persona": A version wrapped in an authoritative expert persona.

Return ONLY raw JSON, no markdown blocks."""

    try:
        completion = await client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Base prompt:\n{req.prompt}"}
            ],
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        
        result_str = completion.choices[0].message.content
        return json.loads(result_str)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
