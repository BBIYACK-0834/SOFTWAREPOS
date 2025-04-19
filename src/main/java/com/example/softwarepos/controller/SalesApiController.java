package com.example.softwarepos.controller;

import com.example.softwarepos.dto.Salesdto;
import com.example.softwarepos.service.SalesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/products")
public class SalesApiController {

    private final SalesService salesService;

    // ✅ 상품 등록
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Salesdto dto) {
        try {
            salesService.addProduct(dto);
            return ResponseEntity.ok("상품 등록 성공");
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ 상품 수정
    @PutMapping("/{prodNum}")
    public ResponseEntity<?> update(@PathVariable Long prodNum, @RequestBody Salesdto dto) {
        try {
            salesService.updateProduct(prodNum, dto);
            return ResponseEntity.ok("상품 수정 성공");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ 상품 삭제
    @DeleteMapping("/{prodNum}")
    public ResponseEntity<?> delete(@PathVariable Long prodNum) {
        try {
            salesService.deleteProduct(prodNum);
            return ResponseEntity.ok("상품 삭제 성공");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
