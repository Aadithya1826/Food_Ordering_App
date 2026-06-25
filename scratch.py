import json

def _extract_first_json_object(text: str) -> str | None:
    start_index = None
    depth = 0

    for index, char in enumerate(text):
        if char == "{":
            if start_index is None:
                start_index = index
            depth += 1
        elif char == "}" and start_index is not None:
            depth -= 1
            if depth == 0:
                return text[start_index:index + 1]

    return None

text = '{"transcribed_user_text": "", "tool_name": null, "params": {}, "assistant_text": "Sorry, I didn\'t catch that. Could you please repeat what you said?"}'
print(_extract_first_json_object(text))
