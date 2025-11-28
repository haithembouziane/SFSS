# app.py
from flask import Flask, request, jsonify
import joblib
from flask_cors import CORS
import joblib
import pandas as pd
import json
import os
from datetime import datetime

# Config
MODEL_PATH = os.environ.get('MODEL_PATH', 'crop_label_pipeline.joblib')
LABEL_MAP_PATH = os.environ.get('LABEL_MAP_PATH', 'label_map.json')
PORT = int(os.environ.get('PORT', '8000'))
HOST = os.environ.get('HOST', '0.0.0.0')
OUTPUT_DIR = os.environ.get('OUTPUT_DIR', '../predictions')  # Folder for Java API to read

# Initialize app
app = Flask(__name__)
CORS(app)  # enable CORS for browsers

# Load model
try:
    pipe = joblib.load(MODEL_PATH)
except Exception as e:
    raise RuntimeError(f"Failed to load model from {MODEL_PATH}: {e}")

# Load label map (optional)
code_to_label = None
if os.path.exists(LABEL_MAP_PATH):
    try:
        with open(LABEL_MAP_PATH, 'r') as f:
            label_map = json.load(f)
            # Reverse the mapping: code -> label
            code_to_label = {str(v): k for k, v in label_map.items()}
    except Exception as e:
        print(f"Warning: Failed to load label map {LABEL_MAP_PATH}: {e}")

# Note: Use the same feature keys as training; ColumnTransformer expects them.

def save_prediction_to_file(result):
    """Save prediction result to a JSON file in OUTPUT_DIR"""
    try:
        # Create output directory if it doesn't exist
        os.makedirs(OUTPUT_DIR, exist_ok=True)
        
        # Generate filename with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")[:-3]  # Include milliseconds
        filename = f"prediction_{timestamp}.json"
        filepath = os.path.join(OUTPUT_DIR, filename)
        
        # Save to file
        with open(filepath, 'w') as f:
            json.dump(result, f, indent=2)
        
        print(f"✅ Prediction saved to: {filepath}")
        return filepath
    except Exception as e:
        print(f"⚠️ Warning: Failed to save prediction to file: {e}")
        return None

@app.route('/', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'message': 'Use POST /predict with JSON body of features.'
    }), 200

@app.route('/predict', methods=['GET', 'POST'])
def predict():
    # If accessed via GET (e.g., browser), show usage instead of 405
    if request.method == 'GET':
        return jsonify({
            'message': 'Use POST /predict with JSON body of features',
            'example': {
                'N': 90, 'P': 42, 'K': 43, 'temperature': 22.5, 'humidity': 85.0, 'ph': 6.3, 'rainfall': 120.0
            }
        }), 200

    if not request.is_json:
        return jsonify({'error': 'Content-Type must be application/json'}), 400
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({'error': 'Invalid or empty JSON body'}), 400

    # Accept single object or array of objects
    if isinstance(data, dict):
        df = pd.DataFrame([data])
    elif isinstance(data, list):
        if len(data) == 0:
            return jsonify({'error': 'Empty list provided'}), 400
        df = pd.DataFrame(data)
    else:
        return jsonify({'error': 'JSON must be an object or a list of objects'}), 400

    try:
        preds = pipe.predict(df)
    except Exception as e:
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

    # Map codes to labels if mapping available
    if code_to_label:
        labels = [code_to_label.get(str(int(c)), str(int(c))) for c in preds]
    else:
        labels = [int(c) for c in preds]

    # Build response
    if isinstance(data, dict):
        result = {**data, 'pred_label': labels[0]}
    else:
        result = [
            {**d, 'pred_label': l}
            for d, l in zip(data, labels)
        ]
    
    # Save prediction to file for Java API to read
    save_prediction_to_file(result)
    
    return jsonify(result), 200

if __name__ == '__main__':
    app.run(host=HOST, port=PORT)