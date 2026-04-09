package com.example.demo.repository;

import com.example.demo.entity.CatalogoProductos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CatalogoProductosRepository extends JpaRepository<CatalogoProductos, Long> {
    long countByContribuyenteId(Long contribuyenteId);
}