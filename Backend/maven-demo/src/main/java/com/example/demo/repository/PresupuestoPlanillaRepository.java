package com.example.demo.repository;

import com.example.demo.entity.PresupuestoPlanilla;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PresupuestoPlanillaRepository extends JpaRepository<PresupuestoPlanilla, Long> {
    Optional<PresupuestoPlanilla> findByPeriodo(String periodo);
}
