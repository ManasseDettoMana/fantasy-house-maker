package com.mana.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class CasataRequest {
    private String nome;
    private String stemma;
    private String descrizione;
    private String motto;
}