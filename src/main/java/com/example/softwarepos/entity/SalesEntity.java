package com.example.softwarepos.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Table(name = "sales")
@Getter
@Builder
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
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
    private Long prodPri;

}
