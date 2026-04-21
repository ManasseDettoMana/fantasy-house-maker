package com.mana.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.mana.backend.dto.PersonaggioRequest;
import com.mana.backend.dto.PersonaggioResponse;
import com.mana.backend.entity.Casata;
import com.mana.backend.entity.Personaggio;
import com.mana.backend.repository.CasataRepository;
import com.mana.backend.repository.PersonaggioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PersonaggioService {

    private final PersonaggioRepository personaggioRepository;
    private final CasataRepository casataRepository;

    public List<PersonaggioResponse> getAll() {
        return personaggioRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public PersonaggioResponse getById(Long id) {
        return personaggioRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Personaggio non trovato"));
    }

    public List<PersonaggioResponse> getByCasata(Long casataId) {
        return personaggioRepository.findByCasataId(casataId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public PersonaggioResponse crea(PersonaggioRequest request) {
        Casata casata = casataRepository.findById(request.getCasataId())
                .orElseThrow(() -> new RuntimeException("Casata non trovata"));

        Personaggio personaggio = Personaggio.builder()
                .nome(request.getNome())
                .ruolo(request.getRuolo())
                .descrizione(request.getDescrizione())
                .eta(request.getEta())
                .casata(casata)
                .build();

        return toResponse(personaggioRepository.save(personaggio));
    }

    public PersonaggioResponse aggiorna(Long id, PersonaggioRequest request) {
        Personaggio personaggio = personaggioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Personaggio non trovato"));

        Casata casata = casataRepository.findById(request.getCasataId())
                .orElseThrow(() -> new RuntimeException("Casata non trovata"));

        personaggio.setNome(request.getNome());
        personaggio.setRuolo(request.getRuolo());
        personaggio.setDescrizione(request.getDescrizione());
        personaggio.setEta(request.getEta());
        personaggio.setCasata(casata);

        return toResponse(personaggioRepository.save(personaggio));
    }

    public void elimina(Long id) {
        if (!personaggioRepository.existsById(id)) {
            throw new RuntimeException("Personaggio non trovato");
        }
        personaggioRepository.deleteById(id);
    }

    public List<PersonaggioResponse> cerca(String nome) {
        return personaggioRepository.findByNomeContainingIgnoreCase(nome)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private PersonaggioResponse toResponse(Personaggio p) {
        return PersonaggioResponse.builder()
                .id(p.getId())
                .nome(p.getNome())
                .ruolo(p.getRuolo())
                .descrizione(p.getDescrizione())
                .eta(p.getEta())
                .casataId(p.getCasata() != null ? p.getCasata().getId() : null)
                .casataNome(p.getCasata() != null ? p.getCasata().getNome() : null)
                .build();
    }
}