package com.mana.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.mana.backend.dto.CasataRequest;
import com.mana.backend.dto.CasataResponse;
import com.mana.backend.entity.Casata;
import com.mana.backend.repository.CasataRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CasataService {

    private final CasataRepository casataRepository;

    public List<CasataResponse> getAll() {
        return casataRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public CasataResponse getById(Long id) {
        return casataRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Casata non trovata"));
    }

    public CasataResponse crea(CasataRequest request) {
        if (casataRepository.existsByNome(request.getNome())) {
            throw new RuntimeException("Casata già esistente");
        }

        Casata casata = Casata.builder()
                .nome(request.getNome())
                .stemma(request.getStemma())
                .descrizione(request.getDescrizione())
                .motto(request.getMotto())
                .build();

        return toResponse(casataRepository.save(casata));
    }

    public CasataResponse aggiorna(Long id, CasataRequest request) {
        Casata casata = casataRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Casata non trovata"));

        casata.setNome(request.getNome());
        casata.setStemma(request.getStemma());
        casata.setDescrizione(request.getDescrizione());
        casata.setMotto(request.getMotto());

        return toResponse(casataRepository.save(casata));
    }

    public void elimina(Long id) {
        if (!casataRepository.existsById(id)) {
            throw new RuntimeException("Casata non trovata");
        }
        casataRepository.deleteById(id);
    }

    public List<CasataResponse> cerca(String nome) {
        return casataRepository.findByNomeContainingIgnoreCase(nome)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private CasataResponse toResponse(Casata casata) {
        return CasataResponse.builder()
                .id(casata.getId())
                .nome(casata.getNome())
                .stemma(casata.getStemma())
                .descrizione(casata.getDescrizione())
                .motto(casata.getMotto())
                .build();
    }
}