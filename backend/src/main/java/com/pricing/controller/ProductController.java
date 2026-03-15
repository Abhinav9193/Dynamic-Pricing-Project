package com.pricing.controller;

import com.pricing.model.*;
import com.pricing.repository.*;
import com.pricing.service.PricingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired private PricingService pricingService;
    @Autowired private ProductRepository productRepository;
    @Autowired private SaleRepository saleRepository;
    @Autowired private CompetitorPriceRepository competitorPriceRepository;
    @Autowired private PriceHistoryRepository priceHistoryRepository;
    @Autowired private PriceRecommendationRepository recommendationRepository;

    @GetMapping
    public List<Product> getAllProducts() {
        return pricingService.getAllProducts();
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return pricingService.saveProduct(product);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable(value = "id") Long id) {
        return pricingService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Transactional
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable(value = "id") Long id) {
        // Delete dependent data first to satisfy foreign key constraints
        saleRepository.deleteByProduct_Id(id);
        competitorPriceRepository.findByProductId(id).forEach(c -> competitorPriceRepository.delete(c));
        priceHistoryRepository.deleteByProduct_Id(id);
        recommendationRepository.deleteByProduct_Id(id);
        
        productRepository.deleteById(id);
        return ResponseEntity.ok("Product deleted");
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable(value = "id") Long id, @RequestBody Product updated) {
        return productRepository.findById(id).map(p -> {
            p.setName(updated.getName());
            p.setBrand(updated.getBrand());
            p.setCategory(updated.getCategory());
            p.setDescription(updated.getDescription());
            p.setImageUrl(updated.getImageUrl());
            p.setSize(updated.getSize());
            p.setColor(updated.getColor());
            p.setBasePrice(updated.getBasePrice());
            p.setCurrentPrice(updated.getCurrentPrice());
            p.setInventoryLevel(updated.getInventoryLevel());
            return ResponseEntity.ok(productRepository.save(p));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/recommend")
    public ResponseEntity<PriceRecommendation> getRecommendation(
        @PathVariable(value = "id") Long id, 
        @RequestParam(name = "month", required = false) Integer month
    ) {
        PriceRecommendation rec = pricingService.generateRecommendation(id, month);
        return rec != null ? ResponseEntity.ok(rec) : ResponseEntity.internalServerError().build();
    }

    @PutMapping("/{id}/price")
    public ResponseEntity<?> updatePrice(@PathVariable(value = "id") Long id, @RequestParam(name = "newPrice") double newPrice) {
        pricingService.updateProductPrice(id, newPrice);
        return ResponseEntity.ok("Price updated successfully");
    }

    @GetMapping("/{id}/competitors")
    public List<CompetitorPrice> getCompetitorPrices(@PathVariable(value = "id") Long id) {
        List<CompetitorPrice> comps = competitorPriceRepository.findByProductId(id);
        if (comps.isEmpty()) {
            Product p = productRepository.findById(id).orElse(null);
            if (p != null) {
                competitorPriceRepository.save(new CompetitorPrice(p, "Amazon", p.getCurrentPrice() * 0.98, LocalDateTime.now().minusHours(2)));
                competitorPriceRepository.save(new CompetitorPrice(p, "Flipkart", p.getCurrentPrice() * 1.05, LocalDateTime.now().minusHours(1)));
                competitorPriceRepository.save(new CompetitorPrice(p, "Myntra", p.getCurrentPrice() * 1.02, LocalDateTime.now().minusHours(4)));
                comps = competitorPriceRepository.findByProductId(id);
            }
        }
        return comps;
    }

    @GetMapping("/{id}/sales")
    public List<Sale> getProductSales(@PathVariable(value = "id") Long id) {
        return saleRepository.findByProduct_Id(id);
    }

    @GetMapping("/{id}/monthly-sales")
    public List<Map<String, Object>> getMonthlySales(@PathVariable(value = "id") Long id) {
        List<Sale> sales = saleRepository.findByProduct_Id(id);
        String[] monthNames = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};

        // Group sales by month, ensuring null-safety
        Map<Integer, List<Sale>> byMonth = sales.stream()
                .filter(s -> s.getTimestamp() != null)
                .collect(Collectors.groupingBy(s -> s.getTimestamp().getMonthValue()));

        List<Map<String, Object>> result = new ArrayList<>();
        for (int m = 1; m <= 12; m++) {
            Map<String, Object> monthData = new HashMap<>();
            monthData.put("month", monthNames[m - 1]);
            List<Sale> monthSales = byMonth.getOrDefault(m, Collections.emptyList());
            
            int totalUnits = monthSales.stream().mapToInt(Sale::getUnitsSold).sum();
            double revenue = monthSales.stream().mapToDouble(Sale::getRevenue).sum();
            
            monthData.put("units", totalUnits);
            monthData.put("revenue", (double) Math.round(revenue));
            monthData.put("avgPrice", monthSales.isEmpty() ? 0 :
                    (double) Math.round(monthSales.stream().mapToDouble(Sale::getPrice).average().orElse(0)));
            result.add(monthData);
        }
        return result;
    }

    @GetMapping("/all-monthly-sales")
    public List<Map<String, Object>> getAllMonthlySales() {
        List<Sale> sales = saleRepository.findAll();
        String[] monthNames = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};

        Map<Integer, List<Sale>> byMonth = sales.stream()
                .filter(s -> s.getTimestamp() != null)
                .collect(Collectors.groupingBy(s -> s.getTimestamp().getMonthValue()));

        List<Map<String, Object>> result = new ArrayList<>();
        for (int m = 1; m <= 12; m++) {
            Map<String, Object> monthData = new HashMap<>();
            monthData.put("month", monthNames[m - 1]);
            List<Sale> monthSales = byMonth.getOrDefault(m, Collections.emptyList());
            monthData.put("units", monthSales.stream().mapToInt(Sale::getUnitsSold).sum());
            monthData.put("revenue", (double) Math.round(monthSales.stream().mapToDouble(Sale::getRevenue).sum()));
            result.add(monthData);
        }
        return result;
    }

    @GetMapping("/all-competitors")
    public List<Map<String, Object>> getAllCompetitors() {
        List<Product> products = productRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Product p : products) {
            Map<String, Object> item = new HashMap<>();
            item.put("productId", p.getId());
            item.put("productName", p.getName());
            item.put("brand", p.getBrand());
            item.put("imageUrl", p.getImageUrl());
            item.put("ourPrice", p.getCurrentPrice());

            List<CompetitorPrice> comps = competitorPriceRepository.findByProductId(p.getId());
            
            if (comps.isEmpty()) {
                competitorPriceRepository.save(new CompetitorPrice(p, "Amazon", p.getCurrentPrice() * 0.98, LocalDateTime.now().minusHours(2)));
                competitorPriceRepository.save(new CompetitorPrice(p, "Flipkart", p.getCurrentPrice() * 1.05, LocalDateTime.now().minusHours(1)));
                competitorPriceRepository.save(new CompetitorPrice(p, "Myntra", p.getCurrentPrice() * 1.02, LocalDateTime.now().minusHours(4)));
                comps = competitorPriceRepository.findByProductId(p.getId());
            }

            List<Map<String, Object>> compList = new ArrayList<>();
            for (CompetitorPrice cp : comps) {
                Map<String, Object> c = new HashMap<>();
                c.put("name", cp.getCompetitorName());
                c.put("price", cp.getPrice());
                c.put("lastUpdated", cp.getTimestamp());
                compList.add(c);
            }
            item.put("competitors", compList);
            result.add(item);
        }
        return result;
    }
}
