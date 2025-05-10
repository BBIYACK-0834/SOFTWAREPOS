package com.example.softwarepos.controller;

import com.example.softwarepos.dto.Salesdto;
import com.example.softwarepos.service.SalesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping
public class SalesApiController {

    private final SalesService salesService;

    // ✅ 상품 등록 (DTO + 파일 받기)
    @PostMapping("/admin/products")
    public ResponseEntity<?> create(
            @RequestPart("dto") Salesdto dto,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        try {
            salesService.addProduct(dto, file);
            return ResponseEntity.ok("상품 등록 성공");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ 상품 수정 (DTO + 파일 받기)
    @PutMapping("/admin/products/{prodNum}")
    public ResponseEntity<?> update(
            @PathVariable Long prodNum,
            @RequestPart("dto") Salesdto dto,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        try {
            salesService.updateProduct(prodNum, dto, file);
            return ResponseEntity.ok("상품 수정 성공");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ 상품 삭제
    @DeleteMapping("/admin/products/{prodNum}")
    public ResponseEntity<?> delete(@PathVariable Long prodNum) {
        try {
            salesService.deleteProduct(prodNum);
            return ResponseEntity.ok("상품 삭제 성공");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ 전체 상품 조회
    @GetMapping("/user/products")
    public ResponseEntity<List<Salesdto>> getAllProducts() {
        return ResponseEntity.ok(salesService.getAllProducts());
    }

    // ✅ 개별 상품 조회
    @GetMapping("/user/products/{prodNum}")
    public ResponseEntity<?> getProduct(@PathVariable Long prodNum) {
        try {
            Salesdto dto = salesService.getProductByNum(prodNum);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
