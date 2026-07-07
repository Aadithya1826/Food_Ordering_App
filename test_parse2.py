from app.mcp.client import GeminiClient

client = GeminiClient()
raw_text = """
{"transcribed_user_text": "hello",
"tool_name": "navigate_to_page", "params": {"page": "orders"},
"assistant_text": "Okay, navigate to orders } oops"}
"""
print(client._try_parse_json(raw_text))
