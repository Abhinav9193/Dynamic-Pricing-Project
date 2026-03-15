package com.pricing.service;

import com.pricing.model.*;
import com.pricing.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PricingService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PriceRecommendationRepository recommendationRepository;

    @Autowired
    private PriceHistoryRepository historyRepository;

    @Autowired
    private CompetitorPriceRepository competitorPriceRepository;

    @Value("${ml-service.url}")
    private String mlServiceUrl;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    @Autowired
    private org.springframework.web.client.RestTemplate restTemplate;

    public PriceRecommendation generateRecommendation(Long productId, Integer month) {
        try {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found with ID: " + productId));

            if (month == null || month < 1 || month > 12) {
                month = LocalDateTime.now().getMonthValue();
            }

            // Get latest competitor price for this product
            List<CompetitorPrice> competitors = competitorPriceRepository.findByProductId(productId);
            double latestCompetitorPrice = competitors.isEmpty() ? product.getCurrentPrice()
                    : competitors.get(competitors.size() - 1).getPrice();

            // Calculate demand score for ML (1-100)
            int demandScore = 50; // default
            if (month >= 9 && month <= 11) demandScore = 85; 
            else if (month >= 5 && month <= 7) demandScore = 30;

            com.pricing.dto.PriceRequest mlRequest = new com.pricing.dto.PriceRequest(
                product.getId().intValue(),
                product.getCurrentPrice(),
                product.getInventoryLevel(),
                latestCompetitorPrice,
                demandScore
            );

            double recPrice;
            int predictedDemand;
            String analysis;

            try {
                com.pricing.dto.MLResponse mlResponse = restTemplate.postForObject(mlServiceUrl + "/predict-price", mlRequest, com.pricing.dto.MLResponse.class);
                if (mlResponse != null) {
                    recPrice = mlResponse.getRecommended_price();
                    predictedDemand = mlResponse.getPredicted_demand();
                    analysis = "AI Analysis (Neural Engine): Based on deep learning analysis of market trends for Month " + month + 
                               ", we recommend adjusting the price to ₹" + recPrice + ". Expected demand is around " + predictedDemand + 
                               " pairs with a profit efficiency of " + mlResponse.getExpected_profit() + "%.";
                } else {
                    throw new RuntimeException("Empty response from ML service");
                }
            } catch (Exception e) {
                System.err.println("ML Service call failed, using heuristic fallback: " + e.getMessage());
                // HEURISTIC FALLBACK (Existing Logic)
                double seasonMultiplier = (month >= 9 && month <= 11) ? 1.15 : (month >= 5 && month <= 7) ? 0.85 : 1.0;
                recPrice = product.getCurrentPrice();
                if (product.getInventoryLevel() > 80) recPrice *= (0.90 * seasonMultiplier);
                else if (product.getInventoryLevel() < 20) recPrice *= (1.10 * seasonMultiplier);
                else recPrice *= (1.02 * seasonMultiplier);

                if (recPrice > latestCompetitorPrice * 1.15) recPrice = latestCompetitorPrice * 1.05;
                if (recPrice < latestCompetitorPrice * 0.85) recPrice = latestCompetitorPrice * 0.95;
                if (recPrice < product.getBasePrice() * 1.10) recPrice = product.getBasePrice() * 1.12; 

                predictedDemand = (int) ((15 + (product.getInventoryLevel() * 0.1)) * seasonMultiplier);
                analysis = "AI Analysis (Heuristic Engine): Seasonal pattern analysis for Month " + month + 
                           " suggests a price of ₹" + Math.round(recPrice) + " based on inventory levels and competitor benchmark.";
            }

            PriceRecommendation recommendation = new PriceRecommendation(
                    product,
                    (double) Math.round(recPrice),
                    predictedDemand,
                    (double) Math.round((recPrice - product.getBasePrice()) * predictedDemand),
                    LocalDateTime.now());
            
            recommendation.setAiAnalysis(analysis);
            return recommendationRepository.save(recommendation);
        } catch (Exception e) {
            System.err.println("ERROR Generating Recommendation for ID " + productId + ": " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    public void updateProductPrice(Long productId, double newPrice) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        double oldPrice = product.getCurrentPrice();
        product.setCurrentPrice(newPrice);
        productRepository.save(product);

        // Track History
        PriceHistory history = new PriceHistory(product, oldPrice, newPrice, LocalDateTime.now());
        historyRepository.save(history);
    }
}
