import re
import json

raw_text = '{"transcribed_user_text": "hello", "tool_name": "navigate_to_page", "params": {"page": "orders"}, "assistant_text": "Navig'

def salvage_json(text):
    result = {}
    
    # Try to find tool_name
    tool_match = re.search(r'"tool_name"\s*:\s*(null|"[^"]+")', text)
    if tool_match:
        val = tool_match.group(1)
        result["tool_name"] = None if val == "null" else val.strip('"')
        
    # Try to find params
    params_match = re.search(r'"params"\s*:\s*({[^}]*})', text)
    if params_match:
        try:
            result["params"] = json.loads(params_match.group(1))
        except:
            result["params"] = {}
            
    # Try to find transcribed_user_text
    txt_match = re.search(r'"transcribed_user_text"\s*:\s*"([^"]+)"', text)
    if txt_match:
        result["transcribed_user_text"] = txt_match.group(1)
        
    return result if result else None

print(salvage_json(raw_text))
