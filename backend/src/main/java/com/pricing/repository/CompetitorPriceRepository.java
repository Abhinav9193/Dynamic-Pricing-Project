package com.pricing.repository;

import com.pricing.model.CompetitorPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CompetitorPriceRepository extends JpaRepository<CompetitorPrice, Long> {
    List<CompetitorPrice> findByProductId(Long productId);
}
