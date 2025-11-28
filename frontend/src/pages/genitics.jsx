import React, { useState } from 'react';
import DashboardHeader from '../components/DashboardHeader';
import { Link } from 'react-router-dom';
import bgImage from '../assets/bg.png';
import Footer from '../components/Footer';

const CropPrediction = () => {
  const [formData, setFormData] = useState({
    soilType: 'Loam',
    crop: 'Wheat',
    rainfall: '',
    fertilizerUsed: 'yes',
    irrigationUsed: 'yes',
    weatherConditions: 'sunny',
    yieldTonsPerHectare: ''
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [extractedTraits, setExtractedTraits] = useState(null); // Added missing state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setPrediction({
        predictedYield: (Math.random() * 3 + 3).toFixed(2)
      });
      setLoading(false);
    }, 1500);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleJsonFileUpload = (e, fieldName) => {
    const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const traitsData = JSON.parse(event.target.result);
          setExtractedTraits(traitsData.extractedTraits || traitsData); // Set extracted traits
          handleInputChange(fieldName, traitsData.type || traitsData.soilType || 'Loam');
        } catch (error) {
          alert('Invalid available_traits.json file');
        }
      };
      reader.readAsText(file);
    
  };
  
  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${bgImage})` }}>
      <DashboardHeader />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Side - Input Form */}
            <div className="space-y-6">
              {/* Soil Type Layer - JSON Upload */}
              <div className="relative rounded-2xl overflow-hidden shadow-md" style={{
                background: 'linear-gradient(135deg, #C4A574 0%, #B8956A 100%)',
                borderTop: '4px solid #D4B896',
                borderBottom: '2px solid #A08560'
              }}>
                <div className="p-4 relative z-10">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L4 8v12h16V8l-8-6zm0 2.5L18 9v9H6V9l6-4.5z"/>
                      </svg>
                    </div>
                    <h3 className="text-base font-bold text-dark drop-shadow-md">Soil Type</h3>
                  </div>
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => handleJsonFileUpload(e, 'soilType')}
                    className="w-full px-3 py-2 rounded-lg bg-white/95 text-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/50 shadow-inner file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#6B7A3E] file:text-white hover:file:bg-[#8B9A5E] cursor-pointer"
                  />
                </div>
              </div>

              {/* <div className="relative rounded-2xl overflow-hidden shadow-md" style={{
                background: 'linear-gradient(135deg, #C4A574 0%, #B8956A 100%)',
                borderTop: '4px solid #D4B896',
                borderBottom: '2px solid #A08560'
              }}>
                <div className="p-4 relative z-10">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L4 8v12h16V8l-8-6zm0 2.5L18 9v9H6V9l6-4.5z"/>
                      </svg>
                    </div>
                    <h3 className="text-base font-bold text-white drop-shadow-md">Soil Type</h3>
                  </div>
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => handleJsonFileUpload(e, 'soilType')}
                    className="w-full px-3 py-2 rounded-lg bg-white/95 text-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/50 shadow-inner file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#6B7A3E] file:text-white hover:file:bg-[#8B9A5E] cursor-pointer"
                  />
                </div>
              </div> */}
              
              {/* Submit Button */}
              <button
                onClick={handleSubmit}
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
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center relative z-10">
                    Submit Analysis
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                )}
              </button>
            </div>

            {/* Right Side - Analysis Results */}
            <div className="space-y-6">
              {extractedTraits ? (
                <div className="relative rounded-3xl overflow-auto shadow-md p-6" style={{
                  background: 'linear-gradient(135deg, #7A8A5E 0%, #6B7A4E 100%)',
                  border: '3px solid #8B9A6E',
                  maxHeight: '600px'
                }}>
                  <h2 className="text-xl font-bold text-white mb-4 drop-shadow-md">Extracted Traits</h2>
                  <div className="bg-white/95 rounded-2xl p-6 overflow-auto max-h-[500px]">
                    <pre className="text-sm text-gray-800 font-mono whitespace-pre-wrap">
                      {JSON.stringify(extractedTraits, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-3xl h-full min-h-[600px] flex items-center justify-center p-8" style={{
                  background: 'linear-gradient(135deg, #7A8A5E 0%, #6B7A4E 100%)',
                  border: '3px solid #8B9A6E'
                }}>
                  <div className="text-center">
                    <svg className="w-24 h-24 mx-auto mb-6 text-white/40" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                    </svg>
                    <h3 className="text-2xl font-bold text-white mb-3 drop-shadow-md">No Analysis Results Yet</h3>
                    <p className="text-white/80 max-w-md text-lg">Upload available_traits.json on the left to see extracted traits analysis.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CropPrediction;
