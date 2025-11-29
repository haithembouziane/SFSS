import React, { useState } from "react";
import DashboardHeader from "../components/DashboardHeader";
import Footer from "../components/Footer";
import bgImage from '../assets/bg.png';
import { predictCrop } from "../services/api";

// Import all crop images from assets
import riceImg from '../assets/rice.jpeg';
import maizeImg from '../assets/maize.jpeg';
import chickpeaImg from '../assets/chickpea.jpeg';
import kidneybeansImg from '../assets/kidneybeans.jpeg';
import pigeonpeasImg from '../assets/pigeonpeas.jpeg';
import mothbeansImg from '../assets/mothbeans.jpeg';
import mungbeanImg from '../assets/mungbean.jpeg';
import blackgramImg from '../assets/blackgram.jpeg';
import lentilImg from '../assets/lentil.jpeg';
import pomegranateImg from '../assets/pomegranate.jpeg';
import bananaImg from '../assets/banana.jpeg';
import mangoImg from '../assets/mango.jpeg';
import grapesImg from '../assets/grapes.jpeg';
import watermelonImg from '../assets/watermelon.jpeg';
import muskelonImg from '../assets/muskmelon.jpeg';
import appleImg from '../assets/apple.jpeg';
import orangeImg from '../assets/orange.jpeg';
import papayaImg from '../assets/papaya.jpeg';
import coconutImg from '../assets/coconut.jpeg';
import cottonImg from '../assets/cotton.jpeg';
import juteImg from '../assets/jute.jpeg';
import coffeeImg from '../assets/coffee.jpeg';

// --- Crop Images ---
const cropImages = {
  rice: riceImg,
  maize: maizeImg,
  chickpea: chickpeaImg,
  kidneybeans: kidneybeansImg,
  pigeonpeas: pigeonpeasImg,
  mothbeans: mothbeansImg,
  mungbean: mungbeanImg,
  blackgram: blackgramImg,
  lentil: lentilImg,
  pomegranate: pomegranateImg,
  banana: bananaImg,
  mango: mangoImg,
  grapes: grapesImg,
  watermelon: watermelonImg,
  muskmelon: muskelonImg,
  apple: appleImg,
  orange: orangeImg,
  papaya: papayaImg,
  coconut: coconutImg,
  cotton: cottonImg,
  jute: juteImg,
  coffee: coffeeImg
};

