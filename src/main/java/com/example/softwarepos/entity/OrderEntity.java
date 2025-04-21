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
    private SalesEntity sales; // 이걸로 prodName 포함 모든 상품정보 접근 가능

    private Long quantity;
    @Column(name = "table_count", nullable = false)
    private Long tableCount;
    private Long totalPrice; // 혹은 금액을 계산해서 넣는 방식
    @Column(name = "ordered_at", nullable = false, updatable = false)
    private LocalDateTime orderedAt;

    @PrePersist
    protected void onCreate() {
        this.orderedAt = LocalDateTime.now();
    }
}
