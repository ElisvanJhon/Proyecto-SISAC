package com.example.demo.dto;

import java.math.BigDecimal;

public class BoletaPagoDTO {
    private Long id;
    private Long empleadoId;
    private String empleadoNombre;
    private String empleadoDni;
    private Long pagoId;
    private String periodo;
    private BigDecimal sueldoNeto;
    private String formato;
    private RemuneracionDTO detalleRemuneracion;

    // Constructors
    public BoletaPagoDTO() {}

    public BoletaPagoDTO(Long id, Long empleadoId, String empleadoNombre, String empleadoDni,
                        Long pagoId, String periodo, BigDecimal sueldoNeto, String formato) {
        this.id = id;
        this.empleadoId = empleadoId;
        this.empleadoNombre = empleadoNombre;
        this.empleadoDni = empleadoDni;
        this.pagoId = pagoId;
        this.periodo = periodo;
        this.sueldoNeto = sueldoNeto;
        this.formato = formato;
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

    public String getEmpleadoDni() {
        return empleadoDni;
    }

    public void setEmpleadoDni(String empleadoDni) {
        this.empleadoDni = empleadoDni;
    }

    public Long getPagoId() {
        return pagoId;
    }

    public void setPagoId(Long pagoId) {
        this.pagoId = pagoId;
    }

    public String getPeriodo() {
        return periodo;
    }

    public void setPeriodo(String periodo) {
        this.periodo = periodo;
    }

    public BigDecimal getSueldoNeto() {
        return sueldoNeto;
    }

    public void setSueldoNeto(BigDecimal sueldoNeto) {
        this.sueldoNeto = sueldoNeto;
    }

    public String getFormato() {
        return formato;
    }

    public void setFormato(String formato) {
        this.formato = formato;
    }

    public RemuneracionDTO getDetalleRemuneracion() {
        return detalleRemuneracion;
    }

    public void setDetalleRemuneracion(RemuneracionDTO detalleRemuneracion) {
        this.detalleRemuneracion = detalleRemuneracion;
    }
}
