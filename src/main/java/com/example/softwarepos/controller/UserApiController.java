package com.example.softwarepos.controller;

import com.example.softwarepos.dto.AddUser;
import com.example.softwarepos.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;

@RequiredArgsConstructor
@Controller
public class UserApiController {
    private final UserService userService;

    @PostMapping("/signup")
    public String signup(AddUser request) {
        userService.save(request); //회원 가입 메서드 호출
        return "redirect:/login"; //회원 가입이 완료된 이후에 로그인 페이지로 이동
    }
}