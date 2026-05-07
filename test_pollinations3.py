import requests
url = "https://image.pollinations.ai/prompt/apple?width=100&height=100"
response = requests.get(url, timeout=10)
print(response.status_code)
