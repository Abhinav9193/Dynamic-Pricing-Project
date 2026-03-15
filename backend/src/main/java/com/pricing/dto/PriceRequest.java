package com.pricing.dto;

public class PriceRequest {
    private int product_id;
    private double current_price;
    private int inventory;
    private double competitor_price;
    private int demand_score;

    public PriceRequest(int product_id, double current_price, int inventory, double competitor_price, int demand_score) {
        this.product_id = product_id;
        this.current_price = current_price;
        this.inventory = inventory;
        this.competitor_price = competitor_price;
        this.demand_score = demand_score;
    }

    // Getters and Setters
    public int getProduct_id() { return product_id; }
    public void setProduct_id(int product_id) { this.product_id = product_id; }
    public double getCurrent_price() { return current_price; }
    public void setCurrent_price(double current_price) { this.current_price = current_price; }
    public int getInventory() { return inventory; }
    public void setInventory(int inventory) { this.inventory = inventory; }
    public double getCompetitor_price() { return competitor_price; }
    public void setCompetitor_price(double competitor_price) { this.competitor_price = competitor_price; }
    public int getDemand_score() { return demand_score; }
    public void setDemand_score(int demand_score) { this.demand_score = demand_score; }
}
