package com.pricing.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "competitor_prices")
public class CompetitorPrice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "competitor_name")
    private String competitorName;

    private double price;
    private LocalDateTime timestamp;

    public CompetitorPrice() {
    }

    public CompetitorPrice(Product product, String competitorName, double price, LocalDateTime timestamp) {
        this.product = product;
        this.competitorName = competitorName;
        this.price = price;
        this.timestamp = timestamp;
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

    public String getCompetitorName() {
        return competitorName;
    }

    public void setCompetitorName(String competitorName) {
        this.competitorName = competitorName;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    @Override
    public String toString() {
        return "CompetitorPrice{" + "id=" + id + ", product=" + (product != null ? product.getId() : "null")
                + ", price=" + price + '}';
    }
}
