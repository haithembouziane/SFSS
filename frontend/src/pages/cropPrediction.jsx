import React, { useState } from "react";
import DashboardHeader from "../components/DashboardHeader";
import Footer from "../components/Footer";
import bgImage from '../assets/bg.png';

// --- Crop Images ---
const cropImages = {
  rice: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
  maize: "https://images.unsplash.com/photo-1524592094714-0f0654e20314",
  chickpea: "https://images.unsplash.com/photo-1605478374329-e58aab6fa410",
  kidneybeans: "https://images.unsplash.com/photo-1506806732259-39c2d0268443",
  pigeonpeas: "https://images.unsplash.com/photo-1615485297655-df3c34e65e4f",
  mothbeans: "https://images.unsplash.com/photo-1580934738413-d61a2d2b6b34",
  mungbean: "https://images.unsplash.com/photo-1622209152408-2f03f06abb52",
  blackgram: "https://images.unsplash.com/photo-1622481321218-ec3d815e4ee7",
  lentil: "https://images.unsplash.com/photo-1607690426272-0c7f3e20ad01",
  pomegranate: "https://images.unsplash.com/photo-1571047399553-4a58ba9a5b6c",
  banana: "https://images.unsplash.com/photo-1574226516831-e1dff420e43e",
  mango: "https://images.unsplash.com/photo-1508747703725-719777637510",
  grapes: "https://images.unsplash.com/photo-1506806732259-39c2d0268443",
  watermelon: "https://images.unsplash.com/photo-1560807707-8cc77767d783",
  muskmelon: "https://images.unsplash.com/photo-1622209152408-2f03f06abb52",
  apple: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce",
  orange: "https://images.unsplash.com/photo-1547514701-09c7b4a3a67b",
  papaya: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2",
  coconut: "https://images.unsplash.com/photo-1602526216439-dc1c2afe7f40",
  cotton: "https://images.unsplash.com/photo-1602526216439-dc1c2afe7f40",
  jute: "https://images.unsplash.com/photo-1556228598-512a82a3c3bb",
  coffee: "https://images.unsplash.com/photo-1509042239860-f550ce710b93"
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const predictCrop = () => {
    setLoading(true);
    setTimeout(() => {
      const crops = Object.keys(cropImages);
      const sample = crops[Math.floor(Math.random() * crops.length)];
      setResult(sample);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${bgImage})` }}>
      <DashboardHeader />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* LEFT SIDE — FULL INPUT FORM */}
          <div className="space-y-3">
            
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
              onClick={predictCrop}
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
                      {result}
                    </h3>
                    <img
                      src={cropImages[result]}
                      alt={result}
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
                        <span>{formData.N || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="font-medium">Phosphorus (P):</span>
                        <span>{formData.P || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="font-medium">Potassium (K):</span>
                        <span>{formData.K || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="font-medium">Humidity:</span>
                        <span>{formData.humidity ? `${formData.humidity}%` : 'N/A'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="font-medium">Temperature:</span>
                        <span>{formData.temperature ? `${formData.temperature}°C` : 'N/A'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="font-medium">Rainfall:</span>
                        <span>{formData.rainfall ? `${formData.rainfall} mm` : 'N/A'}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="font-medium">Soil pH:</span>
                        <span>{formData.ph || 'N/A'}</span>
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
                    <path d="M12 2c-1.1 0-2 .9-2 2v3c0 .55.45 1 1 1s1-.45 1-1V4c0-.55-.45-1-1-1zm0 16c-.55 0-1 .45-1 1v3c0 1.1.9 2 2 2s2-.9 2-2v-3c0-.55-.45-1-1-1z"/>
                    <path d="M18 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                  </svg>
                  <h3 className="text-2xl font-bold text-white mb-3">No Prediction Yet</h3>
                  <p className="text-white/80 max-w-md">Fill in the form on the left and click "Predict Crop" to see your recommended crop based on the soil and climate conditions.</p>
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