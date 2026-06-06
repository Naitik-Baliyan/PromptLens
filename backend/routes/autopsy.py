import os
import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from groq import AsyncGroq

router = APIRouter(prefix="/autopsy", tags=["autopsy"])
client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))

class AutopsyRequest(BaseModel):
    prompt: str

@router.post("/analyze")
async def analyze_prompt(req: AutopsyRequest):
    if not req.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt is required")
        
    system_prompt = """You are an expert prompt engineer and security analyst. 
Given a raw prompt, dissect it into 4 parts and return ONLY a valid JSON object with the following keys:
- "system_instruction": The persona, role, or core directive given to the AI. If none, explain what's missing.
- "context": The background information or data provided. If none, explain what's missing.
- "constraints": The rules, formatting, or negative constraints (what NOT to do). If none, explain what's missing.
- "security_issues": Identify any potential prompt injection vulnerabilities or missing jailbreak protections. Be highly critical.

Return ONLY raw JSON, no markdown blocks."""

    try:
        completion = await client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Dissect this prompt:\n\n{req.prompt}"}
            ],
            temperature=0.1,
            response_format={"type": "json_object"}
        )
        
        result_str = completion.choices[0].message.content
        return json.loads(result_str)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
