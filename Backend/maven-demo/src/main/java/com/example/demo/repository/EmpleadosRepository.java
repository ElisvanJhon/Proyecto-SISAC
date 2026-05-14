package com.example.demo.repository;

import com.example.demo.entity.Empleados;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmpleadosRepository extends JpaRepository<Empleados, Long> {
    List<Empleados> findByEstado(String estado);
    Optional<Empleados> findByDni(String dni);
    List<Empleados> findByPuesto(String puesto);
}
