package com.mana.backend.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.mana.backend.dto.AuthResponse;
import com.mana.backend.dto.LoginRequest;
import com.mana.backend.entity.Utente;
import com.mana.backend.repository.UtenteRepository;
import com.mana.backend.security.JwtUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UtenteRepository utenteRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getUsername(),
                request.getPassword()
            )
        );

        Utente utente = utenteRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Utente non trovato"));

        String token = jwtUtil.generateToken(utente.getUsername());

        return AuthResponse.builder()
                .token(token)
                .username(utente.getUsername())
                .ruolo(utente.getRuolo())
                .build();
    }

    public AuthResponse registra(LoginRequest request) {
        if (utenteRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username già in uso");
        }

        Utente utente = Utente.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .ruolo("ADMIN")
                .build();

        utenteRepository.save(utente);

        String token = jwtUtil.generateToken(utente.getUsername());

        return AuthResponse.builder()
                .token(token)
                .username(utente.getUsername())
                .ruolo(utente.getRuolo())
                .build();
    }
}