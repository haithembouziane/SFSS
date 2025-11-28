# API Documentation

## ML Service API (Python Flask)

### Base URL
```
http://localhost:5000
```

### Endpoints

#### 1. Health Check
```
GET /
```

**Response:**
```json
{
  "status": "healthy",
  "service": "Crop Predictor API",
  "version": "1.0.0"
}
```

#### 2. Get Usage Instructions
```
GET /predict
```

**Response:**
```json
{
  "message": "Use POST /predict with JSON features",
  "example": {
    "N": 50,
    "P": 40,
    "K": 50,
    "temperature": 25.5,
    "humidity": 80,
    "ph": 7.0,
    "rainfall": 100,
    "soil_moisture": 40,
    "soil_type": "Loamy",
    "sunlight_exposure": "High",
    "wind_speed": 2.5,
    "co2_concentration": 400,
    "organic_matter": 5,
    "irrigation_frequency": 3,
    "crop_density": 100,
    "pest_pressure": 2,
    "fertilizer_usage": 50,
    "growth_stage": "Vegetative",
    "urban_area_proximity": 5,
    "water_source_type": "Rainwater",
    "frost_risk": "Low",
    "water_usage_efficiency": 0.8
  }
}
```

#### 3. Single Prediction
```
POST /predict
Content-Type: application/json
```

**Request Body:**
```json
{
  "N": 50,
  "P": 40,
  "K": 50,
  "temperature": 25.5,
  "humidity": 80,
  "ph": 7.0,
  "rainfall": 100,
  "soil_moisture": 40,
  "soil_type": "Loamy",
  "sunlight_exposure": "High",
  "wind_speed": 2.5,
  "co2_concentration": 400,
  "organic_matter": 5,
  "irrigation_frequency": 3,
  "crop_density": 100,
  "pest_pressure": 2,
  "fertilizer_usage": 50,
  "growth_stage": "Vegetative",
  "urban_area_proximity": 5,
  "water_source_type": "Rainwater",
  "frost_risk": "Low",
  "water_usage_efficiency": 0.8
}
```

**Response:**
```json
{
  "code": 0,
  "label": "Wheat"
}
```

#### 4. Batch Prediction
```
POST /predict
Content-Type: application/json
```

**Request Body:**
```json
[
  {
    "N": 50,
    "P": 40,
    "K": 50,
    "temperature": 25.5,
    "humidity": 80,
    "ph": 7.0,
    "rainfall": 100,
    "soil_moisture": 40,
    "soil_type": "Loamy",
    "sunlight_exposure": "High",
    "wind_speed": 2.5,
    "co2_concentration": 400,
    "organic_matter": 5,
    "irrigation_frequency": 3,
    "crop_density": 100,
    "pest_pressure": 2,
    "fertilizer_usage": 50,
    "growth_stage": "Vegetative",
    "urban_area_proximity": 5,
    "water_source_type": "Rainwater",
    "frost_risk": "Low",
    "water_usage_efficiency": 0.8
  },
  {
    "N": 60,
    "P": 50,
    "K": 60,
    "temperature": 28.0,
    "humidity": 75,
    "ph": 6.8,
    "rainfall": 120,
    "soil_moisture": 45,
    "soil_type": "Sandy",
    "sunlight_exposure": "High",
    "wind_speed": 3.0,
    "co2_concentration": 410,
    "organic_matter": 6,
    "irrigation_frequency": 4,
    "crop_density": 110,
    "pest_pressure": 1,
    "fertilizer_usage": 60,
    "growth_stage": "Flowering",
    "urban_area_proximity": 10,
    "water_source_type": "Irrigation",
    "frost_risk": "Medium",
    "water_usage_efficiency": 0.85
  }
]
```

**Response:**
```json
{
  "predictions": [
    {
      "code": 0,
      "label": "Wheat"
    },
    {
      "code": 1,
      "label": "Rice"
    }
  ]
}
```

### Error Responses

#### Invalid Content-Type
```
Status: 400
{
  "error": "Content-Type must be application/json"
}
```

#### Missing Required Features
```
Status: 400
{
  "error": "Missing features: N, P, K, ..."
}
```

#### Invalid Feature Value
```
Status: 400
{
  "error": "Feature 'temperature' must be numeric"
}
```

#### Server Error
```
Status: 500
{
  "error": "Prediction failed: [error details]"
}
```

---

## Backend API (Java/Jersey)

### Base URL
```
http://localhost:8080/api
```

### Endpoints

#### 1. Health Check
```
GET /predict
```

**Response:**
```json
{
  "status": "healthy",
  "service": "Crop Predictor Backend"
}
```

#### 2. Predict Crop
```
POST /predict
Content-Type: application/json
```

**Request Body:**
Same as ML Service single prediction request.

**Response:**
```json
{
  "code": 0,
  "label": "Wheat"
}
```

