package com.pricing.repository;

import com.pricing.model.PriceRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PriceRecommendationRepository extends JpaRepository<PriceRecommendation, Long> {
    List<PriceRecommendation> findByProductId(Long productId);
}
