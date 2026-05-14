package com.example.demo.dto;

import java.math.BigDecimal;
import java.util.List;

public class PlanillaDTO {
    private Long id;
    private String periodo;
    private String estado;
    private BigDecimal totalBruto;
    private BigDecimal totalNeto;
    private Long presupuestoId;
    private Long pagoId;
    private List<RemuneracionDTO> remuneraciones;

    // Constructors
    public PlanillaDTO() {}

    public PlanillaDTO(Long id, String periodo, String estado, BigDecimal totalBruto, 
                      BigDecimal totalNeto, Long presupuestoId, Long pagoId) {
        this.id = id;
        this.periodo = periodo;
        this.estado = estado;
        this.totalBruto = totalBruto;
        this.totalNeto = totalNeto;
        this.presupuestoId = presupuestoId;
        this.pagoId = pagoId;
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

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public BigDecimal getTotalBruto() {
        return totalBruto;
    }

    public void setTotalBruto(BigDecimal totalBruto) {
        this.totalBruto = totalBruto;
    }

    public BigDecimal getTotalNeto() {
        return totalNeto;
    }

    public void setTotalNeto(BigDecimal totalNeto) {
        this.totalNeto = totalNeto;
    }

    public Long getPresupuestoId() {
        return presupuestoId;
    }

    public void setPresupuestoId(Long presupuestoId) {
        this.presupuestoId = presupuestoId;
    }

    public Long getPagoId() {
        return pagoId;
    }

    public void setPagoId(Long pagoId) {
        this.pagoId = pagoId;
    }

    public List<RemuneracionDTO> getRemuneraciones() {
        return remuneraciones;
    }

    public void setRemuneraciones(List<RemuneracionDTO> remuneraciones) {
        this.remuneraciones = remuneraciones;
    }
}
