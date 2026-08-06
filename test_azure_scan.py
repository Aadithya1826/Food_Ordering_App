import os
import sys

# Need to add backend to sys.path if not running as module
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend.app.utils.azure_scanner import AzureScanner

with open('/home/aadithya-s/.gemini/antigravity/brain/54ca9112-875e-4f4e-b0d9-3925097e363b/media__1785416629119.jpg', 'rb') as f:
    content = f.read()

scanner = AzureScanner()
try:
    results = scanner.scan_inventory_sheet(content)
    print("SUCCESS")
    print(results)
except Exception as e:
    import traceback
    traceback.print_exc()
