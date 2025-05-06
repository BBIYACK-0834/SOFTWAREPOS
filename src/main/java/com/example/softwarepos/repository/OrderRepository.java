package com.example.softwarepos.repository;

import com.example.softwarepos.entity.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<OrderEntity, Long> {

    // 테이블 번호로 주문 전체 조회 (기본)
    List<OrderEntity> findAllByTableCount(Long tableCount);

    // ✅ 선택: 최신 주문 순으로 정렬해서 조회
    List<OrderEntity> findAllByTableCountOrderByOrderedAtDesc(Long tableCount);
}
