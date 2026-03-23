package com.example.corporategms.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable()) // ✅ disable CSRF
            .cors(cors -> {}) // ✅ enable default CORS
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // ✅ VERY IMPORTANT
                    .requestMatchers("/api/auth/**").permitAll()
                    .requestMatchers("/api/grievances/**").permitAll()
                    .requestMatchers("/api/feedback/**").permitAll() // ✅ YOUR FIX
                    .requestMatchers("/api/admin/audit-logs").permitAll()
                    .anyRequest().authenticated()
            );

        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}