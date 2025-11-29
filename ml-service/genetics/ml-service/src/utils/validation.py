"""Input validation utilities for crop prediction."""

REQUIRED_FEATURES = [
    'N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall',
    'soil_moisture', 'soil_type', 'sunlight_exposure', 'wind_speed',
    'co2_concentration', 'organic_matter', 'irrigation_frequency',
    'crop_density', 'pest_pressure', 'fertilizer_usage', 'growth_stage',
    'urban_area_proximity', 'water_source_type', 'frost_risk',
    'water_usage_efficiency'
]

NUMERIC_FEATURES = [
    'N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall',
    'soil_moisture', 'wind_speed', 'co2_concentration', 'organic_matter',
    'irrigation_frequency', 'crop_density', 'pest_pressure',
    'fertilizer_usage', 'urban_area_proximity', 'frost_risk',
    'water_usage_efficiency'
]

CATEGORICAL_FEATURES = ['soil_type', 'sunlight_exposure', 'growth_stage', 'water_source_type']


def validate_features(features_dict):
    """
    Validate input features.

    Args:
        features_dict: Dictionary of input features

    Returns:
        Tuple (is_valid, error_message)
    """
    # Check all required features present
    missing = set(REQUIRED_FEATURES) - set(features_dict.keys())
    if missing:
        return False, f"Missing features: {', '.join(missing)}"

    # Check numeric features are numbers
    for feat in NUMERIC_FEATURES:
        try:
            float(features_dict[feat])
        except (ValueError, TypeError):
            return False, f"Feature '{feat}' must be numeric"

    return True, None


def validate_batch(features_list):
    """Validate list of feature dictionaries."""
    if not isinstance(features_list, list):
        return False, "Input must be a list of feature dictionaries"

    if len(features_list) == 0:
        return False, "Empty list provided"

    for i, item in enumerate(features_list):
        is_valid, error = validate_features(item)
        if not is_valid:
            return False, f"Item {i}: {error}"

    return True, None
