package com.pricing.dto;

public class MLResponse {
    private double recommended_price;
    private int predicted_demand;
    private double expected_profit;

    public MLResponse() {
    }

    // Getters and Setters
    public double getRecommended_price() {
        return recommended_price;
    }

    public void setRecommended_price(double recommended_price) {
        this.recommended_price = recommended_price;
    }

    public int getPredicted_demand() {
        return predicted_demand;
    }

    public void setPredicted_demand(int predicted_demand) {
        this.predicted_demand = predicted_demand;
    }

    public double getExpected_profit() {
        return expected_profit;
    }

    public void setExpected_profit(double expected_profit) {
        this.expected_profit = expected_profit;
    }
}
