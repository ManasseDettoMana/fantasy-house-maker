package com.mana.backend.security;

import java.util.List;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.mana.backend.repository.UtenteRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UtenteRepository utenteRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return utenteRepository.findByUsername(username)
                .map(utente -> new User(
                        utente.getUsername(),
                        utente.getPassword(),
                        List.of(new SimpleGrantedAuthority("ROLE_" + utente.getRuolo()))
                ))
                .orElseThrow(() -> new UsernameNotFoundException("Utente non trovato: " + username));
    }
}