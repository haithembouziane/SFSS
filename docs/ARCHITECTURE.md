# System Architecture

## Overview

The Crop Predictor system is a modern 3-tier application designed for local PC deployment without containerization. It combines machine learning (Python), business logic (Java), and user interface (React) in a distributed architecture.

```
┌─────────────────────────────────────────────────────────┐
│                    User Browser                          │
│              (http://localhost:3000)                     │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP REST
                         │
┌────────────────────────▼────────────────────────────────┐
│              React Frontend (Port 3000)                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  - Prediction Form (23 fields)                   │  │
│  │  - Input Validation (client-side)                │  │
│  │  - Result Display with error handling            │  │
│  │  - Responsive UI (Gradient background)           │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │ POST /predict
                         │ GET /
                         │
┌────────────────────────▼────────────────────────────────┐
│         Java/Jersey Backend (Port 8080)                 │
│  ┌──────────────────────────────────────────────────┐  │
│  │  JAX-RS Resources:                               │  │
│  │  - PredictionResource.java                       │  │
│  │  - Health checks                                 │  │
│  │  - Request forwarding                            │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Business Services:                              │  │
│  │  - PredictionService.java                        │  │
│  │  - HTTP calls to ML service                      │  │
│  │  - Response formatting                           │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Configuration:                                  │  │
│  │  - JerseyConfig.java                             │  │
│  │  - Dependency injection                          │  │
│  │  - CORS handling                                 │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │ POST /predict
                         │ (forward to ML)
                         │
┌────────────────────────▼────────────────────────────────┐
│        Python Flask ML Service (Port 5000)              │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Flask REST API (app.py):                        │  │
│  │  - GET / (health check)                          │  │
│  │  - GET /predict (usage)                          │  │
│  │  - POST /predict (single & batch prediction)     │  │
│  │  - Error handling (400, 500 responses)           │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  ML Model Pipeline:                              │  │
│  │  - CropPredictor class (models/predictor.py)    │  │
│  │  - Joblib pipeline loading                       │  │
│  │  - Preprocessing (StandardScaler, OneHotEncoder) │  │
│  │  - Logistic Regression classifier                │  │
│  │  - Label mapping (code → crop name)              │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Validation (utils/validation.py):               │  │
│  │  - Feature completeness checks                   │  │
│  │  - Type validation (numeric/categorical)         │  │
│  │  - Batch validation                              │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │ READ
                         │
┌────────────────────────▼────────────────────────────────┐
│         Model Artifacts (Filesystem)                    │
│  ┌──────────────────────────────────────────────────┐  │
│  │  - crop_label_pipeline.joblib (trained model)    │  │
│  │  - label_map.json (code→label mapping)           │  │
│  │  - Crop_recommendationV2.csv (training data)     │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Database Architecture

```
┌──────────────────────────────────────────────────┐
│         PostgreSQL Database (Port 5432)          │
│  ┌────────────────────────────────────────────┐  │
│  │  predictions (primary table)                │  │
│  │  - id (PK)                                  │  │
│  │  - user_id (FK)                             │  │
│  │  - crop_code, crop_label                    │  │
│  │  - 23 feature columns                       │  │
│  │  - created_at, updated_at timestamps        │  │
│  └────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────┐  │
│  │  users (optional, for authentication)       │  │
│  │  - id (PK)                                  │  │
│  │  - username, email, password_hash           │  │
│  │  - timestamps                               │  │
│  └────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────┐  │
│  │  crop_classes (lookup table)                │  │
│  │  - code (PK) → 22 crop types                │  │
│  │  - name, description                        │  │
│  └────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

## Data Flow

### Single Prediction Flow

```
1. User fills form in React UI
   ↓
2. Frontend validates inputs (client-side)
   ↓
3. Frontend POSTs JSON to Backend:
   POST http://localhost:8080/api/predict
   ↓
4. Backend receives request in PredictionResource
   ↓
5. Backend forwards via PredictionService:
   POST http://localhost:5000/predict
   ↓
6. ML Service validates features (validation.py)
   ↓
7. ML Service loads pipeline & predicts
   ├─ Loads crop_label_pipeline.joblib
   ├─ Applies preprocessing (standardization, encoding)
   ├─ Passes through Logistic Regression
   └─ Maps code to crop label
   ↓
8. ML Service returns: { "code": 0, "label": "Wheat" }
   ↓
9. Backend forwards response to Frontend
   ↓
10. Frontend displays result to user
```

### Batch Prediction Flow

```
1. Frontend POSTs array of feature objects
   ↓
2. Backend forwards to ML Service (same array)
   ↓
3. ML Service processes each record
   ├─ Validates all records
   ├─ Converts to DataFrame
   ├─ Batch predicts via pipeline
   ├─ Maps each code to label
   └─ Returns array of results
   ↓
4. ML Service returns: { "predictions": [...] }
   ↓
5. Backend forwards to Frontend
   ↓
6. Frontend displays all results
```

