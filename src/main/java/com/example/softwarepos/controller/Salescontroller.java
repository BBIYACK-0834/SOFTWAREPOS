package com.example.softwarepos.controller;

import com.example.softwarepos.dto.AddUser;
import com.example.softwarepos.dto.Salesdto;
import com.example.softwarepos.service.SalesService;
import com.example.softwarepos.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
@Controller
public class Salescontroller {
    private final SalesService salesService;

    public Salescontroller(SalesService salesService) {
        this.salesService = salesService;
    }
    @GetMapping("/prodmanage")
    public String Prodmanage() {
        return "prodmanage"; // templates/prodmanage.html 을 찾음
    }
    @PostMapping("/prodmanage")
    public String Prodmanage(Salesdto request, Model model) {
        try {
            salesService.addProduct(request);
            return "redirect:/index";
        } catch (IllegalStateException e) {
            model.addAttribute("error", e.getMessage());
            return "prodmanage"; // 템플릿 다시 렌더링
        }
    }

}
