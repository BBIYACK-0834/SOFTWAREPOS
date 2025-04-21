package com.example.softwarepos.service;

import com.example.softwarepos.dto.TableCountDto;
import com.example.softwarepos.entity.TableCountEntity;
import com.example.softwarepos.repository.TableCountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TableCountService {

    private final TableCountRepository tableCountRepository;

    public Long saveTableCount(TableCountDto dto) {
        if (tableCountRepository.count() > 0) {
            throw new IllegalStateException("이미 등록된 테이블 개수가 있습니다. 수정만 가능합니다.");
        }

        TableCountEntity entity = TableCountEntity.builder()
                .count(dto.getCount())
                .build();

        return tableCountRepository.save(entity).getId();
    }

    public void updateTableCount(TableCountDto dto) {
        Optional<TableCountEntity> existing = tableCountRepository.findAll().stream().findFirst();
        if (existing.isEmpty()) {
            throw new IllegalStateException("저장된 테이블 개수가 없습니다. 먼저 저장해야 합니다.");
        }

        TableCountEntity entity = existing.get();
        entity.setCount(dto.getCount());
        tableCountRepository.save(entity);
    }

    public Long getCurrentTableCount() {
        return tableCountRepository.findAll().stream()
                .findFirst()
                .map(TableCountEntity::getCount)
                .orElseThrow(() -> new IllegalStateException("등록된 테이블 개수가 없습니다."));
    }
}
