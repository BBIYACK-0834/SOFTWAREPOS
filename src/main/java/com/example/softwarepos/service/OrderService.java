package com.example.softwarepos.service;

import com.example.softwarepos.dto.Orderdto;
import com.example.softwarepos.entity.OrderEntity;
import com.example.softwarepos.entity.SalesEntity;
import com.example.softwarepos.repository.OrderRepository;
import com.example.softwarepos.repository.SalesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final SalesRepository salesRepository;

    public Long createOrder(Orderdto dto) {
        SalesEntity sales = salesRepository.findById(dto.getSales().getProdNum())
                .orElseThrow(() -> new IllegalArgumentException("해당 상품이 존재하지 않습니다."));

        OrderEntity order = OrderEntity.builder()
                .sales(sales) // JPA가 관리하는 엔티티를 넣어야 함
                .quantity(dto.getQuantity())
                .totalPrice(dto.getTotalPrice())
                .tableCount(dto.getTableCount())
                .build();

        return orderRepository.save(order).getOrderNum();
    }

    public void updateOrder(Long orderNum, Orderdto dto) {
        OrderEntity order = orderRepository.findById(orderNum)
                .orElseThrow(() -> new IllegalArgumentException("해당 주문을 찾을 수 없습니다."));

        SalesEntity sales = salesRepository.findById(dto.getSales().getProdNum())
                .orElseThrow(() -> new IllegalArgumentException("해당 상품을 찾을 수 없습니다."));

        order.setSales(sales);
        order.setQuantity(dto.getQuantity());
        order.setTotalPrice(dto.getTotalPrice());

        orderRepository.save(order);
    }

    public void deleteOrder(Long orderNum) {
        if (!orderRepository.existsById(orderNum)) {
            throw new IllegalArgumentException("해당 주문을 찾을 수 없습니다.");
        }
        orderRepository.deleteById(orderNum);
    }
    public List<OrderEntity> getOrdersByTableCount(Long TableCount) {
        return orderRepository.findAllByTableCount(TableCount);
    }

}
