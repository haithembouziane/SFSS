"""FastAPI service for crop yield prediction.

Run:
    cd ml-service/crop_yield_prediction
    uvicorn service.app:app --reload --port 8001
"""
from typing import Any, Dict, List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .predictor_service import load_resources, predict_yield, REQUIRED_FEATURES


app = FastAPI(title="Crop Yield Prediction API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

resources = load_resources()


class PredictRequest(BaseModel):
    Rainfall_mm: float = Field(..., description="Annual rainfall in mm")
    Temperature_Celsius: float = Field(..., description="Temperature in Celsius")
    Soil_Type: str
    Crop: str
    Weather_Condition: str
    Fertilizer_Used: Any  # accepts yes/no or boolean
    Irrigation_Used: Any  # accepts yes/no or boolean


class BatchPredictRequest(BaseModel):
    items: List[PredictRequest]


@app.get("/")
def health() -> Dict[str, Any]:
    return {
        "status": "ok",
        "service": "Yield Predictor",
        "required_features": REQUIRED_FEATURES,
        "loaded_model_features": resources.model_features,
    }


@app.post("/predict")
def predict(req: PredictRequest) -> Dict[str, Any]:
    try:
        return predict_yield(resources, req.dict())
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {e}")


@app.post("/predict-batch")
def batch_predict(req: BatchPredictRequest) -> Dict[str, Any]:
    try:
        results = [predict_yield(resources, item.dict()) for item in req.items]
        return {"predictions": results}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch prediction failed: {e}")
