# AI Powered Dynamic Pricing and Business Intelligence Platform

A complete full-stack B2B enterprise platform for dynamic pricing optimization using Machine Learning.

## 🚀 Features
- **AI Recommendation Engine**: Uses Random Forest and Gradient Boosting to optimize price points.
- **Market Intelligence**: Tracks competitor prices and inventory levels.
- **Enterprise Dashboard**: Real-time sales growth and revenue analytics with Recharts.
- **Secure Access**: JWT-based authentication with ADMIN, MANAGER, and EMPLOYEE roles.
- **Automated Data Seed**: Starts with 10 products and 500+ sales records for immediate testing.

---

## 🛠️ Setting Up Locally

### 1. Database (PostgreSQL)
Ensure you have PostgreSQL running locally.
- **Database Name**: `pricing_db`
- **Username**: `postgres` (or update in `backend/src/main/resources/application.properties`)
- **Password**: `postgres`

### 2. ML Microservice (Python/FastAPI)
```bash
cd ml-service
# Install dependencies
pip install -r requirements.txt
# Train the initial model (downloads data/generates synthetic)
python train_model.py
# Start the API
uvicorn predict_api:app --reload --port 8000
```
Runs on: `http://localhost:8000`

### 3. Backend (Spring Boot)
Requires Java 17+ and Maven.
```bash
cd backend
mvn spring-boot:run
```
Runs on: `http://localhost:8080`
- **Default Login**: `admin@pricing.com` / `admin123`

### 4. Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
Runs on: `http://localhost:3000`

---

## 🏛️ Architecture
1. **Frontend**: Next.js 14 (React), Tailwind CSS, Framer Motion, Recharts.
2. **Backend**: Spring Boot 3, Spring Security (JWT), Spring Data JPA.
3. **Intelligence**: FastAPI, Scikit-Learn, Pandas, Joblib.
4. **Storage**: PostgreSQL.

## 📊 ML Pipeline
- **Models**: Linear Regression, Random Forest Regressor, Gradient Boosting Regressor.
- **Features**: Current Price, Competitor Price, Inventory level, Demand Score, Seasonal Index.
- **Selection**: Automatically selects the model with the highest R² score during training.
