import asyncio
from app.mcp.client import GeminiClient

async def main():
    client = GeminiClient()
    prompt = """
You are a restaurant voice assistant.
Return only valid JSON with the keys: transcribed_user_text, tool_name, params, assistant_text.
For voice interactions, if the user speaks in a regional language (like Tamil or Hindi), you MUST write the 'assistant_text' in that exact native script.

User: அப்படியே டேக் அவே பேஜ்க்கு போயிட்டு அதுல மொத்தம் எத்தனை ஆர்டர்ஸ் இருக்குன்னு பார்த்து சொல்லு
Respond with valid JSON.
"""
    try:
        raw_text = await client.generate_text(prompt, response_mime_type="application/json")
        print(f"RAW: {raw_text}")
    except Exception as e:
        print(f"Error: {e}")

asyncio.run(main())
