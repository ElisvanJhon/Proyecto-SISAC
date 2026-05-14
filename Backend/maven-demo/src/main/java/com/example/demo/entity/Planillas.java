package com.example.demo.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "planillas")
public class Planillas {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idPlanilla")
    private Long id;

    private String periodo;
    private String estado;
    
    @Column(name = "total_bruto")
    private BigDecimal totalBruto;
    
    @Column(name = "total_neto")
    private BigDecimal totalNeto;

    @ManyToOne
    @JoinColumn(name = "presupuesto_id")
    private PresupuestoPlanilla presupuestoPlanilla;

    @ManyToOne
    @JoinColumn(name = "pago_id")
    private Pagos pago;

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