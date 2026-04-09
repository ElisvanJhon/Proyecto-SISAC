package com.example.demo.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "asistencias")
public class Asistencias {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAsistencia;

    @ManyToOne
    @JoinColumn(name = "idEmpleado")
    private Empleados empleado;

    private LocalDate fecha;
    private BigDecimal horasTrabajadas;
    private BigDecimal horasExtra;
    private BigDecimal tardanza;
    private Boolean ausencia;

    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); }

    // Getters y Setters
    
    


    public Long getIdAsistencia() {
        return this.idAsistencia;
    }

    public void setIdAsistencia(Long idAsistencia) {
        this.idAsistencia = idAsistencia;
    }

    public Empleados getEmpleado() {
        return this.empleado;
    }

    public void setEmpleado(Empleados empleado) {
        this.empleado = empleado;
    }

    public LocalDate getFecha() {
        return this.fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public BigDecimal getHorasTrabajadas() {
        return this.horasTrabajadas;
    }

    public void setHorasTrabajadas(BigDecimal horasTrabajadas) {
        this.horasTrabajadas = horasTrabajadas;
    }

    public BigDecimal getHorasExtra() {
        return this.horasExtra;
    }

    public void setHorasExtra(BigDecimal horasExtra) {
        this.horasExtra = horasExtra;
    }

    public BigDecimal getTardanza() {
        return this.tardanza;
    }

    public void setTardanza(BigDecimal tardanza) {
        this.tardanza = tardanza;
    }

    public Boolean getAusencia() {
        return this.ausencia;
    }

    public void setAusencia(Boolean ausencia) {
        this.ausencia = ausencia;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

}