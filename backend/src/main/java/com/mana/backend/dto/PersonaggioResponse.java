package com.mana.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class PersonaggioResponse {
    private Long id;
    private String nome;
    private String ruolo;
    private String descrizione;
    private Integer eta;
    private Long casataId;
    private String casataNome;
}