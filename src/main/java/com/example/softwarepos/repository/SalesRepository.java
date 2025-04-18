package com.example.softwarepos.repository;

import com.example.softwarepos.entity.SalesEntity;
import com.example.softwarepos.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SalesRepository extends JpaRepository<SalesEntity, Long> {
    boolean existsByProdName(String prodName);
}

