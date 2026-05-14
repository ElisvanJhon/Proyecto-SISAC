package com.example.demo.convocatorias.repository;

import com.example.demo.convocatorias.entity.Postulacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostulacionRepository extends JpaRepository<Postulacion, String> {
}
