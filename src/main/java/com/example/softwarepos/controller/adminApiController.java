package com.example.softwarepos.controller;

import com.example.softwarepos.dto.AddUser;
import com.example.softwarepos.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class adminApiController {
    private final UserService userService;


    @GetMapping("/")
    public String index() {
        return "주문 관리 페이지입니다.(관리자용)";
    }
}