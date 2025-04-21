package com.example.softwarepos.controller;

import com.example.softwarepos.dto.Orderdto;
import com.example.softwarepos.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class OrderApiController {

    private final OrderService orderService;

    @PostMapping("/user/order")
    public ResponseEntity<?> create(@RequestBody Orderdto dto) {
        Long orderId = orderService.createOrder(dto);
        return ResponseEntity.ok("주문 생성 완료. 주문번호: " + orderId);
    }

    @PutMapping("/admin/{orderNum}")
    public ResponseEntity<?> update(@PathVariable Long orderNum, @RequestBody Orderdto dto) {
        orderService.updateOrder(orderNum, dto);
        return ResponseEntity.ok("주문 수정 완료");
    }

    @DeleteMapping("/admin/{orderNum}")
    public ResponseEntity<?> delete(@PathVariable Long orderNum) {
        orderService.deleteOrder(orderNum);
        return ResponseEntity.ok("주문 삭제 완료");
    }
    @GetMapping("/user/order/{tableCount}")
    public ResponseEntity<?> getOrdersByTable(@PathVariable Long tableCount) {
        try {
            return ResponseEntity.ok(orderService.getOrdersByTableCount(tableCount));
        } catch (Exception e) {
            e.printStackTrace(); // 콘솔에 전체 예외 출력
            return ResponseEntity.status(500).body("에러 발생: " + e.getMessage());
        }
    }

}
