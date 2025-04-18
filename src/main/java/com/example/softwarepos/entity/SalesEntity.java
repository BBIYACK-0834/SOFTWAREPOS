package com.example.softwarepos.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Table(name = "sales")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Entity
public class SalesEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false)
    private Long id;

    @Column(name = "prod_num", nullable = false)
    private Long prod_num;

    @Column(name = "prod_name", nullable = false, unique = true)
    private String prod_name;

    @Column(name = "prod_intro", nullable = false)
    private String prod_intro;

    @Column(name = "prod_status", nullable = false)
    private String prod_status;

    @Column(name = "prod_pri", nullable = false)
    private String prod_pri;

    @Column(name = "table_count", nullable = false)
    private Long table_count;

}
