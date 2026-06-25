import os
from azure.ai.documentintelligence import DocumentIntelligenceClient
from azure.core.credentials import AzureKeyCredential
from dotenv import load_dotenv

load_dotenv()

endpoint = os.getenv("AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT")
key = os.getenv("AZURE_DOCUMENT_INTELLIGENCE_KEY")

print(f"Endpoint: {endpoint}")
print(f"Key (masked): {key[:5]}...{key[-5:] if key else ''}")

try:
    client = DocumentIntelligenceClient(endpoint, AzureKeyCredential(key))
    # Try a simple operation
    # Since we don't have a file, we can't really test analysis without one.
    # But we can check if it initializes.
    print("Client initialized successfully.")
except Exception as e:
    print(f"Error: {e}")
