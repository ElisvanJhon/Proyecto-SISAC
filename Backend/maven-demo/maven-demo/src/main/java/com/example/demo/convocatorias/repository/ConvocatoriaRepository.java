package com.example.demo.convocatorias.repository;

import com.example.demo.convocatorias.entity.Convocatoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConvocatoriaRepository extends JpaRepository<Convocatoria, String> {
}
