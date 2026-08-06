import sys
import os
import traceback

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from app.utils.azure_scanner import AzureScanner

try:
    scanner = AzureScanner()
    if not scanner.client:
        print("CLIENT IS NONE")
    else:
        print("CLIENT INITIALIZED")
        # Try to scan a dummy file
        scanner.scan_inventory_sheet(b"dummy image data")
except Exception as e:
    print("EXCEPTION CAUGHT:")
    traceback.print_exc()
