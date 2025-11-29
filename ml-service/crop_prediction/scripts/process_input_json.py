#!/usr/bin/env python3
"""Process an input JSON file (single object or list of objects) and
produce an output JSON with predicted crop labels appended as 'pred_label'.

Usage:
    python process_input_json.py input.json output.json

Input JSON formats supported:
1. Single object:
   {
     "N": 90, "P": 42, "K": 43, "temperature": 20.88,
     "humidity": 82, "ph": 6.5, "rainfall": 202.94
   }
2. List of objects:
   [ { ... }, { ... }, ... ]

Output:
   If single object -> a single flat object (same keys + pred_label)
   If list -> list of flat objects
"""
import sys
import json
from pathlib import Path
from typing import List, Dict, Any
from service.predictor_service import load_resources, predict_crop, REQUIRED_FEATURES

def load_input(path: Path):
    with path.open() as f:
        data = json.load(f)
    return data

def validate_record(rec: Dict[str, Any]):
    missing = [k for k in REQUIRED_FEATURES if k not in rec]
    if missing:
        raise ValueError(f"Missing required keys: {missing}")
    return rec

def process_single(resources, rec: Dict[str, Any]):
    validate_record(rec)
    return predict_crop(resources, rec)

def main(argv: List[str]):
    if len(argv) < 3:
        print("Usage: python process_input_json.py <input.json> <output.json>")
        return 1
    in_path = Path(argv[1])
    out_path = Path(argv[2])
    if not in_path.exists():
        print(f"Input file not found: {in_path}")
        return 1
    resources = load_resources()
    data = load_input(in_path)
    if isinstance(data, dict):
        result = process_single(resources, data)
    elif isinstance(data, list):
        result = [process_single(resources, rec) for rec in data]
    else:
        print("Input JSON must be an object or list of objects")
        return 1
    with out_path.open('w') as f:
        json.dump(result, f, indent=2)
    print(f"Wrote predictions to {out_path}")
    return 0

if __name__ == '__main__':
    sys.exit(main(sys.argv))
