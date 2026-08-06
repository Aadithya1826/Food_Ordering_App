import asyncio
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.app.mcp.client import GeminiClient
from backend.app.mcp.tools import build_tool_prompt

class MockUser:
    role = "SUPER_ADMIN"
    restaurant_id = 1

async def main():
    client = GeminiClient()
    prompt = build_tool_prompt(MockUser(), is_voice=False)
    
    full_prompt = (
        f"{prompt}\n\n"
        f"User: இதுல செஷ்வான் மஷ்ரூம் நூடுல்ஸ் இருக்கான்னு பாரு\n"
        "Respond with valid JSON only."
    )
    
    print("Asking Gemini...")
    parsed = await client.generate_json(full_prompt)
    print("Gemini parsed response:", parsed)

if __name__ == "__main__":
    asyncio.run(main())
