package com.example.softwarepos.config;

import com.example.softwarepos.service.UserDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig implements WebMvcConfigurer {

    private final UserDetailService userService;

    // ✅ Security 필터 체인 설정
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/user/**",
                                "/**" // 개발을 완료 혹은 프론트 개발이 종료될 때까지는 전체 권한 주기
                        ).permitAll()
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.disable()) // 세션 비활성화
                .formLogin(AbstractHttpConfigurer::disable) // formLogin 완전 제거
                .httpBasic(AbstractHttpConfigurer::disable)
                .cors()  // CORS 필터 추가
                .and()
                .build();
    }

    // ✅ AuthenticationManager 설정
    @Bean
    public AuthenticationManager authenticationManager(
            HttpSecurity http,
            BCryptPasswordEncoder bCryptPasswordEncoder
    ) throws Exception {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userService);
        authProvider.setPasswordEncoder(bCryptPasswordEncoder);
        return new ProviderManager(List.of(authProvider));
    }

    // ✅ 비밀번호 인코더 빈 등록
    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // ✅ CORS 설정
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")  // 모든 경로에 대해 CORS 허용
                .allowedOrigins("http://localhost:63342")  // 클라이언트 주소 (CORS 허용할 도메인)
                .allowedMethods("GET", "POST", "PUT", "DELETE")  // 허용할 HTTP 메소드들
                .allowedHeaders("*")  // 모든 헤더 허용
                .allowCredentials(true);  // 쿠키를 포함한 요청 허용
    }
}
