package com.example.softwarepos.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderNum;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prod_num", referencedColumnName = "prod_num")
    private SalesEntity sales;  // ✅ 상품 전체 정보 접근 가능 (prodName, prodIntro 등 포함)

    @Column(nullable = false)
    private Long quantity;

    @Column(name = "table_count", nullable = false)
    private Long tableCount;

    @Column(nullable = false)
    private Long totalPrice;

    @Column(name = "ordered_at", nullable = false, updatable = false)
    private LocalDateTime orderedAt;

    @PrePersist
    protected void onCreate() {
        this.orderedAt = LocalDateTime.now();
    }
}
