import React from 'react';

const ResultDisplay = ({ result, error }) => {
  if (!result && !error) {
    return null;
  }

  return (
    <div className={`result-container ${error ? 'error' : 'success'}`}>
      {error ? (
        <div className="error-message">
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      ) : (
        <div className="success-message">
          <h3>Prediction Result</h3>
          <div className="result-content">
            <div className="result-code">
              <span className="label">Crop Code:</span>
              <span className="value">{result.code}</span>
            </div>
            {result.label && (
              <div className="result-label">
                <span className="label">Recommended Crop:</span>
                <span className="value">{result.label}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;
