package com.pricing.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "price_history")
public class PriceHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "old_price")
    private double oldPrice;

    @Column(name = "new_price")
    private double newPrice;

    @Column(name = "changed_at")
    private LocalDateTime changedAt;

    public PriceHistory() {
    }

    public PriceHistory(Product product, double oldPrice, double newPrice, LocalDateTime changedAt) {
        this.product = product;
        this.oldPrice = oldPrice;
        this.newPrice = newPrice;
        this.changedAt = changedAt;
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

    public double getOldPrice() {
        return oldPrice;
    }

    public void setOldPrice(double oldPrice) {
        this.oldPrice = oldPrice;
    }

    public double getNewPrice() {
        return newPrice;
    }

    public void setNewPrice(double newPrice) {
        this.newPrice = newPrice;
    }

    public LocalDateTime getChangedAt() {
        return changedAt;
    }

    public void setChangedAt(LocalDateTime changedAt) {
        this.changedAt = changedAt;
    }

    @Override
    public String toString() {
        return "PriceHistory{" + "id=" + id + ", oldPrice=" + oldPrice + ", newPrice=" + newPrice + '}';
    }
}
