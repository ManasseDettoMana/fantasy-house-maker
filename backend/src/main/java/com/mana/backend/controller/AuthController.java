package com.mana.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mana.backend.dto.AuthResponse;
import com.mana.backend.dto.LoginRequest;
import com.mana.backend.service.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/registra")
    public ResponseEntity<AuthResponse> registra(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.registra(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        // Con JWT il logout è gestito lato client eliminando il token
        return ResponseEntity.noContent().build();
    }
}