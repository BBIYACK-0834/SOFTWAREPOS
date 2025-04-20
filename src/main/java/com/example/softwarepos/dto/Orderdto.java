package com.example.softwarepos.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Orderdto {
    private Long orderId;

    private String productName;

    private int quantity;

    private Long totalPrice;

    private LocalDateTime orderedAt; // 주문 시간 추가
}

