"""Inference utility for crop type prediction using optimized 7-feature pipeline.

Usage:
    from predictor_service import load_resources, predict_crop
    resources = load_resources()
    result = predict_crop(resources, {
        "N":90, "P":42, "K":43, "temperature":20.88, "humidity":82, "ph":6.5, "rainfall":202.94
    })

Simplified result example:
    {
      "input": {
        "N": 90.0, "P": 42.0, "K": 43.0,
        "temperature": 20.88, "humidity": 82.0, "ph": 6.5, "rainfall": 202.94
      },
      "prediction": { "crop_label": "rice" }
    }
"""
from __future__ import annotations
import json
from pathlib import Path
from typing import Dict, Any
import pandas as pd
import joblib
import os

# Use absolute paths relative to script location
_SERVICE_DIR = Path(__file__).resolve().parent
_MODEL_DIR = _SERVICE_DIR.parent / 'model'
_DATA_DIR = _SERVICE_DIR.parent / 'data'

MODEL_PATH = Path(os.environ.get('CROP_MODEL_PATH', str(_MODEL_DIR / 'crop_label_pipeline.joblib')))
LABEL_MAP_PATH = Path(os.environ.get('CROP_LABEL_MAP_PATH', str(_DATA_DIR / 'label_map.json')))
REQUIRED_FEATURES = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
class Resources:
    def __init__(self, model, label_map):
        self.model = model
        # label_map: label -> code; build inverse
        self.label_to_code = label_map
        self.code_to_label = {v: k for k, v in label_map.items()}


def load_resources() -> Resources:
    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"Model file not found: {MODEL_PATH}. Train or place the joblib file.")
    if not LABEL_MAP_PATH.exists():
        raise FileNotFoundError(
            f"Label map file not found: {LABEL_MAP_PATH}. Run label_map_gen.py first.")
    model = joblib.load(MODEL_PATH)
    with LABEL_MAP_PATH.open() as f:
        label_map = json.load(f)
    return Resources(model=model, label_map=label_map)


def _validate_input(input_data: Dict[str, Any]) -> None:
    missing = [f for f in REQUIRED_FEATURES if f not in input_data]
    if missing:
        raise ValueError(f"Missing required features: {missing}")
    # Basic numeric validation
    for f in REQUIRED_FEATURES:
        try:
            float(input_data[f])
        except (TypeError, ValueError):
            raise ValueError(f"Feature '{f}' must be numeric, got {input_data[f]!r}")


def predict_crop(resources: Resources, input_data: Dict[str, Any]) -> Dict[str, Any]:
    """Return flat JSON object with specified key order.

    Order: K, N, P, humidity, ph, pred_label, rainfall, temperature.
    """
    _validate_input(input_data)
    df = pd.DataFrame([{f: float(input_data[f]) for f in REQUIRED_FEATURES}])
    pred_code = int(resources.model.predict(df)[0])
    label = resources.code_to_label.get(pred_code, f"UNKNOWN_CODE_{pred_code}")
    # Prepare ordered output
    ordered_keys = ['K', 'N', 'P', 'humidity', 'ph', 'pred_label', 'rainfall', 'temperature']
    # Build values map (add pred_label)
    values = {k: float(input_data[k]) for k in REQUIRED_FEATURES}
    values['pred_label'] = label
    flat_output = {k: values[k] for k in ordered_keys}
    return flat_output

if __name__ == '__main__':
    resources = load_resources()
    sample = {"N":90, "P":42, "K":43, "temperature":20.88, "humidity":82, "ph":6.5, "rainfall":202.94}
    out = predict_crop(resources, sample)
    print(json.dumps(out, indent=2))
