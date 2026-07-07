from app.mcp.client import GeminiClient

client = GeminiClient()
raw_text = """
{"transcribed_user_text": "அப்படியே டேக் அவே பேஜ்க்கு போயிட்டு அதுல மொத்தம் எத்தனை ஆர்டர்ஸ் இருக்குன்னு பார்த்து சொல்லு",
"tool_name": "navigate_to_page", "params": {"page": "orders"},
"assistant_text": "ஆர்டர்ஸ் பேஜ் ஓபன் ஆகிடுச்சு. டேக் அவே ஆர்டர்களை மட்டும் தனியா பார்க்கறது..."}
"""
print(client._try_parse_json(raw_text))
