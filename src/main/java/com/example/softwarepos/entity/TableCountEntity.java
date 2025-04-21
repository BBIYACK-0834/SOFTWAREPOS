package com.example.softwarepos.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "table_count")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TableCountEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "table_count", nullable = false)
    private Long count;
}
