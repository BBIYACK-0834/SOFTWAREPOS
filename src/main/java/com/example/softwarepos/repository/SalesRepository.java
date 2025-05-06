package com.example.softwarepos.repository;

import com.example.softwarepos.entity.SalesEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SalesRepository extends JpaRepository<SalesEntity, Long> {

    // 상품 이름으로 존재 여부 확인
    boolean existsByProdName(String prodName);

    // ✅ 상품 이름으로 엔티티 조회 (주문 등록 시 필수)
    Optional<SalesEntity> findByProdName(String prodName);
}
