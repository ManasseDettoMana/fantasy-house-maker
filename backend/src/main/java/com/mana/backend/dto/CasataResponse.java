package com.mana.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class CasataResponse {
    private Long id;
    private String nome;
    private String stemma;
    private String descrizione;
    private String motto;
}