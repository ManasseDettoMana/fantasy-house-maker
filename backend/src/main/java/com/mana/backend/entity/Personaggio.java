package com.mana.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "personaggi")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Personaggio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    private String ruolo; // es. "Re", "Guerriero", "Mago"

    private String descrizione;

    private Integer eta;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "casata_id")
    private Casata casata;
}