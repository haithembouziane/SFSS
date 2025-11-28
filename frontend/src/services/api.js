const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const predictCrop = async (formData) => {
  const response = await fetch(`${API_URL}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });
  
  if (!response.ok) {
    throw new Error('Prediction failed');
  }
  
  return response.json();
};

export const getPredictionHistory = async () => {
  const response = await fetch(`${API_URL}/history`);
  return response.json();
};

export const predictYield = async (formData) => {
  const response = await fetch(`${API_URL}/yield-predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });
  
  if (!response.ok) {
    throw new Error('Yield prediction failed');
  }
  
  return response.json();
};