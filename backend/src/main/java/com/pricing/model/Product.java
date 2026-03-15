package com.pricing.model;

import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String brand;
    private String category;
    
    @Column(length = 2000)
    private String description;
    
    @Column(name = "image_data", columnDefinition = "TEXT")
    private String imageUrl;
    private String size;
    private String color;

    @Column(name = "base_price")
    private double basePrice;

    @Column(name = "current_price")
    private double currentPrice;

    @Column(name = "inventory_level")
    private int inventoryLevel;

    public Product() {
    }

    public Product(String name, String brand, String category, String description, String imageUrl, String size, String color, double basePrice, double currentPrice, int inventoryLevel) {
        this.name = name;
        this.brand = brand;
        this.category = category;
        this.description = description;
        this.imageUrl = imageUrl;
        this.size = size;
        this.color = color;
        this.basePrice = basePrice;
        this.currentPrice = currentPrice;
        this.inventoryLevel = inventoryLevel;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    
    public String getSize() {
        return size;
    }
    
    public void setSize(String size) {
        this.size = size;
    }
    
    public String getColor() {
        return color;
    }
    
    public void setColor(String color) {
        this.color = color;
    }

    public double getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(double basePrice) {
        this.basePrice = basePrice;
    }

    public double getCurrentPrice() {
        return currentPrice;
    }

    public void setCurrentPrice(double currentPrice) {
        this.currentPrice = currentPrice;
    }

    public int getInventoryLevel() {
        return inventoryLevel;
    }

    public void setInventoryLevel(int inventoryLevel) {
        this.inventoryLevel = inventoryLevel;
    }

    @Override
    public String toString() {
        return "Product{" + "id=" + id + ", name='" + name + '\'' + ", currentPrice=" + currentPrice
                + ", inventoryLevel=" + inventoryLevel + '}';
    }
}
