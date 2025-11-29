"""FastAPI service for crop prediction.

Run:
    uvicorn app:app --reload --port 8000

Endpoints:
    GET /health -> basic status
    POST /predict -> JSON body with required 7 features

Example request body:
{
  "N": 90,
  "P": 42,
  "K": 43,
  "temperature": 20.88,
  "humidity": 82,
  "ph": 6.5,
  "rainfall": 202.94
}
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, Any, List
import json
from service.predictor_service import load_resources, predict_crop, REQUIRED_FEATURES

app = FastAPI(title="Crop Prediction API", version="1.0.0")

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictRequest(BaseModel):
    N: float = Field(..., description="Nitrogen")
    P: float = Field(..., description="Phosphorus")
    K: float = Field(..., description="Potassium")
    temperature: float = Field(..., description="Temperature (°C)")
    humidity: float = Field(..., description="Humidity (%)")
    ph: float = Field(..., description="Soil pH")
    rainfall: float = Field(..., description="Rainfall (mm)")

class BatchPredictRequest(BaseModel):
    items: List[PredictRequest]

resources = None

@app.on_event("startup")
def _load():
    global resources
    resources = load_resources()

@app.get("/health")
def health():
    return {"status": "ok", "required_features": REQUIRED_FEATURES}

@app.post("/predict")
def predict(req: PredictRequest) -> Dict[str, Any]:
    global resources
    if resources is None:
        raise HTTPException(status_code=503, detail="Resources not loaded")
    try:
        result = predict_crop(resources, req.dict())
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return result

@app.post("/batch")
def batch_predict(req: BatchPredictRequest) -> List[Dict[str, Any]]:
    """Batch prediction: accepts list of objects, returns list of flat outputs."""
    global resources
    if resources is None:
        raise HTTPException(status_code=503, detail="Resources not loaded")
    results = []
    for item in req.items:
        try:
            results.append(predict_crop(resources, item.dict()))
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
    return results

# Optional: CLI test for quick output to JSON file
if __name__ == '__main__':
    resources = load_resources()
    sample_req = PredictRequest(
        N=90, P=42, K=43, temperature=20.88, humidity=82, ph=6.5, rainfall=202.94
    )
    output = predict(sample_req)  # direct call
    with open('sample_prediction.json', 'w') as f:
        json.dump(output, f, indent=2)
    print('Wrote sample_prediction.json')
