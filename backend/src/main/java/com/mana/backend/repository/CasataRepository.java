package com.mana.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mana.backend.entity.Casata;

@Repository
public interface CasataRepository extends JpaRepository<Casata, Long> {

    List<Casata> findByNomeContainingIgnoreCase(String nome);

    boolean existsByNome(String nome);
}