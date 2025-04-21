package com.example.softwarepos.repository;

import com.example.softwarepos.entity.TableCountEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TableCountRepository extends JpaRepository<TableCountEntity, Long> {
}
