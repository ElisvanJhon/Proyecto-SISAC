package com.example.demo.repository;

import com.example.demo.entity.Pagos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PagosRepository extends JpaRepository<Pagos, Long> {
    List<Pagos> findByEstado(String estado);
    List<Pagos> findByOrderByFechaPagoDesc();
}
