package com.example.demo.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "remuneraciones")
public class Remuneraciones {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idRemuneracion")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "idEmpleado")
    private Empleados empleado;

    @ManyToOne
    @JoinColumn(name = "idPlanilla")
    private Planillas planilla;

    private BigDecimal sueldoBruto;
    private BigDecimal descuentos;
    private BigDecimal aportes;
    private BigDecimal sueldoNeto;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); }

    // Getters y Setters


    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Empleados getEmpleado() {
        return this.empleado;
    }

    public void setEmpleado(Empleados empleado) {
        this.empleado = empleado;
    }

    public Planillas getPlanilla() {
        return this.planilla;
    }

    public void setPlanilla(Planillas planilla) {
        this.planilla = planilla;
    }

    public BigDecimal getSueldoBruto() {
        return this.sueldoBruto;
    }

    public void setSueldoBruto(BigDecimal sueldoBruto) {
        this.sueldoBruto = sueldoBruto;
    }

    public BigDecimal getDescuentos() {
        return this.descuentos;
    }

    public void setDescuentos(BigDecimal descuentos) {
        this.descuentos = descuentos;
    }

    public BigDecimal getAportes() {
        return this.aportes;
    }

    public void setAportes(BigDecimal aportes) {
        this.aportes = aportes;
    }

    public BigDecimal getSueldoNeto() {
        return this.sueldoNeto;
    }

    public void setSueldoNeto(BigDecimal sueldoNeto) {
        this.sueldoNeto = sueldoNeto;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

}