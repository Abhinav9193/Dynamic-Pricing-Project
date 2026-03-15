package com.pricing.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sales")
public class Sale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "units_sold")
    private int unitsSold;

    private double price;
    private double revenue;
    private LocalDateTime timestamp;

    public Sale() {
    }

    public Sale(Product product, int unitsSold, double price, double revenue, LocalDateTime timestamp) {
        this.product = product;
        this.unitsSold = unitsSold;
        this.price = price;
        this.revenue = revenue;
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

    public int getUnitsSold() {
        return unitsSold;
    }

    public void setUnitsSold(int unitsSold) {
        this.unitsSold = unitsSold;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public double getRevenue() {
        return revenue;
    }

    public void setRevenue(double revenue) {
        this.revenue = revenue;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    @Override
    public String toString() {
        return "Sale{" + "id=" + id + ", productId=" + (product != null ? product.getId() : "null") + ", revenue="
                + revenue + '}';
    }
}
