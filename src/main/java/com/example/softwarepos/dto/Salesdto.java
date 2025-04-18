package com.example.softwarepos.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Salesdto {
    private Long prodNum;
    private String prodName;
    private String prodIntro;
    private String prodStatus;
    private String prodPri;
    private String prodImage;
    private Boolean paymentCompleted;
    private Long tableCount;
}

