import requests

url = "http://localhost:8000/predict-price"
data = {
    "product_id": 1,
    "current_price": 100.0,
    "inventory": 50,
    "competitor_price": 95.0,
    "demand_score": 80
}

response = requests.post(url, json=data)
print(response.json())