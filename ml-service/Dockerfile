FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Ensure the model is trained if not exists (though train_model.py needs data)
# RUN python train_model.py 

EXPOSE 8000

CMD ["uvicorn", "predict_api:app", "--host", "0.0.0.0", "--port", "8000"]
