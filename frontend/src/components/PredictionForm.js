import React from 'react';

const PredictionForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = React.useState({
    N: '',
    P: '',
    K: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: '',
    soil_moisture: '',
    soil_type: 'Loamy',
    sunlight_exposure: 'High',
    wind_speed: '',
    co2_concentration: '',
    organic_matter: '',
    irrigation_frequency: '',
    crop_density: '',
    pest_pressure: '',
    fertilizer_usage: '',
    growth_stage: 'Vegetative',
    urban_area_proximity: '',
    water_source_type: 'Rainwater',
    frost_risk: 'Low',
    water_usage_efficiency: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="prediction-form">
      <div className="form-grid">
        {/* Numeric Inputs */}
        <div className="form-group">
          <label htmlFor="N">N (Nitrogen)</label>
          <input
            type="number"
            id="N"
            name="N"
            value={formData.N}
            onChange={handleChange}
            step="0.1"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="P">P (Phosphorus)</label>
          <input
            type="number"
            id="P"
            name="P"
            value={formData.P}
            onChange={handleChange}
            step="0.1"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="K">K (Potassium)</label>
          <input
            type="number"
            id="K"
            name="K"
            value={formData.K}
            onChange={handleChange}
            step="0.1"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="temperature">Temperature (°C)</label>
          <input
            type="number"
            id="temperature"
            name="temperature"
            value={formData.temperature}
            onChange={handleChange}
            step="0.1"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="humidity">Humidity (%)</label>
          <input
            type="number"
            id="humidity"
            name="humidity"
            value={formData.humidity}
            onChange={handleChange}
            step="0.1"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="ph">pH</label>
          <input
            type="number"
            id="ph"
            name="ph"
            value={formData.ph}
            onChange={handleChange}
            step="0.1"
            required
          />
        </div>

        {/* Categorical Inputs */}
        <div className="form-group">
          <label htmlFor="soil_type">Soil Type</label>
          <select
            id="soil_type"
            name="soil_type"
            value={formData.soil_type}
            onChange={handleChange}
            required
          >
            <option>Loamy</option>
            <option>Sandy</option>
            <option>Clay</option>
            <option>Silt</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="sunlight_exposure">Sunlight Exposure</label>
          <select
            id="sunlight_exposure"
            name="sunlight_exposure"
            value={formData.sunlight_exposure}
            onChange={handleChange}
            required
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="growth_stage">Growth Stage</label>
          <select
            id="growth_stage"
            name="growth_stage"
            value={formData.growth_stage}
            onChange={handleChange}
            required
          >
            <option>Germination</option>
            <option>Vegetative</option>
            <option>Flowering</option>
            <option>Fruiting</option>
            <option>Maturity</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="water_source_type">Water Source</label>
          <select
            id="water_source_type"
            name="water_source_type"
            value={formData.water_source_type}
            onChange={handleChange}
            required
          >
            <option>Rainwater</option>
            <option>Groundwater</option>
            <option>Surface Water</option>
            <option>Irrigation</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="frost_risk">Frost Risk</label>
          <select
            id="frost_risk"
            name="frost_risk"
            value={formData.frost_risk}
            onChange={handleChange}
            required
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="submit-btn"
      >
        {loading ? 'Predicting...' : 'Predict Crop'}
      </button>
    </form>
  );
};

export default PredictionForm;
