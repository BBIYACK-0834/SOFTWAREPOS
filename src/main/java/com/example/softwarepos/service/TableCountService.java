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

    // 테이블 개수 저장 (기존 값이 있으면 예외 발생)
    public Long saveTableCount(TableCountDto dto) {
        if (tableCountRepository.count() > 0) {
            throw new IllegalStateException("이미 등록된 테이블 개수가 있습니다. 수정만 가능합니다.");
        }

        TableCountEntity entity = TableCountEntity.builder()
                .count(dto.getCount())
                .build();

        return tableCountRepository.save(entity).getId();
    }

    // 테이블 개수 수정 (기존 값이 없으면 새로 저장)
    public void updateTableCount(TableCountDto dto) {
        Optional<TableCountEntity> existing = tableCountRepository.findAll().stream().findFirst();
        if (existing.isEmpty()) {
            // 테이블 개수가 없으면 새로운 기본값을 저장
            TableCountEntity entity = TableCountEntity.builder()
                    .count(dto.getCount())
                    .build();
            tableCountRepository.save(entity);
            return;
        }

        TableCountEntity entity = existing.get();
        entity.setCount(dto.getCount());
        tableCountRepository.save(entity);
    }

    // 현재 테이블 개수 조회 (없으면 기본값 3 반환)
    public Long getCurrentTableCount() {
        return tableCountRepository.findAll().stream()
                .findFirst()
                .map(TableCountEntity::getCount)
                .orElseGet(() -> {
                    // 테이블 개수가 없으면 기본값 3을 반환
                    return 3L;  // 기본값 3 설정
                });
    }
}