export default function CropPrediction() {
  const [formData, setFormData] = useState({
    N: "",
    P: "",
    K: "",
    humidity: "",
    ph: "",
    rainfall: "",
    temperature: ""
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    }));
    setError(null); // Clear error when user types
  };

  const validateForm = () => {
    const required = ['N', 'P', 'K', 'humidity', 'ph', 'rainfall', 'temperature'];
    const missing = required.filter(field => !formData[field] || formData[field] === '');
    
    if (missing.length > 0) {
      setError(`Please fill in all fields: ${missing.join(', ')}`);
      return false;
    }
    
    // Also validate that all values are valid numbers
    for (let field of required) {
      const num = parseFloat(formData[field]);
      if (isNaN(num)) {
        setError(`${field} must be a valid number`);
        return false;
      }
    }
    
    return true;
  };

  const predictCropHandler = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await predictCrop(formData);
      console.log('Prediction response:', response);
      
      // Handle response from ML service
      const cropLabel = response.pred_label || response.label || 'Unknown';
      setResult({
        label: cropLabel,
        input: formData,
        timestamp: new Date().toLocaleString(),
        fullResponse: response
      });
      
    } catch (err) {
      console.error('Prediction error:', err);
      setError(`Prediction failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${bgImage})` }}>
      <DashboardHeader />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* LEFT SIDE — FULL INPUT FORM */}
          <div className="space-y-3">
            
            {/* Error Alert */}
            {error && (
              <div className="rounded-2xl overflow-hidden shadow-md p-4 bg-red-100 border-l-4 border-red-500">
                <p className="text-red-800 font-semibold">{error}</p>
              </div>
            )}
            
            {/* Soil Layer - Topsoil */}
            <div className="relative rounded-2xl overflow-hidden shadow-md" style={{
              background: 'linear-gradient(135deg, #C4A574 0%, #B8956A 100%)',
              borderTop: '4px solid #D4B896',
              borderBottom: '2px solid #A08560'
            }}>
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,.05) 2px, rgba(0,0,0,.05) 4px)'
              }}></div>
              
              <div className="p-4 relative z-10">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L4 8v12h16V8l-8-6zm0 2.5L18 9v9H6V9l6-4.5z"/>
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-white drop-shadow-md">Soil Layer</h3>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-white text-sm font-semibold mb-1">N (Nitrogen)</label>
                    <input
                      type="number"
                      name="N"
                      value={formData.N}
                      onChange={handleChange}
                      placeholder="Enter nitrogen level"
                      className="w-full px-3 py-2 rounded-lg bg-white/95 text-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/50 shadow-inner placeholder:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-semibold mb-1">P (Phosphorus)</label>
                    <input
                      type="number"
                      name="P"
                      value={formData.P}
                      onChange={handleChange}
                      placeholder="Enter phosphorus level"
                      className="w-full px-3 py-2 rounded-lg bg-white/95 text-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/50 shadow-inner placeholder:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-semibold mb-1">K (Potassium)</label>
                    <input
                      type="number"
                      name="K"
                      value={formData.K}
                      onChange={handleChange}
                      placeholder="Enter potassium level"
                      className="w-full px-3 py-2 rounded-lg bg-white/95 text-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/50 shadow-inner placeholder:text-gray-500"
                    />
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-black/10 to-transparent"></div>
            </div>

            {/* Climate Layer - Subsoil */}
            <div className="relative rounded-2xl overflow-hidden shadow-md" style={{
              background: 'linear-gradient(135deg, #A0704A 0%, #8B5E3C 100%)',
              borderTop: '2px solid #B8956A',
              borderBottom: '2px solid #76502E'
            }}>
              <svg className="absolute top-0 left-0 right-0 w-full h-3" preserveAspectRatio="none" viewBox="0 0 1440 48">
                <path d="M0,24 Q360,0 720,24 T1440,24 L1440,0 L0,0 Z" fill="#C4A574" opacity="0.3"/>
              </svg>
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(0,0,0,.05) 3px, rgba(0,0,0,.05) 6px)'
              }}></div>
              
              <div className="p-4 pt-5 relative z-10">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1z"/>
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-white drop-shadow-md">Climate Layer</h3>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-white text-sm font-semibold mb-1">Humidity (%)</label>
                    <input
                      type="number"
                      name="humidity"
                      value={formData.humidity}
                      onChange={handleChange}
                      placeholder="Enter humidity percentage"
                      className="w-full px-3 py-2 rounded-lg bg-white/95 text-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/50 shadow-inner placeholder:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-semibold mb-1">Temperature (°C)</label>
                    <input
                      type="number"
                      name="temperature"
                      value={formData.temperature}
                      onChange={handleChange}
                      placeholder="Enter temperature"
                      className="w-full px-3 py-2 rounded-lg bg-white/95 text-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/50 shadow-inner placeholder:text-gray-500"
                    />
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-black/15 to-transparent"></div>
            </div>

            {/* Water & Soil Quality Layer */}
            <div className="relative rounded-2xl overflow-hidden shadow-md" style={{
              background: 'linear-gradient(135deg, #7A6A4A 0%, #5E5236 100%)',
              borderTop: '2px solid #8B7B5A',
              borderBottom: '2px solid #4D4229'
            }}>
              <svg className="absolute top-0 left-0 right-0 w-full h-3" preserveAspectRatio="none" viewBox="0 0 1440 48">
                <path d="M0,24 Q360,48 720,24 T1440,24 L1440,0 L0,0 Z" fill="#A0704A" opacity="0.3"/>
              </svg>
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,.05) 2px, rgba(0,0,0,.05) 4px)'
              }}></div>
              
              <div className="p-4 pt-5 relative z-10">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2c-3.31 0-6 2.69-6 6 0 4.5 6 10 6 10s6-5.5 6-10c0-3.31-2.69-6-6-6zm0 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-white drop-shadow-md">Water & Soil Quality</h3>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-white text-sm font-semibold mb-1">Rainfall (mm)</label>
                    <input
                      type="number"
                      name="rainfall"
                      value={formData.rainfall}
                      onChange={handleChange}
                      placeholder="Enter rainfall amount"
                      className="w-full px-3 py-2 rounded-lg bg-white/95 text-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/50 shadow-inner placeholder:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-semibold mb-1">Soil pH</label>
                    <input
                      type="number"
                      step="0.1"
                      name="ph"
                      value={formData.ph}
                      onChange={handleChange}
                      placeholder="Enter soil pH"
                      className="w-full px-3 py-2 rounded-lg bg-white/95 text-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/50 shadow-inner placeholder:text-gray-500"
                    />
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-black/20 to-transparent"></div>
            </div>

            {/* Submit Button */}
            <button
              onClick={predictCropHandler}
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white text-base shadow-lg transition-all duration-300 hover:shadow-xl disabled:opacity-50 hover:scale-[1.02] relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #8B9A5E 0%, #6B7A3E 100%)'
              }}
            >
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,.1) 2px, rgba(255,255,255,.1) 4px)'
              }}></div>
              
              {loading ? (
                <span className="flex items-center justify-center relative z-10">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Predicting...
                </span>
              ) : (
                <span className="flex items-center justify-center relative z-10">
                  Predict Crop
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              )}
            </button>
          </div>

          {/* RIGHT SIDE — PREDICTION RESULTS */}
          <div className="space-y-6">
            {result ? (
              <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{
                background: 'linear-gradient(135deg, #7A8A5E 0%, #6B7A4E 100%)',
                border: '3px solid #8B9A6E'
              }}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full -ml-24 -mb-24"></div>
                
                <div className="relative p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Prediction Result</h2>
                  
                  <div className="bg-white/95 rounded-2xl p-6 mb-6">
                    <h3 className="text-3xl font-bold text-[#6B7A3E] mb-4 capitalize text-center">
                      {result.label}
                    </h3>
                    <img
                      src={cropImages[result.label.toLowerCase()] || cropImages.rice}
                      alt={result.label}
                      className="w-full h-64 object-cover rounded-xl shadow-lg"
                    />
                  </div>

                  <div className="bg-white/90 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                      </svg>
                      Input Parameters
                    </h3>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="font-medium">Nitrogen (N):</span>
                        <span>{result.input.N}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="font-medium">Phosphorus (P):</span>
                        <span>{result.input.P}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="font-medium">Potassium (K):</span>
                        <span>{result.input.K}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="font-medium">Humidity:</span>
                        <span>{result.input.humidity}%</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="font-medium">Temperature:</span>
                        <span>{result.input.temperature}°C</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="font-medium">Rainfall:</span>
                        <span>{result.input.rainfall} mm</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="font-medium">Soil pH:</span>
                        <span>{result.input.ph}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-xs text-gray-600 text-center">
                    <p>Prediction Time: {result.timestamp}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative rounded-3xl overflow-hidden shadow-2xl h-full min-h-[600px] flex items-center justify-center" style={{
                background: 'linear-gradient(135deg, #7A8A5E 0%, #6B7A4E 100%)',
                border: '3px solid #8B9A6E'
              }}>
                <div className="text-center p-8">
                  <svg className="w-24 h-24 mx-auto mb-6 text-white/40" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2c-1.1 0-2 .9-2 2v3c0 .55.45 1 1 1s1-.45 1-1V4c0-.55-.45-1-1-1zm0 16c-.55 0-1 .45-1 1v3c0 1.1.9 2 2 2s2-.9 2-2v-3c0-.55-.45-1-1-1z"/>
                  </svg>
                  <h3 className="text-2xl font-bold text-white mb-3">No Prediction Yet</h3>
                  <p className="text-white/80 max-w-md">Fill in all fields and click "Predict Crop" to get your recommendation. Results will be automatically downloaded as JSON.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    <Footer />
    </div>
  );
}