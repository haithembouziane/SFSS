// Define all 3 API endpoints with correct ports
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';  // Crop Prediction
const YIELD_API_URL = import.meta.env.VITE_YIELD_API_URL || 'http://localhost:5001';  // Yield Prediction
const BREEDING_API_URL = import.meta.env.VITE_BREEDING_API_URL || 'http://localhost:5002';  // Genetics

export const predictCrop = async (formData) => {
  try {
    const response = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        N: parseFloat(formData.N),
        P: parseFloat(formData.P),
        K: parseFloat(formData.K),
        temperature: parseFloat(formData.temperature),
        humidity: parseFloat(formData.humidity),
        ph: parseFloat(formData.ph),
        rainfall: parseFloat(formData.rainfall)
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Prediction error:', error);
    throw error;
  }
};

export const predictYield = async (formData) => {
  try {
    const response = await fetch(`${YIELD_API_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Rainfall_mm: parseFloat(formData.rainfall),
        Temperature_Celsius: parseFloat(formData.temperature || 0),
        Soil_Type: formData.soilType,
        Crop: formData.crop,
        Weather_Condition: formData.weatherConditions,
        Fertilizer_Used: formData.fertilizerUsed === 'yes',
        Irrigation_Used: formData.irrigationUsed === 'yes',
      }),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `API error: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Yield prediction error:', error);
    throw error;
  }
};

// ✅ NEW: Add breeding/genetics API call
export const predictBreeding = async (uploadedJson, mode = 'realistic') => {
  try {
    const payload = {
      ...uploadedJson,
      mode: mode,
    };

    const response = await fetch(`${BREEDING_API_URL}/api/breeding`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Breeding prediction error:', error);
    throw error;
  }
};

export const getPredictionHistory = async () => {
  try {
    const response = await fetch(`${API_URL}/history`);
    return await response.json();
  } catch (error) {
    console.error('History fetch error:', error);
    throw error;
  }
};