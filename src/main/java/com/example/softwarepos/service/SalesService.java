package com.example.softwarepos.service;

import com.example.softwarepos.dto.Salesdto;
import com.example.softwarepos.entity.SalesEntity;
import com.example.softwarepos.repository.SalesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SalesService {

    private final SalesRepository salesRepository;

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

    public void deleteProduct(Long prodNum) {
        SalesEntity existing = salesRepository.findById(prodNum)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다: " + prodNum));
        salesRepository.delete(existing);
    }

}
