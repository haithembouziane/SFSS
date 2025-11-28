import joblib
import pandas as pd
import json
from pathlib import Path


class CropPredictor:
    """Wrapper class for crop prediction model."""

    def __init__(self, model_path, label_map_path=None):
        """
        Initialize CropPredictor with model and optional label mapping.

        Args:
            model_path: Path to joblib pipeline file
            label_map_path: Path to JSON label mapping file (optional)
        """
        self.pipeline = joblib.load(model_path)
        self.label_map = {}

        if label_map_path and Path(label_map_path).exists():
            with open(label_map_path, 'r') as f:
                self.label_map = json.load(f)

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
        for pred in predictions:
            pred_code = int(pred)
            result = {'code': pred_code}
            if str(pred_code) in self.label_map:
                result['label'] = self.label_map[str(pred_code)]
            results.append(result)
        
        return results
