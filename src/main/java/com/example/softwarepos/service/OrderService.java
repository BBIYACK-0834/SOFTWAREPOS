package com.example.softwarepos.service;

import com.example.softwarepos.dto.Orderdto;
import com.example.softwarepos.entity.OrderEntity;
import com.example.softwarepos.entity.SalesEntity;
import com.example.softwarepos.repository.OrderRepository;
import com.example.softwarepos.repository.SalesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final SalesRepository salesRepository;

    public Long createOrder(Orderdto dto) {
        SalesEntity sales = salesRepository.findByProdName(dto.getProdName())
                .orElseThrow(() -> new IllegalArgumentException("해당 상품이 존재하지 않습니다."));

        Long totalPrice = sales.getProdPri() * dto.getQuantity();

        OrderEntity order = OrderEntity.builder()
                .sales(sales)
                .quantity(dto.getQuantity())
                .tableCount(dto.getTableNumber())
                .totalPrice(totalPrice)
                .build();

        return orderRepository.save(order).getOrderNum();
    }

    public void updateOrder(Long orderNum, Orderdto dto) {
        OrderEntity order = orderRepository.findById(orderNum)
                .orElseThrow(() -> new IllegalArgumentException("해당 주문을 찾을 수 없습니다."));

        SalesEntity sales = salesRepository.findByProdName(dto.getProdName())
                .orElseThrow(() -> new IllegalArgumentException("해당 상품을 찾을 수 없습니다."));

        Long totalPrice = sales.getProdPri() * dto.getQuantity();

        order.setSales(sales);
        order.setQuantity(dto.getQuantity());
        order.setTableCount(dto.getTableNumber());
        order.setTotalPrice(totalPrice);

        orderRepository.save(order);
    }

    public void deleteOrder(Long orderNum) {
        OrderEntity order = orderRepository.findById(orderNum)
                .orElseThrow(() -> new IllegalArgumentException("해당 주문을 찾을 수 없습니다."));

        orderRepository.delete(order);
    }


    public List<Orderdto> getOrdersByTableCount(Long tableCount) {
        return orderRepository.findAllByTableCount(tableCount).stream()
                .map(order -> Orderdto.builder()
                        .orderNum(order.getOrderNum())
                        .prodName(order.getSales().getProdName())
                        .quantity(order.getQuantity())
                        .totalPrice(order.getTotalPrice())
                        .orderedAt(order.getOrderedAt())
                        .tableNumber(order.getTableCount())
                        .build())
                .collect(Collectors.toList());
    }
}
