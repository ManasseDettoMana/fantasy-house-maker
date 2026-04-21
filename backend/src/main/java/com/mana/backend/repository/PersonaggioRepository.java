package com.mana.backend.repository;

import com.mana.backend.entity.Personaggio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PersonaggioRepository extends JpaRepository<Personaggio, Long> {

    List<Personaggio> findByCasataId(Long casataId);

    List<Personaggio> findByNomeContainingIgnoreCase(String nome);
}