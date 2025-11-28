"""Flask REST API for crop prediction."""

import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from src.models.predictor import CropPredictor
from src.utils.validation import validate_features, validate_batch

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
MODEL_PATH = os.getenv('MODEL_PATH', 'crop_label_pipeline.joblib')
LABEL_MAP_PATH = os.getenv('LABEL_MAP_PATH', 'label_map.json')
PORT = int(os.getenv('PORT', 5000))
HOST = os.getenv('HOST', '0.0.0.0')

# Initialize predictor
try:
    predictor = CropPredictor(MODEL_PATH, LABEL_MAP_PATH)
except Exception as e:
    print(f"Error loading model: {e}")
    predictor = None


@app.route('/', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'service': 'Crop Predictor API',
        'version': '1.0.0'
    }), 200


@app.route('/predict', methods=['GET', 'POST'])
def predict():
    """
    Predict crop label from features.

    POST /predict: Accepts JSON with features or list of features
    GET /predict: Returns usage instructions
    """
    if request.method == 'GET':
        return jsonify({
            'message': 'Use POST /predict with JSON features',
            'example': {
                'N': 50, 'P': 40, 'K': 50, 'temperature': 25.5,
                'humidity': 80, 'ph': 7.0, 'rainfall': 100,
                'soil_moisture': 40, 'soil_type': 'Loamy',
                'sunlight_exposure': 'High', 'wind_speed': 2.5,
                'co2_concentration': 400, 'organic_matter': 5,
                'irrigation_frequency': 3, 'crop_density': 100,
                'pest_pressure': 2, 'fertilizer_usage': 50,
                'growth_stage': 'Vegetative', 'urban_area_proximity': 5,
                'water_source_type': 'Rainwater', 'frost_risk': 'Low',
                'water_usage_efficiency': 0.8
            }
        }), 200

    # POST request
    if not request.is_json:
        return jsonify({'error': 'Content-Type must be application/json'}), 400

    try:
        data = request.get_json()

        # Handle single prediction
        if isinstance(data, dict):
            is_valid, error = validate_features(data)
            if not is_valid:
                return jsonify({'error': error}), 400

            result = predictor.predict(data)
            return jsonify(result), 200

        # Handle batch prediction
        elif isinstance(data, list):
            is_valid, error = validate_batch(data)
            if not is_valid:
                return jsonify({'error': error}), 400

            results = predictor.predict_batch(data)
            return jsonify({'predictions': results}), 200

        else:
            return jsonify({'error': 'Expected dict or list of dicts'}), 400

    except json.JSONDecodeError:
        return jsonify({'error': 'Invalid JSON'}), 400
    except Exception as e:
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors."""
    return jsonify({'error': 'Endpoint not found'}), 404


@app.errorhandler(500)
def server_error(error):
    """Handle 500 errors."""
    return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    if predictor is None:
        print("ERROR: Model failed to load. Exiting.")
        exit(1)

    print(f"Starting Crop Predictor API on {HOST}:{PORT}")
    app.run(host=HOST, port=PORT, debug=False)
