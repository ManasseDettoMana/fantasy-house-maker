package com.mana.backend.controller;

import com.mana.backend.dto.*;
import com.mana.backend.service.CasataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/casate")
@RequiredArgsConstructor
public class CasataController {

    private final CasataService casataService;

    @GetMapping
    public ResponseEntity<List<CasataResponse>> getAll() {
        return ResponseEntity.ok(casataService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CasataResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(casataService.getById(id));
    }

    @GetMapping("/cerca")
    public ResponseEntity<List<CasataResponse>> cerca(@RequestParam String nome) {
        return ResponseEntity.ok(casataService.cerca(nome));
    }

    @PostMapping
    public ResponseEntity<CasataResponse> crea(@RequestBody CasataRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(casataService.crea(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CasataResponse> aggiorna(@PathVariable Long id,
                                                    @RequestBody CasataRequest request) {
        return ResponseEntity.ok(casataService.aggiorna(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> elimina(@PathVariable Long id) {
        casataService.elimina(id);
        return ResponseEntity.noContent().build();
    }
}