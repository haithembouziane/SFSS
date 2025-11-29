import React, { useState } from 'react';
import DashboardHeader from '../components/DashboardHeader';
import bgImage from '../assets/bg.png';
import Footer from '../components/Footer';
import { predictBreeding } from '../services/api';  // ✅ Import the new function

const Genitics = () => {
  const [uploadedJson, setUploadedJson] = useState(null);
  const [backendResult, setBackendResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('realistic'); // 'realistic' or 'simple'

  const handleJsonFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target.result);
        setUploadedJson(jsonData);
        setBackendResult(null); // reset previous result
      } catch (error) {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!uploadedJson) {
      alert('Please upload a JSON file first.');
      return;
    }

    setLoading(true);
    try {
      // ✅ Use the new API function instead of hardcoded fetch
      const data = await predictBreeding(uploadedJson, mode);
      setBackendResult(data);
    } catch (error) {
      console.error('Error calling backend:', error);
      alert('Error calling backend API: ' + (error.message || error));
    } finally {
      setLoading(false);
    }
  };

  // Display final generation traits if available, otherwise fallback to expected_f1_traits
  const finalTraits = backendResult?.final_generation_traits || backendResult?.multi_generation_result?.final_trait_means || null;
  const displayedTraits = finalTraits
    ? finalTraits
    : backendResult?.expected_f1_traits || uploadedJson || null;

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <DashboardHeader />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Upload & Submit */}
            <div className="space-y-6">
              {/* JSON Upload Card */}
              <div
                className="relative rounded-2xl overflow-hidden shadow-md"
                style={{
                  background: 'linear-gradient(135deg, #C4A574 0%, #B8956A 100%)',
                  borderTop: '4px solid #D4B896',
                  borderBottom: '2px solid #A08560',
                }}
              >
                <div className="p-4 relative z-10">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2L4 8v12h16V8l-8-6zm0 2.5L18 9v9H6V9l6-4.5z" />
                      </svg>
                    </div>
                    <h3 className="text-base font-bold text-dark drop-shadow-md">
                      Upload Traits JSON
                    </h3>
                  </div>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleJsonFileUpload}
                    className="w-full px-3 py-2 rounded-lg bg-white/95 text-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/50 shadow-inner file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#6B7A3E] file:text-white hover:file:bg-[#8B9A5E] cursor-pointer"
                  />
                </div>
              </div>

              

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={loading || !uploadedJson}
                className="w-full py-3 rounded-xl font-bold text-white text-base shadow-lg transition-all duration-300 hover:shadow-xl disabled:opacity-50 hover:scale-[1.02] relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #8B9A5E 0%, #6B7A3E 100%)',
                }}
              >
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,.1) 2px, rgba(255,255,255,.1) 4px)',
                  }}
                ></div>

                {loading ? (
                  <span className="flex items-center justify-center relative z-10">
                    <svg
                      className="animate-spin h-5 w-5 mr-2"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center relative z-10">
                    Submit Analysis
                    <svg
                      className="w-5 h-5 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                )}
              </button>
            </div>

            {/* Right Side - Display JSON (uploaded or result) */}
            <div className="space-y-6">
              {backendResult ? (
                <div className="space-y-6">
                  {/* Best Cross Card */}
                  <div
                    className="relative rounded-3xl shadow-md p-6"
                    style={{
                      background: 'linear-gradient(135deg, #4A6F5A 0%, #385544 100%)',
                      border: '3px solid #6FA47A',
                    }}
                  >
                    <h2 className="text-xl font-bold text-white mb-2 drop-shadow-md">
                      Best Cross Recommendation
                    </h2>
                    <p className="text-white/90 text-lg">
                      {backendResult.best_cross.parent1} × {backendResult.best_cross.parent2}
                    </p>
                    <p className="text-white/80 mt-2 text-sm">
                      These parents are predicted to give the best overall offspring for the selected traits.
                    </p>
                  </div>

                  {/* Final Generation Traits Table */}
                  <div
                    className="relative rounded-3xl shadow-md p-6"
                    style={{
                      background: 'linear-gradient(135deg, #7A8A5E 0%, #6B7A4E 100%)',
                      border: '3px solid #8B9A6E',
                    }}
                  >
                    <h2 className="text-xl font-bold text-white mb-4 drop-shadow-md">
                      Final Generation Traits
                    </h2>
                    <div className="bg-white/95 rounded-2xl p-4 overflow-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr>
                            <th className="text-left px-3 py-2 font-semibold text-gray-700">
                              Trait
                            </th>
                            <th className="text-left px-3 py-2 font-semibold text-gray-700">
                              Score (0–1)
                            </th>
                            <th className="text-left px-3 py-2 font-semibold text-gray-700">
                              Approx. %
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {displayedTraits && Object.entries(displayedTraits).length > 0 ? (
                            Object.entries(displayedTraits).map(
                              ([trait, value]) => {
                                // value might be 0-10 (final generation) or 0-1 (fallback expected_f1_traits)
                                const is010 = value > 1.01; // heuristic: trait value in 0-10
                                const normalized = is010 ? value / 10 : value;
                                return (
                                  <tr key={trait} className="border-t border-gray-200">
                                    <td className="px-3 py-2 text-gray-800">
                                      {trait.replace('_', ' ')}
                                    </td>
                                    <td className="px-3 py-2 text-gray-800">
                                      {normalized.toFixed(3)}
                                    </td>
                                    <td className="px-3 py-2 text-gray-800">
                                      {(normalized * 100).toFixed(1)}%
                                    </td>
                                  </tr>
                                );
                              }
                            )
                          ) : (
                            <tr>
                              <td className="px-3 py-2 text-gray-800" colSpan={3}>
                                No trait data available.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Breeding Summary Card (Final Generation) */}
                  <div
                    className="relative rounded-3xl shadow-md p-6"
                    style={{
                      background: 'linear-gradient(135deg, #5F7A7F 0%, #4A6165 100%)',
                      border: '3px solid #7FA3AA',
                    }}
                  >
                    <h2 className="text-xl font-bold text-white mb-3 drop-shadow-md">
                      Final Generation Summary
                    </h2>
                    <div className="bg-white/10 rounded-2xl p-4 text-white">
                      <p className="text-white/90">
                        Final mean fitness:{' '}
                        <span className="font-semibold">
                          {backendResult?.multi_generation_result?.final_mean_fitness !== undefined
                            ? (backendResult.multi_generation_result.final_mean_fitness * 100).toFixed(1) + '%'
                            : 'N/A'}
                        </span>
                      </p>
                      <p className="text-white/90 mt-1">
                        Final std. fitness:{' '}
                        <span className="font-semibold">
                          {backendResult?.multi_generation_result?.final_std_fitness !== undefined
                            ? (backendResult.multi_generation_result.final_std_fitness * 100).toFixed(1) + '%'
                            : 'N/A'}
                        </span>
                      </p>
                      <p className="text-white/90 mt-1">
                        Generations to target (80%):{' '}
                        <span className="font-semibold">
                          {backendResult?.multi_generation_result?.generations_to_target ?? backendResult.generations_to_80_percent}
                        </span>
                      </p>
                    </div>

                    {Array.isArray(backendResult?.multi_generation_result?.generation_progress) && (
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold text-white mb-2">Generation Progress</h3>
                        <div className="bg-white/95 rounded-2xl p-4 overflow-auto">
                          <table className="min-w-full text-sm">
                            <thead>
                              <tr>
                                <th className="text-left px-3 py-2 font-semibold text-gray-700">Gen</th>
                                <th className="text-left px-3 py-2 font-semibold text-gray-700">Mean</th>
                                <th className="text-left px-3 py-2 font-semibold text-gray-700">Std</th>
                              </tr>
                            </thead>
                            <tbody>
                              {backendResult.multi_generation_result.generation_progress.map((g, idx) => {
                                const meanVal = g.mean_fitness !== undefined ? g.mean_fitness : g.mean;
                                const stdVal = g.std_fitness !== undefined ? g.std_fitness : g.std;
                                return (
                                  <tr key={idx} className="border-t border-gray-200">
                                    <td className="px-3 py-2 text-gray-800">{g.generation}</td>
                                    <td className="px-3 py-2 text-gray-800">{(meanVal * 100).toFixed(1)}%</td>
                                    <td className="px-3 py-2 text-gray-800">{(stdVal * 100).toFixed(1)}%</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    <p className="text-white/75 mt-3 text-sm">
                      Estimates reflect simulated multi-generation selection. Real programs vary with environment and management.
                    </p>
                  </div>
                </div>
              ) : uploadedJson ? (
                <div
                  className="relative rounded-3xl h-full min-h-[600px] flex items-center justify-center p-8"
                  style={{
                    background: 'linear-gradient(135deg, #7A8A5E 0%, #6B7A4E 100%)',
                    border: '3px solid #8B9A6E',
                  }}
                >
                  <div className="text-center">
                    <svg
                      className="w-20 h-20 mx-auto mb-4 text-white/40"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                    </svg>
                    <h3 className="text-2xl font-bold text-white mb-3 drop-shadow-md">
                      File Uploaded
                    </h3>
                    <p className="text-white/80 max-w-md text-lg">
                      Your JSON file is loaded. Click &quot;Submit Analysis&quot; on the left to run
                      the breeding simulation and view the recommendations here.
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  className="relative rounded-3xl h-full min-h-[600px] flex items-center justify-center p-8"
                  style={{
                    background: 'linear-gradient(135deg, #7A8A5E 0%, #6B7A4E 100%)',
                    border: '3px solid #8B9A6E',
                  }}
                >
                  <div className="text-center">
                    <svg
                      className="w-24 h-24 mx-auto mb-6 text-white/40"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                    </svg>
                    <h3 className="text-2xl font-bold text-white mb-3 drop-shadow-md">
                      No Data Yet
                    </h3>
                    <p className="text-white/80 max-w-md text-lg">
                      Upload a JSON file on the left, then click &quot;Submit Analysis&quot; to see
                      the breeding results here.
                    </p>
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

export default Genitics;
