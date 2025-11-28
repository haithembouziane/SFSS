# Crop Recommendation System

A 3-tier application for predicting crop recommendations based on agronomic features.

## Architecture

```
┌─────────────────────────────────────┐
│      React Frontend (Port 3000)      │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│  Java/Jersey Backend (Port 8080)     │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Python Flask ML Service (5000)     │
├──────────────────────────────────────┤
│  Scikit-learn Crop Classifier        │
│  - Logistic Regression               │
│  - 22 Crop Classes                   │
│  - 95.91% Accuracy                   │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│   PostgreSQL Database (5432)         │
│   - Prediction History               │
│   - User Accounts                    │
└──────────────────────────────────────┘
```

## Project Structure

```
Predictor/
├── predictor.ipynb              # ML model development notebook
├── Crop_recommendationV2.csv    # Training data
├── crop_label_pipeline.joblib   # Trained model artifact
├── label_map.json               # Label mapping (code -> crop name)
│
├── ml-service/                  # Python Flask ML API
│   ├── src/
│   │   ├── models/
│   │   │   └── predictor.py     # CropPredictor class
│   │   └── utils/
│   │       └── validation.py    # Input validation
│   ├── app.py                   # Flask REST API
│   ├── requirements.txt          # Python dependencies
│   ├── .env.example              # Environment variables
│   └── .gitignore
│
├── backend/                     # Java/Jersey REST API
│   ├── src/main/java/com/crop/
│   │   ├── resources/           # JAX-RS endpoints
│   │   ├── services/            # Business logic
│   │   ├── dao/                 # Database access
│   │   ├── models/              # DTOs and entities
│   │   └── config/              # Configuration
│   ├── src/main/resources/      # Config files
│   ├── pom.xml                  # Maven build config
│   └── .gitignore
│
├── frontend/                    # React SPA
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── pages/               # Page components
│   │   ├── App.js               # Main app
│   │   └── index.js             # Entry point
│   ├── public/
│   │   └── index.html           # HTML template
│   ├── package.json             # Node dependencies
│   └── .gitignore
│
├── database/                    # Database setup
│   ├── init.sql                 # Schema initialization
│   └── migrations/              # Database migrations
│
├── scripts/                     # Startup scripts
│   ├── run-ml-service.sh       # Start ML service
│   ├── run-backend.sh          # Start backend
│   └── run-frontend.sh         # Start frontend
│
├── docs/                        # Documentation
│   ├── SETUP.md                # Environment setup
│   ├── API.md                  # API documentation
│   └── ARCHITECTURE.md         # Architecture details
│
└── README.md                   # This file
```

## Quick Start

### Prerequisites

- **Python 3.9+** (for ML service)
- **Java 11+** (for backend)
- **Node.js 16+** (for frontend)
- **PostgreSQL 12+** (for database)

### 1. Start ML Service

```bash
chmod +x scripts/run-ml-service.sh
./scripts/run-ml-service.sh
# Runs on http://localhost:5000
```

### 2. Start Backend

```bash
chmod +x scripts/run-backend.sh
./scripts/run-backend.sh
# Runs on http://localhost:8080
```

### 3. Start Frontend

```bash
chmod +x scripts/run-frontend.sh
./scripts/run-frontend.sh
# Runs on http://localhost:3000
```

### 4. Configure Database

```bash
psql -U postgres < database/init.sql
```

## Services

### ML Service (Python Flask)

REST API for crop prediction using Scikit-learn model.

**Endpoints:**
- `GET /` - Health check
- `GET /predict` - Usage instructions
- `POST /predict` - Single or batch prediction

**Example Request:**
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

### Backend (Java/Jersey)

Application server providing REST endpoints and business logic.

- Calls ML service for predictions
- Manages user accounts
- Stores prediction history
- Handles database operations

### Frontend (React)

User interface for crop recommendation.

- Input form for agronomic features
- Prediction results display
- Prediction history
- User authentication

## Development

### ML Service Development

```bash
cd ml-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

### Backend Development

```bash
cd backend
mvn clean install
mvn jetty:run
```

### Frontend Development

```bash
cd frontend
npm install
npm start
```

## Configuration

Each service has a `.env.example` file. Copy and configure:

```bash
# ML Service
cp ml-service/.env.example ml-service/.env

# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

## Model Details

- **Algorithm:** Logistic Regression with class balancing
- **Test Accuracy:** 95.91%
- **Macro F1 Score:** 0.9585
- **Cross-Validation (Stratified 5-fold):** 0.9569 ± 0.0072
- **Features:** 23 agronomic features (numeric and categorical)
- **Output Classes:** 22 crop types

## Documentation

- `docs/SETUP.md` - Detailed environment setup
- `docs/API.md` - Complete API documentation
- `docs/ARCHITECTURE.md` - System architecture and data flow

## License

MIT License

## Contact

For issues or questions, please open an issue in the repository.
