package com.example.softwarepos.repository;

import com.example.softwarepos.entity.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
    List<OrderEntity> findAllByTableCount(Long tableCount); // ✅ 올바른 방식
}