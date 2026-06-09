package com.example.demo.repository;

import com.example.demo.entity.Comprobantes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ComprobantesRepository extends JpaRepository<Comprobantes, Long> {
}