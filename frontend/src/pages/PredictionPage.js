import React, { useState } from 'react';
import axios from 'axios';
import PredictionForm from '../components/PredictionForm';
import ResultDisplay from '../components/ResultDisplay';
import './PredictionPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const PredictionPage = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(`${API_URL}/predict`, formData);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Prediction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prediction-page">
      <div className="container">
        <header className="page-header">
          <h1>🌾 Crop Predictor</h1>
          <p>Get AI-powered crop recommendations based on your soil and environmental conditions</p>
        </header>

        <div className="content-wrapper">
          <PredictionForm onSubmit={handleSubmit} loading={loading} />
          <ResultDisplay result={result} error={error} />
        </div>
      </div>
    </div>
  );
};

export default PredictionPage;
