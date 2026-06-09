package com.example.demo.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "boletas_pago")
public class BoletasPago {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "empleado_id")
    private Empleados empleado;

    @ManyToOne
    @JoinColumn(name = "pago_id")
    private Pagos pago;

    private String periodo;
    private BigDecimal sueldoNeto;
    private String formato;

    @Column(updatable = false)
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

    public Pagos getPago() {
        return this.pago;
    }

    public void setPago(Pagos pago) {
        this.pago = pago;
    }

    public String getPeriodo() {
        return this.periodo;
    }

    public void setPeriodo(String periodo) {
        this.periodo = periodo;
    }

    public BigDecimal getSueldoNeto() {
        return this.sueldoNeto;
    }

    public void setSueldoNeto(BigDecimal sueldoNeto) {
        this.sueldoNeto = sueldoNeto;
    }

    public String getFormato() {
        return this.formato;
    }

    public void setFormato(String formato) {
        this.formato = formato;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

}