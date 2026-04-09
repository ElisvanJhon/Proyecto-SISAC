package com.example.demo.repository;

import com.example.demo.entity.ParametrosTributarios;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface ParametrosTributariosRepository extends JpaRepository<ParametrosTributarios, Long> {
    Optional<ParametrosTributarios> findByContribuyenteIdAndVigenteHastaIsNull(Long contribuyenteId);
    
    Optional<ParametrosTributarios> findByContribuyenteIdAndVigenteDesdeBeforeAndVigenteHastaAfter(Long contribuyenteId, LocalDate fecha, LocalDate fecha2);
}