**How it works:**
1. Backend receives request from frontend
2. Backend validates input (via PredictionService)
3. Backend forwards request to ML Service (http://localhost:5000/predict)
4. Backend returns ML Service response to frontend

---

## Frontend API

### Environment Variables
Create `.env` file in frontend directory:
```
REACT_APP_API_URL=http://localhost:8080/api
```

### Pages

#### Prediction Page
- **Route:** `/`
- **Features:**
  - 23-field form for agronomic inputs
  - Submit to backend API
  - Display predicted crop and code
  - Show error messages

### Components

#### PredictionForm
- Renders form with all 23 required fields
- Numeric inputs with validation
- Categorical selects (soil_type, sunlight_exposure, etc.)
- Submit button with loading state

#### ResultDisplay
- Shows prediction result (code + label)
- Displays error messages
- Animated slide-in effect

---

## Data Flow

```
Frontend (React)
     ↓ POST /predict
Backend (Jersey)
     ↓ POST /predict (forward)
ML Service (Flask)
     ↓ Process request
Backend ← Response
     ↓
Frontend ← Display result
```

---

## Feature Reference

### Numeric Features (18)
- **N** (Nitrogen): 0-100 (ppm)
- **P** (Phosphorus): 0-100 (ppm)
- **K** (Potassium): 0-100 (ppm)
- **temperature**: -10 to 50 (°C)
- **humidity**: 0-100 (%)
- **ph**: 3.5-9.0
- **rainfall**: 0-500 (mm)
- **soil_moisture**: 0-100 (%)
- **wind_speed**: 0-20 (m/s)
- **co2_concentration**: 300-500 (ppm)
- **organic_matter**: 0-10 (%)
- **irrigation_frequency**: 1-10 (times/month)
- **crop_density**: 10-1000 (plants/m²)
- **pest_pressure**: 0-10 (scale)
- **fertilizer_usage**: 0-500 (kg/ha)
- **urban_area_proximity**: 0-50 (km)
- **frost_risk**: 0-10 (scale)
- **water_usage_efficiency**: 0-1 (ratio)

### Categorical Features (4)
- **soil_type**: Loamy, Sandy, Clay, Silt
- **sunlight_exposure**: Low, Medium, High
- **growth_stage**: Germination, Vegetative, Flowering, Fruiting, Maturity
- **water_source_type**: Rainwater, Groundwater, Surface Water, Irrigation

---

## Crop Classes (22)

| Code | Crop Name |
|------|-----------|
| 0 | Wheat |
| 1 | Rice |
| 2 | Corn |
| 3 | Barley |
| 4 | Oats |
| 5 | Sorghum |
| 6 | Millet |
| 7 | Cotton |
| 8 | Sugarcane |
| 9 | Peanuts |
| 10 | Soybeans |
| 11 | Sunflower |
| 12 | Canola |
| 13 | Potato |
| 14 | Tomato |
| 15 | Pepper |
| 16 | Onion |
| 17 | Garlic |
| 18 | Carrot |
| 19 | Lettuce |
| 20 | Cabbage |
| 21 | Beans |

---

## Example Requests

### cURL

**Single prediction:**
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "N": 50, "P": 40, "K": 50, "temperature": 25.5,
    "humidity": 80, "ph": 7.0, "rainfall": 100,
    "soil_moisture": 40, "soil_type": "Loamy",
    "sunlight_exposure": "High", "wind_speed": 2.5,
    "co2_concentration": 400, "organic_matter": 5,
    "irrigation_frequency": 3, "crop_density": 100,
    "pest_pressure": 2, "fertilizer_usage": 50,
    "growth_stage": "Vegetative", "urban_area_proximity": 5,
    "water_source_type": "Rainwater", "frost_risk": "Low",
    "water_usage_efficiency": 0.8
  }'
```

### Python

```python
import requests

url = 'http://localhost:5000/predict'
data = {
    'N': 50, 'P': 40, 'K': 50, 'temperature': 25.5,
    'humidity': 80, 'ph': 7.0, 'rainfall': 100,
    'soil_moisture': 40, 'soil_type': 'Loamy',
    'sunlight_exposure': 'High', 'wind_speed': 2.5,
    'co2_concentration': 400, 'organic_matter': 5,
    'irrigation_frequency': 3, 'crop_density': 100,
    'pest_pressure': 2, 'fertilizer_usage': 50,
    'growth_stage': 'Vegetative', 'urban_area_proximity': 5,
    'water_source_type': 'Rainwater', 'frost_risk': 'Low',
    'water_usage_efficiency': 0.8
}

response = requests.post(url, json=data)
print(response.json())
```

### JavaScript

```javascript
const data = {
  N: 50, P: 40, K: 50, temperature: 25.5,
  humidity: 80, ph: 7.0, rainfall: 100,
  soil_moisture: 40, soil_type: 'Loamy',
  sunlight_exposure: 'High', wind_speed: 2.5,
  co2_concentration: 400, organic_matter: 5,
  irrigation_frequency: 3, crop_density: 100,
  pest_pressure: 2, fertilizer_usage: 50,
  growth_stage: 'Vegetative', urban_area_proximity: 5,
  water_source_type: 'Rainwater', frost_risk: 'Low',
  water_usage_efficiency: 0.8
};

fetch('http://localhost:5000/predict', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})
.then(res => res.json())
.then(json => console.log(json));
```
