import asyncio
from app.mcp.client import GeminiClient
import json

async def main():
    client = GeminiClient()
    # Mocking what routes.py does
    from app.mcp.tools import build_tool_prompt
    
    # User mock
    class UserMock:
        role = "SUPER_ADMIN"
        
    prompt = build_tool_prompt(UserMock(), is_voice=True)
    full_prompt = (
        f"{prompt}\n\n"
        f"User: அப்படியே டேக் அவே பேஜ்க்கு போயிட்டு அதுல மொத்தம் எத்தனை ஆர்டர்ஸ் இருக்குன்னு பார்த்து சொல்லு\n"
        "Respond with valid JSON only."
    )
    
    # Try text generation with json mime type
    base_url = client.base_url.replace("v1beta2", "v1beta")
    url = f"{base_url}/models/{client.model}:generateContent?key={client.api_key}"
    payload = {
        "contents": [{"parts": [{"text": full_prompt}]}],
        "generationConfig": {
            "temperature": 0.2,
            "maxOutputTokens": 1500,
            "responseMimeType": "application/json"
        }
    }
    
    import httpx
    async with httpx.AsyncClient(timeout=30) as http_client:
        response = await http_client.post(url, json=payload)
        body = response.json()
        print(json.dumps(body, indent=2, ensure_ascii=False))

asyncio.run(main())
