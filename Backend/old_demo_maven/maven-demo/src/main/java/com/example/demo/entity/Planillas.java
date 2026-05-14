package com.example.demo.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "planillas")
public class Planillas {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPlanilla;

    private String periodo;
    private String estado;
    private BigDecimal totalBruto;
    private BigDecimal totalNeto;

    @ManyToOne
    @JoinColumn(name = "idPresupuesto")
    private PresupuestoPlanilla presupuestoPlanilla;

    @ManyToOne
    @JoinColumn(name = "idPago")
    private Pagos pago;

    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); }

    // Getters y Setters


    public Long getIdPlanilla() {
        return this.idPlanilla;
    }

    public void setIdPlanilla(Long idPlanilla) {
        this.idPlanilla = idPlanilla;
    }

    public String getPeriodo() {
        return this.periodo;
    }

    public void setPeriodo(String periodo) {
        this.periodo = periodo;
    }

    public String getEstado() {
        return this.estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public BigDecimal getTotalBruto() {
        return this.totalBruto;
    }

    public void setTotalBruto(BigDecimal totalBruto) {
        this.totalBruto = totalBruto;
    }

    public BigDecimal getTotalNeto() {
        return this.totalNeto;
    }

    public void setTotalNeto(BigDecimal totalNeto) {
        this.totalNeto = totalNeto;
    }

    public PresupuestoPlanilla getPresupuestoPlanilla() {
        return this.presupuestoPlanilla;
    }

    public void setPresupuestoPlanilla(PresupuestoPlanilla presupuestoPlanilla) {
        this.presupuestoPlanilla = presupuestoPlanilla;
    }

    public Pagos getPago() {
        return this.pago;
    }

    public void setPago(Pagos pago) {
        this.pago = pago;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

}