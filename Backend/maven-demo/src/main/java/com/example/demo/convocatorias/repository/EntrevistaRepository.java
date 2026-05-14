package com.example.demo.convocatorias.repository;

import com.example.demo.convocatorias.entity.Entrevista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EntrevistaRepository extends JpaRepository<Entrevista, String> {
}
