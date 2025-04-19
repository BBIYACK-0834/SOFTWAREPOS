package com.example.softwarepos.repository;

import com.example.softwarepos.entity.SalesEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SalesRepository extends JpaRepository<SalesEntity, Long> {
    boolean existsByProdName(String prodName);
}

