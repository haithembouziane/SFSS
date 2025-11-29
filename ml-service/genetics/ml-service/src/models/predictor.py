import joblib
import pandas as pd
import json
from pathlib import Path
import os
from datetime import datetime


class CropPredictor:
    """Wrapper class for crop prediction model."""

    def __init__(self, model_path, label_map_path=None, output_dir=None):
        """
        Initialize CropPredictor with model and optional label mapping.

        Args:
            model_path: Path to joblib pipeline file
            label_map_path: Path to JSON label mapping file (optional)
            output_dir: Directory to save prediction results (optional)
        """
        self.pipeline = joblib.load(model_path)
        self.label_map = {}
        self.output_dir = output_dir or 'predictions/crop_predictions'

        if label_map_path and Path(label_map_path).exists():
            with open(label_map_path, 'r') as f:
                self.label_map = json.load(f)
        
        # Create output directory if it doesn't exist
        os.makedirs(self.output_dir, exist_ok=True)

    def predict(self, features_dict):
        """
        Predict crop label from features dictionary.

        Args:
            features_dict: Dictionary with feature names as keys

        Returns:
            Dictionary with 'code' and 'label' (if mapping exists)
        """
        # Convert dict to DataFrame for sklearn pipeline
        df = pd.DataFrame([features_dict])
        
        # Get prediction
        prediction_code = int(self.pipeline.predict(df)[0])
        
        result = {'code': prediction_code}
        if str(prediction_code) in self.label_map:
            result['label'] = self.label_map[str(prediction_code)]
        
        # Include input features
        result = {**features_dict, **result}
        
        # Save to file
        self._save_prediction(result)
        
        return result

    def predict_batch(self, features_list):
        """
        Predict crop labels for multiple samples.

        Args:
            features_list: List of feature dictionaries

        Returns:
            List of prediction results
        """
        df = pd.DataFrame(features_list)
        predictions = self.pipeline.predict(df)
        
        results = []
        for features, pred in zip(features_list, predictions):
            pred_code = int(pred)
            result = {'code': pred_code}
            if str(pred_code) in self.label_map:
                result['label'] = self.label_map[str(pred_code)]
            
            # Include input features
            result = {**features, **result}
            results.append(result)
        
        # Save batch to file
        self._save_prediction(results)
        
        return results
    
    def _save_prediction(self, result):
        """Save prediction result to JSON file."""
        try:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")[:-3]
            filename = f"crop_prediction_{timestamp}.json"
            filepath = os.path.join(self.output_dir, filename)
            
            with open(filepath, 'w') as f:
                json.dump(result, f, indent=2)
            
            print(f"✅ Crop prediction saved to: {filepath}")
        except Exception as e:
            print(f"⚠️ Warning: Failed to save crop prediction: {e}")