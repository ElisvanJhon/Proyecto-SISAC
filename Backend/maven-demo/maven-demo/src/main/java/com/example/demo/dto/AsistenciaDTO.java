package com.example.demo.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class AsistenciaDTO {
    private Long id;
    private Long empleadoId;
    private String empleadoNombre;
    private LocalDate fecha;
    private BigDecimal horasTrabajadas;
    private BigDecimal horasExtra;
    private BigDecimal tardanza;
    private Boolean ausencia;

    // Constructors
    public AsistenciaDTO() {}

    public AsistenciaDTO(Long id, Long empleadoId, String empleadoNombre, LocalDate fecha, 
                        BigDecimal horasTrabajadas, BigDecimal horasExtra, BigDecimal tardanza, Boolean ausencia) {
        this.id = id;
        this.empleadoId = empleadoId;
        this.empleadoNombre = empleadoNombre;
        this.fecha = fecha;
        this.horasTrabajadas = horasTrabajadas;
        this.horasExtra = horasExtra;
        this.tardanza = tardanza;
        this.ausencia = ausencia;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getEmpleadoId() {
        return empleadoId;
    }

    public void setEmpleadoId(Long empleadoId) {
        this.empleadoId = empleadoId;
    }

    public String getEmpleadoNombre() {
        return empleadoNombre;
    }

    public void setEmpleadoNombre(String empleadoNombre) {
        this.empleadoNombre = empleadoNombre;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public BigDecimal getHorasTrabajadas() {
        return horasTrabajadas;
    }

    public void setHorasTrabajadas(BigDecimal horasTrabajadas) {
        this.horasTrabajadas = horasTrabajadas;
    }

    public BigDecimal getHorasExtra() {
        return horasExtra;
    }

    public void setHorasExtra(BigDecimal horasExtra) {
        this.horasExtra = horasExtra;
    }

    public BigDecimal getTardanza() {
        return tardanza;
    }

    public void setTardanza(BigDecimal tardanza) {
        this.tardanza = tardanza;
    }

    public Boolean getAusencia() {
        return ausencia;
    }

    public void setAusencia(Boolean ausencia) {
        this.ausencia = ausencia;
    }
}
