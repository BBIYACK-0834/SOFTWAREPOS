package com.example.softwarepos.service;

import com.example.softwarepos.dto.Orderdto;
import com.example.softwarepos.entity.OrderEntity;
import com.example.softwarepos.entity.SalesEntity;
import com.example.softwarepos.repository.OrderRepository;
import com.example.softwarepos.repository.SalesRepository;
lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final SalesRepository salesRepository;

    public Long createOrder(Orderdto dto) {
        SalesEntity sales = salesRepository.findById(dto.getSales().getProdNum())
                .orElseThrow(() -> new IllegalArgumentException("해당 상품이 존재하지 않습니다."));

        OrderEntity order = OrderEntity.builder()
                .sales(sales)
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

    public List<Orderdto> getOrdersByTableCount(Long tableCount) {
        List<OrderEntity> entities = orderRepository.findAllByTableCount(tableCount);
        return entities.stream().map(order -> Orderdto.builder()
                .orderNum(order.getOrderNum())
                .sales(order.getSales())
                .quantity(order.getQuantity())
                .totalPrice(order.getTotalPrice())
                .orderedAt(order.getOrderedAt())
                .TableCount(order.getTableCount())
                .build()
        ).collect(Collectors.toList());
    }
}