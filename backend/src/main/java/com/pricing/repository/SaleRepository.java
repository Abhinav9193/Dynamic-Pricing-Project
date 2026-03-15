package com.pricing.repository;

import com.pricing.model.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SaleRepository extends JpaRepository<Sale, Long> {
    List<Sale> findByProduct_Id(Long productId);
    
    // Explicitly delete all sales for a product to allow clean re-seeding
    void deleteByProduct_Id(Long productId);
}
