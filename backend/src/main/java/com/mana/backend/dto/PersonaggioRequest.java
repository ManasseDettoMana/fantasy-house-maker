package com.mana.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class PersonaggioRequest {
    private String nome;
    private String ruolo;
    private String descrizione;
    private Integer eta;
    private Long casataId;
}