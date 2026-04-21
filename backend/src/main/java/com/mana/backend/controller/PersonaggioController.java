package com.mana.backend.controller;

import com.mana.backend.dto.*;
import com.mana.backend.service.PersonaggioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/personaggi")
@RequiredArgsConstructor
public class PersonaggioController {

    private final PersonaggioService personaggioService;

    @GetMapping
    public ResponseEntity<List<PersonaggioResponse>> getAll() {
        return ResponseEntity.ok(personaggioService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PersonaggioResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(personaggioService.getById(id));
    }

    @GetMapping("/casata/{casataId}")
    public ResponseEntity<List<PersonaggioResponse>> getByCasata(@PathVariable Long casataId) {
        return ResponseEntity.ok(personaggioService.getByCasata(casataId));
    }

    @GetMapping("/cerca")
    public ResponseEntity<List<PersonaggioResponse>> cerca(@RequestParam String nome) {
        return ResponseEntity.ok(personaggioService.cerca(nome));
    }

    @PostMapping
    public ResponseEntity<PersonaggioResponse> crea(@RequestBody PersonaggioRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(personaggioService.crea(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PersonaggioResponse> aggiorna(@PathVariable Long id,
                                                         @RequestBody PersonaggioRequest request) {
        return ResponseEntity.ok(personaggioService.aggiorna(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> elimina(@PathVariable Long id) {
        personaggioService.elimina(id);
        return ResponseEntity.noContent().build();
    }
}