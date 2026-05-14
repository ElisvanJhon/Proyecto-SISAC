package com.example.demo.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class PagoDTO {
    private Long id;
    private LocalDate fechaPago;
    private BigDecimal monto;
    private String estado;

    // Constructors
    public PagoDTO() {}

    public PagoDTO(Long id, LocalDate fechaPago, BigDecimal monto, String estado) {
        this.id = id;
        this.fechaPago = fechaPago;
        this.monto = monto;
        this.estado = estado;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getFechaPago() {
        return fechaPago;
    }

    public void setFechaPago(LocalDate fechaPago) {
        this.fechaPago = fechaPago;
    }

    public BigDecimal getMonto() {
        return monto;
    }

    public void setMonto(BigDecimal monto) {
        this.monto = monto;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}
