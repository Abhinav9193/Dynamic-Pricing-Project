package com.pricing.config;

import com.pricing.model.*;
import com.pricing.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired private ProductRepository productRepository;
    @Autowired private SaleRepository saleRepository;
    @Autowired private CompetitorPriceRepository competitorPriceRepository;
    @Autowired private PriceRecommendationRepository recommendationRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        System.out.println(">>> SEEDER: Power-Syncing Marketplace Intelligence...");
        
        // 1. Repair core inventory
        ensureAndRepairShoe("Air Zoom Pegasus", "Nike", "Running", "Classic cushioning.", "/images/shoes/nike.png", "UK 9", "Blue", 3800.0, 4999.0, 25);
        ensureAndRepairShoe("Gazelle Shoes", "Adidas", "Casual", "Suede iconic sneaker.", "/images/shoes/adidas.png", "UK 8", "Navy", 2800.0, 3499.0, 40);
        ensureAndRepairShoe("Smash V2 Leather", "Puma", "Casual", "Clean court shoe.", "/images/shoes/puma.png", "UK 10", "Black", 1800.0, 2499.0, 35);
        ensureAndRepairShoe("Royal Complete", "Reebok", "Lifestyle", "Synthetic classic.", "/images/shoes/reebok.png", "UK 9", "White", 1500.0, 1999.0, 15);
        ensureAndRepairShoe("Walk-Fit Comfy", "Bata", "Casual", "Lightweight slip-on.", "https://images.unsplash.com/photo-1543508282-5c1f427f023f?w=400", "UK 7", "Tan", 900.0, 1299.0, 45);
        ensureAndRepairShoe("Marshal", "Adidas", "Casual", "Your premium custom shoe.", "/images/shoes/adidas.png", "UK 9", "Black/Gray", 1250.0, 1450.0, 13);

        // 2. Force-Sync Trends (Clear and Re-seed for core items to guarantee visible graphs)
        List<Product> coreProducts = productRepository.findAll();
        seedRichData(coreProducts);

        System.out.println(">>> SEEDER: All systems are green. Graphs and Images are ready.");
    }

    private void ensureAndRepairShoe(String name, String brand, String cat, String desc, String img, String size, String color, double base, double current, int stock) {
        Product existing = productRepository.findAll().stream()
                .filter(p -> p.getName().equals(name))
                .findFirst()
                .orElse(null);

        if (existing == null) {
            productRepository.save(new Product(name, brand, cat, desc, img, size, color, base, current, stock));
        } else {
            // Force correct image paths for core shoes (repairing broken uploads or renames)
            if (existing.getImageUrl() == null || existing.getImageUrl().startsWith("blob") || !existing.getImageUrl().contains("/")) {
                existing.setImageUrl(img);
                productRepository.save(existing);
                System.out.println(">>> Repaired Image: " + name);
            }
        }
    }

    private void seedRichData(List<Product> products) {
        Random rand = new Random(42); // Consistent patterns
        String[] competitors = {"Amazon", "Flipkart", "Myntra", "Local Market"};

        for (Product p : products) {
            // Only seed if empty to avoid bloat, but ensure it's actually empty
            if (saleRepository.findByProduct_Id(p.getId()).size() < 5) {
                System.out.println(">>> Generating 365-day trend for: " + p.getName());
                for (int i = 0; i < 365; i++) {
                    int month = LocalDateTime.now().minusDays(i).getMonthValue();
                    // Seasonal spikes for visible graph peaks
                    double seasonalWeight = (month == 10 || month == 11 || month == 12 || month == 3) ? 0.4 : 0.88;
                    
                    if (rand.nextDouble() > seasonalWeight) { 
                        int units = rand.nextInt(3) + 1;
                        double price = p.getCurrentPrice();
                        saleRepository.save(new Sale(p, units, price, price * units, 
                                LocalDateTime.now().minusDays(i).minusHours(rand.nextInt(10))));
                    }
                }
            }

            // Sync Competitors
            if (competitorPriceRepository.findByProductId(p.getId()).isEmpty()) {
                for (String comp : competitors) {
                    competitorPriceRepository.save(new CompetitorPrice(p, comp, 
                            Math.round(p.getCurrentPrice() * (0.95 + rand.nextDouble() * 0.1)), LocalDateTime.now()));
                }
            }

            // Sync AI Recommendations
            if (recommendationRepository.findByProductId(p.getId()).isEmpty()) {
                recommendationRepository.save(new PriceRecommendation(p, Math.round(p.getCurrentPrice() * 1.05), 10, 5000.0, LocalDateTime.now()));
            }
        }
    }
}
