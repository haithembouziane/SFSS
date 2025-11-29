from __future__ import annotations
import os
import json
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Any, Dict

import joblib
import pandas as pd

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass


# Expected features for the yield model
REQUIRED_FEATURES = [
    'Rainfall_mm',
    'Temperature_Celsius',
    'Soil_Type',
    'Crop',
    'Weather_Condition',
    'Fertilizer_Used',
    'Irrigation_Used',
]


# Defaults can be overridden by environment variables
# DEFAULT_MODEL_PATH points to the local model directory
DEFAULT_MODEL_PATH = os.environ.get('YIELD_MODEL_PATH', str(Path(__file__).resolve().parent.parent / 'model' / 'linear_regression_pipeline.pkl'))
DEFAULT_OUTPUT_DIR = os.environ.get('YIELD_OUTPUT_DIR', str(Path(__file__).resolve().parent.parent / 'output'))


@dataclass
class Resources:
    model: Any
    model_features: list[str] | None = None


def load_resources(model_path: str | None = None) -> Resources:
    """Load the trained pipeline model and ensure output directory exists.

    Adds model feature metadata for better error messages.
    """
    model_path = model_path or DEFAULT_MODEL_PATH
    if not os.path.exists(model_path):
        raise FileNotFoundError(
            f"Yield model file not found: {model_path}. Set YIELD_MODEL_PATH env or place the file accordingly.")

    os.makedirs(DEFAULT_OUTPUT_DIR, exist_ok=True)
    model = joblib.load(model_path)
    # Attempt to detect feature names on the loaded estimator/pipeline
    model_features = None
    for attr in ("feature_names_in_", "n_features_in_"):
        if hasattr(model, attr):
            if attr == "feature_names_in_":
                try:
                    model_features = list(getattr(model, attr))
                except Exception:
                    model_features = None
            break
    return Resources(model=model, model_features=model_features)


def _normalize_input(data: Dict[str, Any]) -> Dict[str, Any]:
    """Cast fields to expected types; keep categorical as strings."""
    features = dict(data)
    # Numeric casts
    features['Rainfall_mm'] = float(features['Rainfall_mm'])
    features['Temperature_Celsius'] = float(features['Temperature_Celsius'])
    # Booleans: accept true/false, yes/no, 1/0
    def to_bool(v: Any) -> bool:
        s = str(v).strip().lower()
        return s in ('true', 'yes', '1')

    features['Fertilizer_Used'] = to_bool(features['Fertilizer_Used'])
    features['Irrigation_Used'] = to_bool(features['Irrigation_Used'])
    # Categorical remain strings: Soil_Type, Crop, Weather_Condition
    return features


def predict_yield(resources: Resources, input_data: Dict[str, Any]) -> Dict[str, Any]:
    """Run prediction and return a JSON dict including inputs and output.

    Saves result into DEFAULT_OUTPUT_DIR with a timestamped filename.
    """
    # Validate presence of required yield features
    missing = [f for f in REQUIRED_FEATURES if f not in input_data]
    if missing:
        raise ValueError(f"Missing required yield features: {', '.join(missing)}")

    # If the loaded model expects a different feature set, surface a clear diagnostic
    if resources.model_features and set(resources.model_features) != set(REQUIRED_FEATURES):
        raise ValueError(
            "Loaded model feature mismatch. The loaded model expects: "
            f"{resources.model_features}. Yield endpoint expects: {REQUIRED_FEATURES}. "
            "Ensure YIELD_MODEL_PATH points to your yield regression model (e.g. linear_regression_pipeline.pkl)."
        )

    features = _normalize_input(input_data)

    # Build dataframe with the exact order of columns expected by the pipeline
    row = {f: features[f] for f in REQUIRED_FEATURES}
    df = pd.DataFrame([row])

    y = float(resources.model.predict(df)[0])

    result = {
        **features,
        'predicted_yield': round(y, 2),
    }

    # Persist JSON output (without unit and model fields)
    ts = datetime.now().strftime('%Y%m%d_%H%M%S_%f')[:-3]
    out_file = os.path.join(DEFAULT_OUTPUT_DIR, f'yield_prediction_{ts}.json')
    try:
        with open(out_file, 'w') as f:
            json.dump(result, f, indent=2)
        result['output_file'] = out_file
    except Exception as e:
        # Do not fail request because of FS issues; include warning
        result['save_warning'] = f"Failed to save output: {e}"

    return result


if __name__ == '__main__':
    res = load_resources()
    sample = {
        'Rainfall_mm': 1000.0,
        'Temperature_Celsius': 25.5,
        'Soil_Type': 'Loam',
        'Crop': 'rice',
        'Weather_Condition': 'Sunny',
        'Fertilizer_Used': True,
        'Irrigation_Used': True,
    }
    print(json.dumps(predict_yield(res, sample), indent=2))
