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
                .prodImage(dto.getProdImage())
                .paymentCompleted(dto.getPaymentCompleted())
                .tableCount(dto.getTableCount())
                .build();

        salesRepository.save(product);
    }
}
