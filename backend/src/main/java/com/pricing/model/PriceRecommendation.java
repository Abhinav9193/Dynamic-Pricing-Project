package com.pricing.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "price_recommendations")
public class PriceRecommendation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "recommended_price")
    private double recommendedPrice;

    @Column(name = "predicted_demand")
    private int predictedDemand;

    @Column(name = "expected_profit")
    private double expectedProfit;

    private LocalDateTime createdAt;
    
    @Column(name = "ai_analysis_report", columnDefinition = "TEXT")
    private String aiAnalysis;

    public PriceRecommendation() {
    }

    public PriceRecommendation(Product product, double recommendedPrice, int predictedDemand, double expectedProfit,
            LocalDateTime createdAt) {
        this.product = product;
        this.recommendedPrice = recommendedPrice;
        this.predictedDemand = predictedDemand;
        this.expectedProfit = expectedProfit;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public double getRecommendedPrice() {
        return recommendedPrice;
    }

    public void setRecommendedPrice(double recommendedPrice) {
        this.recommendedPrice = recommendedPrice;
    }

    public int getPredictedDemand() {
        return predictedDemand;
    }

    public void setPredictedDemand(int predictedDemand) {
        this.predictedDemand = predictedDemand;
    }

    public double getExpectedProfit() {
        return expectedProfit;
    }

    public void setExpectedProfit(double expectedProfit) {
        this.expectedProfit = expectedProfit;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getAiAnalysis() {
        return aiAnalysis;
    }

    public void setAiAnalysis(String aiAnalysis) {
        this.aiAnalysis = aiAnalysis;
    }

    @Override
    public String toString() {
        return "PriceRecommendation{" + "id=" + id + ", recommendedPrice=" + recommendedPrice + '}';
    }
}
