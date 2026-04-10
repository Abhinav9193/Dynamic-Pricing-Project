# 🚀 Project Documentation: AI-Powered Dynamic Pricing & Business Intelligence Platform

This document provides a comprehensive guide to the project, covering everything from the core concepts to the technical implementation. Use this for your presentation and viva preparation.

---

## 1. Project Introduction
The **AI-Powered Dynamic Pricing & Business Intelligence Platform** is a full-stack B2B enterprise solution designed to optimize product pricing dynamically using Machine Learning. Unlike traditional static pricing, this platform analyzes market trends, competitor behavior, and inventory levels to recommend the most profitable price points in real-time.

## 2. Problem Statement
Many businesses, especially in the B2B sector, struggle with:
- **Static Pricing:** Prices remain the same despite changes in demand or competitor prices, leading to lost revenue or missed sales.
- **Manual Data Analysis:** Manually tracking competitors and inventory is time-consuming and prone to human error.
- **Lack of Actionable Insights:** Businesses have data but lack a centralized system to visualize growth and get automated recommendations.
- **Inefficient Inventory Management:** Overstocking or understocking due to poor demand prediction.

## 3. Methodology
The project follows a **Microservices-inspired architecture** to separate concerns:
1.  **Data Collection:** System seeds and tracks product data, sales records, and competitor prices.
2.  **ML Training:** A Python microservice uses historical data to train regression models.
3.  **Real-time Prediction:** When a price recommendation is requested, the Spring Boot backend communicates with the FastAPI ML service.
4.  **Actionable UI:** The frontend presents these recommendations and provides data visualization (charts) for business intelligence.

## 4. Technical Stack (The "How")
-   **Frontend:**
    -   **Next.js 14:** For a fast, SEO-friendly, and responsive React framework.
    -   **Tailwind CSS:** For modern, utility-first styling.
    -   **Recharts:** To provide interactive and beautiful business analytics.
    -   **Framer Motion:** For smooth UI animations.
-   **Backend:**
    -   **Java 17 & Spring Boot 3:** The powerhouse for enterprise logic, REST APIs, and database management.
    -   **Spring Security + JWT:** For secure, role-based access control (Admin, Manager, Employee).
    -   **Spring Data JPA:** For seamless interaction with the database.
-   **Machine Learning (Intelligence):**
    -   **Python (FastAPI):** High-performance API for ML predictions.
    -   **Scikit-Learn:** Used for training **Random Forest Regressor** and **Gradient Boosting** models.
    -   **Pandas & NumPy:** For data preprocessing and manipulation.
-   **Database:**
    -   **PostgreSQL:** A reliable relational database for storing sensitive business data.

## 5. Project Workflow
1.  **Authentication:** User logs in through the JWT-secured portal. Roles determine access levels.
2.  **Dashboard:** The landing page shows real-time sales growth, revenue, and inventory alerts using Recharts.
3.  **Inventory Management:** Users can manage products. The system tracks "Demand Scores" and "Competitor Prices".
4.  **AI Recommendation:**
    -   Backend sends product features (current price, inventory, competitor price) to the ML service.
    -   ML service runs the data through the best-trained model.
    -   It returns a `Recommended Price` along with `Expected Profit %`.
5.  **Market Intelligence:** Dedicated tabs to track how competitors are pricing similar items.

---

## 🎓 Viva & Presentation Questions (Be Prepared!)

### Q1: Why did you choose Dynamic Pricing for your project?
**Ans:** Static pricing is outdated in the digital age. Dynamic pricing allows businesses to react to market volatility, maximize profit margins during high demand, and stay competitive when others drop prices. It combines business strategy with data science.

### Q2: How does the Machine Learning part work?
**Ans:** We use **Supervised Learning**. We train our models on features like `Current Price`, `Competitor Price`, `Inventory Level`, and `Demand Score`. We tried multiple models (Linear Regression, Random Forest, Gradient Boosting) and chose the one with the highest **R² score** (Coefficient of Determination) to ensure accuracy.

### Q3: Why did you use FastAPI instead of putting ML logic in Java?
**Ans:** Python has the best ecosystem for ML (libraries like Scikit-Learn and Pandas). Java is great for enterprise logic. By using **FastAPI**, we created a lightweight microservice that Java can call whenever it needs a prediction. This follows modern architectural standards.

### Q4: What is JWT and why is it used here?
**Ans:** JWT stands for **JSON Web Token**. It allows the frontend to communicate with the backend securely. Once a user logs in, the backend sends a token. The frontend includes this token in every request to prove the user's identity without the backend needing to store "session" data.

### Q5: How do you handle "Cold Start" (No data for new products)?
**Ans:** For new products, we use **Competitor-based pricing** as a baseline and a default "Demand Score" until the system gathers enough sales records to make more intelligent predictions.

### Q6: If you had more time, what features would you add?
**Ans:** I would implement a **Real-time Web Scraper** to automatically fetch competitor prices from e-commerce sites and integrate **Reinforcement Learning** so the model can learn from successful vs. unsuccessful price changes in real-time.

---

## 🎯 Tips for the Presentation
-   **Focus on the "Impact":** Start by saying how much money businesses lose due to bad pricing.
-   **Live Demo:** Show the "AI Recommendation" feature specifically. Change a competitor's price and show how the system reacts.
-   **Code Cleanliness:** If the examiner scrolls through code, show your `ProductController.java` or `predict_api.py`—those are usually the most "impressive" parts.

Good luck with your presentation! 🚀
