package com.example.demo.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "presupuesto_planilla")
public class PresupuestoPlanilla {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPresupuesto;

    private String periodo;
    private BigDecimal montoTotal;

    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); }

    // Getters y Setters


    public Long getIdPresupuesto() {
        return this.idPresupuesto;
    }

    public void setIdPresupuesto(Long idPresupuesto) {
        this.idPresupuesto = idPresupuesto;
    }

    public String getPeriodo() {
        return this.periodo;
    }

    public void setPeriodo(String periodo) {
        this.periodo = periodo;
    }

    public BigDecimal getMontoTotal() {
        return this.montoTotal;
    }

    public void setMontoTotal(BigDecimal montoTotal) {
        this.montoTotal = montoTotal;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

}