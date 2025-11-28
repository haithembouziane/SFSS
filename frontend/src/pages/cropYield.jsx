import React, { useState } from 'react';
import DashboardHeader from '../components/DashboardHeader';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-green-50">
      <DashboardHeader />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Side - Input Form */}
            <div className="space-y-3">
              
              {/* Soil Type Layer - Topsoil */}
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
                    <h3 className="text-base font-bold text-white drop-shadow-md">Soil Type</h3>
                  </div>
                  <select 
                    value={formData.soilType}
                    onChange={(e) => handleInputChange('soilType', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/95 text-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/50 shadow-inner"
                  >
                    <option>Loam</option>
                    <option>Sandy</option>
                    <option>Clay</option>
                    <option>Silty</option>
                    <option>Peaty</option>
                    <option>Chalky</option>
                  </select>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-black/10 to-transparent"></div>
              </div>

              {/* Crop Layer - Subsoil */}
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
                        <path d="M12 2c-1.1 0-2 .9-2 2v3c0 .55.45 1 1 1s1-.45 1-1V4c0-.55-.45-1-1-1zm0 16c-.55 0-1 .45-1 1v3c0 1.1.9 2 2 2s2-.9 2-2v-3c0-.55-.45-1-1-1z"/>
                        <path d="M18 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                      </svg>
                    </div>
                    <h3 className="text-base font-bold text-white drop-shadow-md">Crop Type</h3>
                  </div>
                  <select 
                    value={formData.crop}
                    onChange={(e) => handleInputChange('crop', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/95 text-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/50 shadow-inner"
                  >
                    <option>Wheat</option>
                    <option>Rice</option>
                    <option>Corn</option>
                    <option>Barley</option>
                    <option>Soybean</option>
                    <option>Cotton</option>
                    <option>Sugarcane</option>
                    <option>Potato</option>
                  </select>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-black/15 to-transparent"></div>
              </div>

              {/* Rainfall Layer */}
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
                    <h3 className="text-base font-bold text-white drop-shadow-md">Rainfall (mm)</h3>
                  </div>
                  <input 
                    type="number"
                    step="0.1"
                    value={formData.rainfall}
                    onChange={(e) => handleInputChange('rainfall', e.target.value)}
                    placeholder="Enter annual rainfall"
                    className="w-full px-3 py-2 rounded-lg bg-white/95 text-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/50 shadow-inner placeholder:text-gray-500"
                  />
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-black/20 to-transparent"></div>
              </div>

              {/* Fertilizer & Irrigation Layer */}
              <div className="relative rounded-2xl overflow-hidden shadow-md" style={{
                background: 'linear-gradient(135deg, #6B7A3E 0%, #5A6A2E 100%)',
                borderTop: '3px solid #7D8C4F',
                borderBottom: '3px solid #4A5A1E'
              }}>
                <svg className="absolute top-0 left-0 right-0 w-full h-3" preserveAspectRatio="none" viewBox="0 0 1440 48">
                  <path d="M0,24 Q360,0 720,24 T1440,24 L1440,0 L0,0 Z" fill="#7A6A4A" opacity="0.3"/>
                </svg>
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: 'repeating-linear-gradient(60deg, transparent, transparent 4px, rgba(255,255,255,.05) 4px, rgba(255,255,255,.05) 8px)'
                }}></div>
                
                <div className="p-4 pt-6 space-y-3 relative z-10">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                        </svg>
                      </div>
                      <h3 className="text-base font-bold text-white drop-shadow-md">Fertilizer</h3>
                    </div>
                    <select 
                      value={formData.fertilizerUsed}
                      onChange={(e) => handleInputChange('fertilizerUsed', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white/95 text-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/50 shadow-inner"
                    >
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/>
                        </svg>
                      </div>
                      <h3 className="text-base font-bold text-white drop-shadow-md">Irrigation</h3>
                    </div>
                    <select 
                      value={formData.irrigationUsed}
                      onChange={(e) => handleInputChange('irrigationUsed', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white/95 text-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/50 shadow-inner"
                    >
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-black/20 to-transparent"></div>
              </div>

              {/* Weather Conditions Layer */}
              <div className="relative rounded-2xl overflow-hidden shadow-md" style={{
                background: 'linear-gradient(135deg, #5A6A4E 0%, #4A5A3E 100%)',
                borderTop: '2px solid #6B7A5E',
                borderBottom: '3px solid #3A4A2E'
              }}>
                <svg className="absolute top-0 left-0 right-0 w-full h-3" preserveAspectRatio="none" viewBox="0 0 1440 48">
                  <path d="M0,24 Q360,48 720,24 T1440,24 L1440,0 L0,0 Z" fill="#6B7A3E" opacity="0.3"/>
                </svg>
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: 'repeating-linear-gradient(120deg, transparent, transparent 3px, rgba(255,255,255,.05) 3px, rgba(255,255,255,.05) 6px)'
                }}></div>
                
                <div className="p-4 pt-5 relative z-10">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1z"/>
                      </svg>
                    </div>
                    <h3 className="text-base font-bold text-white drop-shadow-md">Weather</h3>
                  </div>
                  <select 
                    value={formData.weatherConditions}
                    onChange={(e) => handleInputChange('weatherConditions', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/95 text-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/50 shadow-inner"
                  >
                    <option value="sunny">Sunny</option>
                    <option value="rainy">Rainy</option>
                    <option value="cloudy">Cloudy</option>
                  </select>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-black/25 to-transparent"></div>
              </div>

              {/* Yield Input Layer - Bedrock */}
              <div className="relative rounded-2xl overflow-hidden shadow-lg" style={{
                background: 'linear-gradient(135deg, #4A5A3E 0%, #3A4A2E 100%)',
                borderTop: '3px solid #5A6A4E',
                borderBottom: '4px solid #2A3A1E'
              }}>
                <svg className="absolute top-0 left-0 right-0 w-full h-3" preserveAspectRatio="none" viewBox="0 0 1440 48">
                  <path d="M0,24 Q360,0 720,24 T1440,24 L1440,0 L0,0 Z" fill="#5A6A4E" opacity="0.3"/>
                </svg>
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(255,255,255,.03) 4px, rgba(255,255,255,.03) 8px)'
                }}></div>
                
                <div className="p-4 pt-5 relative z-10">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                      </svg>
                    </div>
                    <h3 className="text-base font-bold text-white drop-shadow-md">Yield (Tons/Ha)</h3>
                  </div>
                  <input 
                    type="number"
                    step="0.01"
                    value={formData.yieldTonsPerHectare}
                    onChange={(e) => handleInputChange('yieldTonsPerHectare', e.target.value)}
                    placeholder="Enter expected yield"
                    className="w-full px-3 py-2 rounded-lg bg-white/95 text-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/50 shadow-inner placeholder:text-gray-500"
                  />
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-transparent via-black/30 to-transparent"></div>
              </div>

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

            {/* Right Side - Prediction Results */}
            <div className="space-y-6">
              {prediction ? (
                <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{
                  background: 'linear-gradient(135deg, #7A8A5E 0%, #6B7A4E 100%)',
                  border: '3px solid #8B9A6E'
                }}>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full -ml-24 -mb-24"></div>
                  
                  <div className="relative p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Predicted Crop Yield</h2>
                    
                    <div className="bg-white/95 rounded-2xl p-8 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-600 font-medium">Expected Yield</span>
                        <div className="flex items-center space-x-2">
                          <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L4 8v12h16V8l-8-6zm0 2.5L18 9v9H6V9l6-4.5z"/>
                          </svg>
                        </div>
                      </div>
                      <div className="text-5xl font-bold text-[#6B7A3E] mb-2">
                        {prediction.predictedYield}
                      </div>
                      <div className="text-gray-600 font-medium">Tonnes/Hectare</div>
                    </div>

                    <div className="bg-white/90 rounded-xl p-6">
                      <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                        </svg>
                        Prediction Details
                      </h3>
                      <div className="space-y-2 text-sm text-gray-700">
                        <div className="flex justify-between py-2 border-b border-gray-200">
                          <span className="font-medium">Soil Type:</span>
                          <span>{formData.soilType}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-200">
                          <span className="font-medium">Crop:</span>
                          <span>{formData.crop}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-200">
                          <span className="font-medium">Rainfall:</span>
                          <span>{formData.rainfall} mm</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-200">
                          <span className="font-medium">Fertilizer:</span>
                          <span className="capitalize">{formData.fertilizerUsed}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-200">
                          <span className="font-medium">Irrigation:</span>
                          <span className="capitalize">{formData.irrigationUsed}</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="font-medium">Weather:</span>
                          <span className="capitalize">{formData.weatherConditions}</span>
                        </div>
                      </div>
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
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                    </svg>
                    <h3 className="text-2xl font-bold text-white mb-3">No Prediction Yet</h3>
                    <p className="text-white/80 max-w-md">Fill in the form on the left and click "Submit for Analysis" to see your crop yield prediction results here.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropPrediction;