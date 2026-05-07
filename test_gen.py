import os
from dotenv import load_dotenv
from google import genai

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
try:
    client = genai.Client(api_key=api_key)
    prompt = "A red apple"
    result = client.models.generate_images(
        model='imagen-4.0-fast-generate-001',
        prompt=prompt,
        config=dict(
            number_of_images=1,
            output_mime_type="image/jpeg",
            aspect_ratio="1:1"
        )
    )
    print("Success! Number of images:", len(result.generated_images))
except Exception as e:
    print("ERROR:", e)
