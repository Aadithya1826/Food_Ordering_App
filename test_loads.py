from app.mcp.client import GeminiClient
import json

client = GeminiClient()
raw_text = '{"a": "hello } oops"}'
print("Current:", client._try_parse_json(raw_text))

def try_parse_better(raw_text):
    trimmed = raw_text.strip()
    if trimmed.startswith("```json"): trimmed = trimmed[7:]
    elif trimmed.startswith("```"): trimmed = trimmed[3:]
    if trimmed.endswith("```"): trimmed = trimmed[:-3]
    trimmed = trimmed.strip()
    
    try:
        return json.loads(trimmed)
    except json.JSONDecodeError:
        pass
    
    json_text = client._extract_first_json_object(trimmed)
    if not json_text: return None
    try:
        return json.loads(json_text)
    except json.JSONDecodeError:
        return None

print("Better:", try_parse_better(raw_text))
