import time
import asyncio
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from groq import AsyncGroq
import os

router = APIRouter(prefix="/diff", tags=["diff"])

client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))

class CompareRequest(BaseModel):
    prompt_a: str
    prompt_b: str
    model: str = "llama-3.1-8b-instant"

async def run_prompt(prompt: str, model: str):
    start_time = time.time()
    try:
        completion = await client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=1024,
        )
        latency = round((time.time() - start_time) * 1000)
        return {
            "output": completion.choices[0].message.content,
            "latency_ms": latency,
            "tokens": {
                "prompt_tokens": completion.usage.prompt_tokens,
                "completion_tokens": completion.usage.completion_tokens,
                "total_tokens": completion.usage.total_tokens
            }
        }
    except Exception as e:
        return {
            "output": f"Error: {str(e)}",
            "latency_ms": 0,
            "tokens": {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0}
        }

@router.post("/compare")
async def compare_prompts(req: CompareRequest):
    if not req.prompt_a.strip() or not req.prompt_b.strip():
        raise HTTPException(status_code=400, detail="Both prompts must be provided")
        
    # Run both prompts concurrently
    result_a, result_b = await asyncio.gather(
        run_prompt(req.prompt_a, req.model),
        run_prompt(req.prompt_b, req.model)
    )
    
    return {
        "variant_a": result_a,
        "variant_b": result_b
    }
