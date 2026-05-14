package com.example.demo.repository;

import com.example.demo.entity.Declaraciones;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param; // <-- Importar @Param
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DeclaracionesRepository extends JpaRepository<Declaraciones, Long> {
    Optional<Declaraciones> findByContribuyenteIdAndPeriodo(
            @Param("contribuyenteId") Long contribuyenteId,
            @Param("periodo") String periodo
    );
}