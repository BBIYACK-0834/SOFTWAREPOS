package com.example.softwarepos.controller;

import com.example.softwarepos.dto.TableCountDto;
import com.example.softwarepos.service.TableCountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/admin/tablecount")
@RequiredArgsConstructor
public class TableCountController {

    private final TableCountService tableCountService;

    @PostMapping
    public ResponseEntity<?> save(@RequestBody TableCountDto dto) {
        Long id = tableCountService.saveTableCount(dto);
        return ResponseEntity.ok(id); // 새로 저장된 테이블 개수 ID 반환
    }

    @PutMapping
    public ResponseEntity<Void> update(@RequestBody TableCountDto dto) {
        tableCountService.updateTableCount(dto); // 테이블 개수 업데이트
        return ResponseEntity.noContent().build();  // 응답 본문 없이 상태 코드만 반환 (204 No Content)
    }


    @GetMapping
    public ResponseEntity<?> getCurrentCount() {
        Long count = tableCountService.getCurrentTableCount(); // 현재 테이블 개수 조회
        return ResponseEntity.ok(count);  // 테이블 개수만 반환
    }
}