## Component Details

### Frontend (React)

**Technology Stack:**
- React 18.2.0 (UI library)
- Axios (HTTP client)
- CSS Grid (responsive layout)
- ES6 (JavaScript standard)

**Key Files:**
- `src/pages/PredictionPage.js` - Main page component
- `src/components/PredictionForm.js` - 23-field form
- `src/components/ResultDisplay.js` - Result presentation
- `src/App.js` - Root component
- `src/index.js` - Entry point

**State Management:**
- Local component state (React Hooks)
- Form data stored in PredictionForm state
- API response stored in PredictionPage state

**Features:**
- Responsive form layout (grid)
- Real-time form updates
- Loading indicator during prediction
- Error message display
- Gradient background styling

### Backend (Java/Jersey)

**Technology Stack:**
- Java 11 (runtime)
- Jersey 2.37 (JAX-RS implementation)
- Maven (build tool)
- Jetty (embedded servlet container)
- Jackson (JSON serialization)

**Key Files:**
- `src/main/java/com/crop/resources/PredictionResource.java` - REST endpoints
- `src/main/java/com/crop/services/PredictionService.java` - HTTP forwarding
- `src/main/java/com/crop/models/PredictionDTO.java` - Data transfer object
- `src/main/java/com/crop/config/JerseyConfig.java` - Configuration
- `pom.xml` - Dependencies

**Architecture Pattern:**
- MVC-like separation (Resources, Services, Models)
- Dependency Injection via constructors
- REST API design (Resource classes)

**Features:**
- Health check endpoint
- Request forwarding to ML service
- Error handling (HTTP status codes)
- JSON serialization via Jackson

### ML Service (Python/Flask)

**Technology Stack:**
- Python 3.9+ (runtime)
- Flask 2.3.2 (web framework)
- Scikit-learn 1.2.2 (ML framework)
- Joblib 1.3.1 (model persistence)
- Pandas 1.5.3 (data processing)
- NumPy 1.24.3 (numerical computing)

**Key Files:**
- `app.py` - Flask REST API
- `src/models/predictor.py` - CropPredictor class
- `src/utils/validation.py` - Input validation
- `requirements.txt` - Python dependencies

**Model Details:**
- **Algorithm:** Logistic Regression with class balancing
- **Training:** 95.91% accuracy on test set
- **Validation:** 0.9569 ± 0.0072 macro F1 (stratified 5-fold CV)
- **Features:** 23 (18 numeric, 5 categorical)
- **Classes:** 22 crop types
- **Preprocessing:** StandardScaler + OneHotEncoder in Pipeline

**Features:**
- Single & batch prediction endpoints
- Input validation with detailed errors
- Label mapping (code→name)
- CORS enabled for browser clients
- Environment variable configuration

## Deployment on Local PC

### Directory Layout

```
/home/user/Predictor/
├── ml-service/              # Python microservice
├── backend/                 # Java microservice
├── frontend/                # React SPA
├── database/                # SQL scripts
├── scripts/                 # Startup scripts
├── docs/                    # Documentation
├── crop_label_pipeline.joblib  # Model artifact
├── label_map.json          # Label mapping
└── README.md               # Project guide
```

### Service Ports

| Service | Port | Technology |
|---------|------|------------|
| Frontend | 3000 | React Dev Server |
| Backend | 8080 | Jetty Servlet Container |
| ML Service | 5000 | Flask WSGI Server |
| Database | 5432 | PostgreSQL |

### Startup Process

1. **Start Database:** PostgreSQL daemon (already running)
2. **Start ML Service:** Python Flask (venv activated)
3. **Start Backend:** Java/Jetty (Maven build + run)
4. **Start Frontend:** React (npm dev server)

Each service runs in its own terminal/process.

## Scalability & Extensibility

### Current Limitations
- Single ML model instance (no load balancing)
- Synchronous HTTP calls (blocking)
- In-memory form state (no persistence)
- Local database (no replication)

### Future Enhancements
- ML service load balancer (multiple instances)
- Async/await pattern in backend
- Redux/Context API for state management
- Database connection pooling (HikariCP)
- Docker containerization for deployment
- Kubernetes orchestration
- CI/CD pipeline (GitHub Actions)
- Monitoring & logging (ELK stack)

## Security Considerations

### Current Implementation
- Environment variables for sensitive config
- Input validation on all layers
- Error messages don't expose internals
- CORS enabled for localhost

### Recommendations for Production
- Enable HTTPS/TLS
- Add authentication/authorization
- Implement rate limiting
- Add request logging & monitoring
- Validate on backend (don't trust frontend)
- Use secrets management tool
- Add SQL injection prevention (prepared statements)
- Implement CSRF protection
