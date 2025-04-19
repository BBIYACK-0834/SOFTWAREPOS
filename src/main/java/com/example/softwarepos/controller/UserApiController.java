package com.example.softwarepos.controller;

import com.example.softwarepos.dto.AddUser;
import com.example.softwarepos.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserApiController {
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody AddUser dto) {
        boolean success = userService.login(dto);
        if (success) {
            return ResponseEntity.ok("로그인 성공");
        }
        return ResponseEntity.status(401).body("로그인 실패");
    }

        @PostMapping("/signup")
        public ResponseEntity<String> signup(@RequestBody AddUser request) {
            userService.save(request);
            return ResponseEntity.ok("회원가입 성공");
        }

}
