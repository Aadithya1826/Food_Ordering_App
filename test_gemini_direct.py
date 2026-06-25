import os
import asyncio
import httpx
from dotenv import load_dotenv

async def main():
    load_dotenv()
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("NO KEY")
        return

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    payload = {
        "contents": [{"parts": [{"text": "Hello"}]}],
        "generationConfig": {
            "temperature": 0.2,
            "maxOutputTokens": 600,
        }
    }
    
    async with httpx.AsyncClient() as client:
        res = await client.post(url, json=payload)
        print("Status:", res.status_code)
        if res.status_code != 200:
            print("Error body:", res.text)
        else:
            print("Success")

if __name__ == "__main__":
    asyncio.run(main())
