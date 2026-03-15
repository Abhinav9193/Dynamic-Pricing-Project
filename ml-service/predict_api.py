from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import os
import numpy as np

app = FastAPI(title="AI Pricing Intelligence API")

# Model Loading logic
MODEL_PATH = "model.pkl"
model = None

@app.on_event("startup")
def load_model():
    global model
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
        print("Model loaded successfully")
    else:
        print("Warning: model.pkl not found. Please run train_model.py first.")

class PriceRequest(BaseModel):
    product_id: int
    current_price: float
    inventory: int
    competitor_price: float
    demand_score: int

class PriceResponse(BaseModel):
    recommended_price: float
    predicted_demand: int
    expected_profit: float

@app.get("/")
def home():
    return {"message": "AI Pricing API is running", "model_loaded": model is not None}

@app.post("/predict-price", response_model=PriceResponse)
def predict(request: PriceRequest):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    features = np.array([[
        request.current_price, 
        request.competitor_price, 
        request.inventory, 
        request.demand_score, 
        1.0 
    ]])
    
    recommended_price = float(model.predict(features)[0])
    
    base_demand = request.demand_score * 1.5
    price_factor = request.current_price / recommended_price
    predicted_demand = int(base_demand * price_factor)
    
    cost = request.current_price * 0.7
    profit_pct = ((recommended_price - cost) / recommended_price) * 100

    return {
        "recommended_price": round(recommended_price, 2),
        "predicted_demand": predicted_demand,
        "expected_profit": round(profit_pct, 2)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
