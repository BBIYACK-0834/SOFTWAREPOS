package com.example.softwarepos.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Orderdto {
    private Long orderNum;

    // 이 두 필드가 중요
    private String prodName;
    private Long price;

    private Long quantity;
    private Long tableNumber;
    private Long totalPrice;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime orderedAt;
}
