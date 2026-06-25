import asyncio
from backend.app.mcp.client import GeminiClient

async def test():
    client = GeminiClient()
    try:
        res = await client.generate_json("Hello", max_tokens=100)
        print("generate_json success:", res)
    except Exception as e:
        print("generate_json error:", e)

asyncio.run(test())
