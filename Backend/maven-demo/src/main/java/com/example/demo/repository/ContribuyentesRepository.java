package com.example.demo.repository;

import com.example.demo.entity.Contribuyentes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ContribuyentesRepository extends JpaRepository<Contribuyentes, Long> {
    Optional<Contribuyentes> findByRuc(String ruc);
}