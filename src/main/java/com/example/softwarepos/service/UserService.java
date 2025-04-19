package com.example.softwarepos.service;

import com.example.softwarepos.dto.AddUser;
import com.example.softwarepos.entity.UserEntity;
import com.example.softwarepos.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    public boolean login(AddUser dto) {
        return userRepository.findByEmail(dto.getEmail())
                .map(user -> bCryptPasswordEncoder.matches(dto.getPassword(), user.getPassword()))
                .orElse(false);
    }
    public Long save(AddUser dto) {
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new IllegalStateException("이미 등록된 이메일입니다.");
        }

        UserEntity user = UserEntity.builder()
                .email(dto.getEmail())
                .password(bCryptPasswordEncoder.encode(dto.getPassword()))
                .build();

        return userRepository.save(user).getId();
    }
}
