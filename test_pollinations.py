import requests

prompt = "professional food photography of aloo gobi, 4k, beautifully plated"
url = f"https://image.pollinations.ai/prompt/{requests.utils.quote(prompt)}?width=600&height=600&nologo=true"

response = requests.get(url)
print(f"Status Code: {response.status_code}")
if response.status_code == 200:
    print(f"Content Type: {response.headers.get('content-type')}")
    print(f"Content Length: {len(response.content)}")
else:
    print(response.text)
