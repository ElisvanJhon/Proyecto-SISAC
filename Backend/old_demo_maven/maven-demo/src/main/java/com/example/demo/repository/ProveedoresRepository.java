package com.example.demo.repository;

import com.example.demo.entity.Proveedores;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProveedoresRepository extends JpaRepository<Proveedores, Long> {
    Optional<Proveedores> findByRuc(String ruc);
}