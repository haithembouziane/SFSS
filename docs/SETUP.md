# Setup Guide

## Prerequisites

Ensure you have the following installed on your system:

### Python 3.9+ (ML Service)
```bash
python3 --version
```

### Java 11+ (Backend)
```bash
java -version
```

### Maven 3.8+ (Build tool for backend)
```bash
mvn -version
```

### Node.js 16+ (Frontend)
```bash
node --version
npm --version
```

### PostgreSQL 12+ (Database)
```bash
psql --version
```

## Environment Setup

### 1. ML Service

Navigate to the ml-service directory:
```bash
cd ml-service
```

Create environment file:
```bash
cp .env.example .env
```

Edit `.env` with your paths:
```
MODEL_PATH=../crop_label_pipeline.joblib
LABEL_MAP_PATH=../label_map.json
PORT=5000
HOST=0.0.0.0
FLASK_ENV=production
```

### 2. Backend

Navigate to the backend directory:
```bash
cd backend
```

Ensure `pom.xml` is in place with all dependencies.

### 3. Frontend

Navigate to the frontend directory:
```bash
cd frontend
```

Create environment file:
```bash
cp .env.example .env
```

Edit `.env`:
```
REACT_APP_API_URL=http://localhost:8080/api
```

### 4. Database

Initialize PostgreSQL:
```bash
# Create database and tables
psql -U postgres < database/init.sql

# Or connect to psql and run commands:
psql -U postgres
```

## Running All Services

### Option 1: Individual Terminals

**Terminal 1 - ML Service:**
```bash
./scripts/run-ml-service.sh
# Runs on http://localhost:5000
```

**Terminal 2 - Backend:**
```bash
./scripts/run-backend.sh
# Runs on http://localhost:8080/api
```

**Terminal 3 - Frontend:**
```bash
./scripts/run-frontend.sh
# Runs on http://localhost:3000
```

**Terminal 4 - Database:**
```bash
# Start PostgreSQL (already initialized)
# On macOS with Homebrew: brew services start postgresql
# On Linux with systemd: sudo systemctl start postgresql
```

### Option 2: Run All at Once

Create a `start-all.sh` script:
```bash
#!/bin/bash
./scripts/run-ml-service.sh &
./scripts/run-backend.sh &
./scripts/run-frontend.sh &
wait
```

## Verification

### Check ML Service
```bash
curl http://localhost:5000/
# Expected: {"status": "healthy", "service": "Crop Predictor API", "version": "1.0.0"}
```

### Check Backend
```bash
curl http://localhost:8080/api/predict
# Expected: Prediction resource response
```

### Check Frontend
Open browser to `http://localhost:3000`

## Troubleshooting

### ML Service won't start
- Check Python version: `python3 --version` (need 3.9+)
- Check model file exists: `ls -la crop_label_pipeline.joblib`
- Check port 5000 is not in use: `lsof -i :5000`

### Backend won't build
- Check Java version: `java -version` (need 11+)
- Check Maven installed: `mvn -version`
- Run: `mvn clean install` in backend directory

### Frontend won't start
- Check Node version: `node --version` (need 16+)
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Check port 3000 is not in use: `lsof -i :3000`

### Database connection error
- Check PostgreSQL is running
- Check credentials in backend config
- Verify database created: `psql -U postgres -l | grep crop_db`

## Development Notes

### Python Virtual Environment
The `run-ml-service.sh` script automatically creates and activates a Python virtual environment.

### Java/Maven
The `run-backend.sh` script uses Maven to build and run the application with Jetty.

### Node/npm
The `run-frontend.sh` script installs dependencies if not already present.

## Next Steps

1. ✅ All services installed and configured
2. Start all services in separate terminals
3. Open http://localhost:3000 in your browser
4. Submit a crop prediction request
5. Monitor logs for any issues
