import os
from backend.app.utils.azure_scanner import AzureScanner

scanner = AzureScanner()
results_list = [
    [
        {"name": "Idly", "open_stock": 1, "purchase": 2, "total": 3, "issue": 4, "balance": -1, "unit": "units"}
    ]
]
print(scanner.merge_scanned_results(results_list))
