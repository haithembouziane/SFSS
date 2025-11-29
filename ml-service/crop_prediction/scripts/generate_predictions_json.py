#!/usr/bin/env python3
"""Legacy script retained for backward compatibility.
Redirects to process_input_json.py; prefer using that instead.
"""
import sys
from process_input_json import main as process_main

if __name__ == '__main__':
    # If arguments supplied, pass through; else show usage.
    if len(sys.argv) == 1:
        print("Use: python process_input_json.py <input.json> <output.json>")
        print("This wrapper no longer supports hardcoded TEST_CASES.")
    else:
        process_main(sys.argv)
