package com.example.softwarepos.service;

import com.example.softwarepos.dto.Salesdto;
import com.example.softwarepos.entity.SalesEntity;
import com.example.softwarepos.repository.SalesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SalesService {

    private final SalesRepository salesRepository;

    // 상품 등록
    public void addProduct(Salesdto dto) {
        if (salesRepository.existsByProdName(dto.getProdName())) {
            throw new IllegalStateException("이미 존재하는 상품명입니다: " + dto.getProdName());
        }
        SalesEntity product = SalesEntity.builder()
                .prodNum(dto.getProdNum())
                .prodName(dto.getProdName())
                .prodIntro(dto.getProdIntro())
                .prodStatus(dto.getProdStatus())
                .prodPri(dto.getProdPri())
                .build();

        salesRepository.save(product);
    }

    // 상품 수정
    public void updateProduct(Long prodNum, Salesdto dto) {
        SalesEntity existing = salesRepository.findById(prodNum)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다: " + prodNum));

        SalesEntity updated = SalesEntity.builder()
                .prodNum(prodNum)
                .prodName(dto.getProdName())
                .prodIntro(dto.getProdIntro())
                .prodStatus(dto.getProdStatus())
                .prodPri(dto.getProdPri())
                .build();

        salesRepository.save(updated);
    }

    // 상품 삭제
    public void deleteProduct(Long prodNum) {
        SalesEntity existing = salesRepository.findById(prodNum)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다: " + prodNum));
        salesRepository.delete(existing);
    }

    // 전체 상품 조회
    public List<Salesdto> getAllProducts() {
        return salesRepository.findAll().stream().map(product -> Salesdto.builder()
                .prodNum(product.getProdNum())
                .prodName(product.getProdName())
                .prodIntro(product.getProdIntro())
                .prodStatus(product.getProdStatus())
                .prodPri(product.getProdPri())
                .build()).collect(Collectors.toList());
    }

    // ✅ 개별 상품 조회
    public Salesdto getProductByNum(Long prodNum) {
        SalesEntity product = salesRepository.findById(prodNum)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다: " + prodNum));

        return Salesdto.builder()
                .prodNum(product.getProdNum())
                .prodName(product.getProdName())
                .prodIntro(product.getProdIntro())
                .prodStatus(product.getProdStatus())
                .prodPri(product.getProdPri())
                .build();
    }
}
