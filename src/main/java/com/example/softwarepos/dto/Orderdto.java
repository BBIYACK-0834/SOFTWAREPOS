package com.example.softwarepos.dto;

import com.example.softwarepos.entity.SalesEntity;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Orderdto {
    private Long orderNum;
    private SalesEntity sales;
    private Long quantity;
    private Long TableCount;
    private Long totalPrice;

    private LocalDateTime orderedAt; // 주문 시간 추가
}

