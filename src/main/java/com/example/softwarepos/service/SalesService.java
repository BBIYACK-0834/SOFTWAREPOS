package com.example.softwarepos.service;

import com.example.softwarepos.dto.Salesdto;
import com.example.softwarepos.entity.SalesEntity;
import com.example.softwarepos.repository.SalesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SalesService {

    private static final String UPLOAD_DIR = "/home/ubuntu/upload/";
    private final SalesRepository salesRepository;

    // 상품 등록
    public void addProduct(Salesdto dto, MultipartFile file) throws IOException {
        if (salesRepository.existsByProdName(dto.getProdName())) {
            throw new IllegalStateException("이미 존재하는 상품명입니다: " + dto.getProdName());
        }
        String savedImagePath = saveFile(file);

        SalesEntity product = SalesEntity.builder()
                .prodName(dto.getProdName())
                .prodIntro(dto.getProdIntro())
                .prodStatus(dto.getProdStatus())
                .prodPri(dto.getProdPri())
                .prodImage(savedImagePath) // ✅ 저장된 파일 경로 넣기
                .build();

        salesRepository.save(product);
    }

    // 상품 수정
    public void updateProduct(Long prodNum, Salesdto dto, MultipartFile file) throws IOException {
        SalesEntity existing = salesRepository.findById(prodNum)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다: " + prodNum));

        String savedImagePath = saveFile(file);

        existing.updateProduct(
                dto.getProdName(),
                dto.getProdIntro(),
                dto.getProdStatus(),
                dto.getProdPri(),
                savedImagePath != null ? savedImagePath : existing.getProdImage() // ✅ 새 파일 없으면 기존 이미지 유지
        );

        salesRepository.save(existing);
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
                .prodImage(product.getProdImage())
                .build()).collect(Collectors.toList());
    }

    // 개별 상품 조회
    public Salesdto getProductByNum(Long prodNum) {
        SalesEntity product = salesRepository.findById(prodNum)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다: " + prodNum));

        return Salesdto.builder()
                .prodNum(product.getProdNum())
                .prodName(product.getProdName())
                .prodIntro(product.getProdIntro())
                .prodStatus(product.getProdStatus())
                .prodPri(product.getProdPri())
                .prodImage(product.getProdImage())
                .build();
    }

    private String saveFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }

        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs(); // 폴더 없으면 생성
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        String uniqueFileName = UUID.randomUUID().toString() + extension;
        File dest = new File(UPLOAD_DIR + uniqueFileName);
        file.transferTo(dest);

        return "/upload/" + uniqueFileName; // 저장된 파일 경로 반환 (DB에 저장할 용도)
    }
}
