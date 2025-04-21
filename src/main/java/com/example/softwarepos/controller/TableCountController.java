package com.example.softwarepos.controller;

import com.example.softwarepos.dto.TableCountDto;
import com.example.softwarepos.service.TableCountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/tablecount")
@RequiredArgsConstructor
public class TableCountController {

    private final TableCountService tableCountService;

    @PostMapping
    public ResponseEntity<?> save(@RequestBody TableCountDto dto) {
        Long id = tableCountService.saveTableCount(dto);
        return ResponseEntity.ok("처음 저장 완료, ID: " + id);
    }

    @PutMapping
    public ResponseEntity<?> update(@RequestBody TableCountDto dto) {
        tableCountService.updateTableCount(dto);
        return ResponseEntity.ok("테이블 개수 수정 완료");
    }

    @GetMapping
    public ResponseEntity<?> getCurrentCount() {
        Long count = tableCountService.getCurrentTableCount();
        return ResponseEntity.ok("현재 테이블 개수: " + count);
    }
}
