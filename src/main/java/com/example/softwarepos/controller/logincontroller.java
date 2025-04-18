package com.example.softwarepos.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
@Controller
public class logincontroller {

    @GetMapping("/index")
    public String index() {
        return "forward:/index.html"; // static/login.html로 연결
    }
    @GetMapping("/login")
    public String login() {
        return "forward:/login.html"; // static/login.html로 연결
    }

    @GetMapping("/signup")
    public String signup() {
        return "forward:/signup.html"; // static/signup.html이 있어야 함
    }
}

