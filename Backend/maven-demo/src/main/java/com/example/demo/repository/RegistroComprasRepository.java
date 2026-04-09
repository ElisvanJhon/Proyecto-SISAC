package com.example.demo.repository;

import com.example.demo.entity.RegistroCompras;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RegistroComprasRepository extends JpaRepository<RegistroCompras, Long> {
    boolean existsByProveedorIdAndNumeroFactura(
            @Param("proveedorId") Long proveedorId,
            @Param("numeroFactura") String numeroFactura
    );

    List<RegistroCompras> findByContribuyenteIdAndFechaEmisionBetween(
            @Param("contribuyenteId") Long contribuyenteId,
            @Param("inicio") LocalDate inicio,
            @Param("fin") LocalDate fin
    );
}