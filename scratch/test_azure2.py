import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from app.utils.azure_scanner import AzureScanner

try:
    scanner = AzureScanner()
    scanner.client.begin_analyze_document("prebuilt-layout", body=b"test data")
    print("SUCCESS")
except Exception as e:
    print(f"ERROR: {e}")
