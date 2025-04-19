package com.example.softwarepos.entity;

import jakarta.persistence.*;
import lombok.*;

@Table(name = "sales")
@Getter
@Builder
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class SalesEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "prod_num", nullable = false)
    private Long prodNum;

    @Column(name = "prod_name", nullable = false, unique = true)
    private String prodName;

    @Column(name = "prod_intro", nullable = false)
    private String prodIntro;

    @Column(name = "prod_status", nullable = false)
    private String prodStatus;

    @Column(name = "prod_pri", nullable = false)
    private String prodPri;

    @Column(name = "table_count", nullable = false)
    private Long tableCount;

    @Column(name = "prod_image")
    private String prodImage;

    @Column(name = "payment_completed")
    private Boolean paymentCompleted;
}
