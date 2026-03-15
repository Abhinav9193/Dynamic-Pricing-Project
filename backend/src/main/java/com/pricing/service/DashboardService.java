package com.pricing.service;

import com.pricing.model.Product;
import com.pricing.model.Sale;
import com.pricing.repository.CompetitorPriceRepository;
import com.pricing.repository.ProductRepository;
import com.pricing.repository.SaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    @Autowired private SaleRepository saleRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private CompetitorPriceRepository competitorPriceRepository;

    public Map<String, Object> getDashboardStats() {
        List<Sale> allSales = saleRepository.findAll();
        List<Product> products = productRepository.findAll();

        double totalRevenue = allSales.stream().mapToDouble(Sale::getRevenue).sum();
        int totalUnitsSold = allSales.stream().mapToInt(Sale::getUnitsSold).sum();
        long totalProducts = products.size();
        long totalCompetitors = competitorPriceRepository.count();

        // Calculate total inventory value
        double inventoryValue = products.stream()
                .mapToDouble(p -> p.getCurrentPrice() * p.getInventoryLevel())
                .sum();

        // Low stock count
        long lowStockCount = products.stream()
                .filter(p -> p.getInventoryLevel() < 30)
                .count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", Math.round(totalRevenue));
        stats.put("totalSales", totalUnitsSold);
        stats.put("productCount", totalProducts);
        stats.put("competitorCount", totalCompetitors);
        stats.put("inventoryValue", Math.round(inventoryValue));
        stats.put("lowStockCount", lowStockCount);

        return stats;
    }
}
