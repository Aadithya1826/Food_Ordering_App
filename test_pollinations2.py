import requests
import urllib.parse
import time

for item in ["Aloo Gobi", "Channa Masala", "Veg Koftha"]:
    prompt_text = f"Professional food photography of {item}, appetizing, beautiful plating, high quality"
    encoded_prompt = urllib.parse.quote(prompt_text)
    url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=600&height=600&nologo=true"
    
    print(f"Requesting {item}...")
    try:
        response = requests.get(url, timeout=30)
        print(f"Status: {response.status_code}, Length: {len(response.content)}")
    except Exception as e:
        print(f"Error: {e}")
    time.sleep(1)
