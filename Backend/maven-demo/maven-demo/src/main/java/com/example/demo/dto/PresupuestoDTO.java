package com.example.demo.dto;

import java.math.BigDecimal;

public class PresupuestoDTO {
    private Long id;
    private String periodo;
    private BigDecimal montoTotal;

    // Constructors
    public PresupuestoDTO() {}

    public PresupuestoDTO(Long id, String periodo, BigDecimal montoTotal) {
        this.id = id;
        this.periodo = periodo;
        this.montoTotal = montoTotal;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPeriodo() {
        return periodo;
    }

    public void setPeriodo(String periodo) {
        this.periodo = periodo;
    }

    public BigDecimal getMontoTotal() {
        return montoTotal;
    }

    public void setMontoTotal(BigDecimal montoTotal) {
        this.montoTotal = montoTotal;
    }
}
