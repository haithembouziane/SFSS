const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
const BREEDING_API_URL = import.meta.env.VITE_BREEDING_API_URL || 'http://localhost:5000';

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

// Breeding endpoints (Flask ml-service)
export const fetchBreedingTraits = async () => {
  const res = await fetch(`${BREEDING_API_URL}/breeding/traits`);
  if (!res.ok) throw new Error('Failed to fetch breeding traits');
  return res.json();
};

export const processBreeding = async (wantedTraits, traitWeights = {}) => {
  const body = { wanted_traits: wantedTraits, trait_weights: traitWeights };
  const res = await fetch(`${BREEDING_API_URL}/breeding/process`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Failed to process breeding');
  return res.json();
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