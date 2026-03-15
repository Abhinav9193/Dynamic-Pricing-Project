import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import r2_score, mean_absolute_error
import joblib
import os
from dataset_loader import DatasetLoader

class PriceModelTrainer:
    def __init__(self, data_path="data/processed_pricing_data.csv"):
        self.data_path = data_path
        self.models = {
            "Linear Regression": LinearRegression(),
            "Random Forest": RandomForestRegressor(n_estimators=100, random_state=42),
            "Gradient Boosting": GradientBoostingRegressor(n_estimators=100, random_state=42)
        }
        self.best_model = None
        self.best_score = -float('inf')
        self.model_name = ""

    def train(self):
        if not os.path.exists(self.data_path):
            loader = DatasetLoader()
            df = loader.load_and_preprocess()
        else:
            df = pd.read_csv(self.data_path)

        # Features & Targets
        features = ['current_price', 'competitor_price', 'inventory_level', 'demand_score', 'seasonal_index']
        X = df[features]
        # We train one model for price and could train another for demand, 
        # but for this MVP we'll focus on recommended_price
        y = df['recommended_price']

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        print("--- Training Models ---")
        for name, model in self.models.items():
            model.fit(X_train, y_train)
            predictions = model.predict(X_test)
            r2 = r2_score(y_test, predictions)
            mae = mean_absolute_error(y_test, predictions)
            
            print(f"{name} -> R2 Score: {r2:.4f}, MAE: {mae:.2f}")

            if r2 > self.best_score:
                self.best_score = r2
                self.best_model = model
                self.model_name = name

        print(f"\nBest Model Selected: {self.model_name} (R2: {self.best_score:.4f})")
        
        # Save historical stats for prediction
        # (Simplified: we use features for prediction)
        
        # Save the model
        joblib.dump(self.best_model, "model.pkl")
        print("Model saved to model.pkl")

if __name__ == "__main__":
    trainer = PriceModelTrainer()
    trainer.train()
