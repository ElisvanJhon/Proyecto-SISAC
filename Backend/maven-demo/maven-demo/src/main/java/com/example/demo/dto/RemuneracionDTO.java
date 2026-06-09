package com.example.demo.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.ArrayList;

public class RemuneracionDTO {
    private Long id;
    private Long empleadoId;
    private String empleadoNombre;
    private String empleadoDni;
    private String empleadoPuesto;
    private Long planillaId;
    private BigDecimal sueldoBruto;
    private BigDecimal descuentos;
    private BigDecimal aportes;
    private BigDecimal sueldoNeto;
    private List<NovedadDTO> novedades = new ArrayList<>();
    
    // Inner class para las novedades
    public static class NovedadDTO {
        private String concepto;
        private String tipo; // INGRESO o DESCUENTO
        private BigDecimal monto;
        
        public NovedadDTO(String concepto, String tipo, BigDecimal monto) {
            this.concepto = concepto;
            this.tipo = tipo;
            this.monto = monto;
        }
        
        public String getConcepto() { return concepto; }
        public void setConcepto(String concepto) { this.concepto = concepto; }
        public String getTipo() { return tipo; }
        public void setTipo(String tipo) { this.tipo = tipo; }
        public BigDecimal getMonto() { return monto; }
        public void setMonto(BigDecimal monto) { this.monto = monto; }
    }

    // Constructors
    public RemuneracionDTO() {}

    public RemuneracionDTO(Long id, Long empleadoId, String empleadoNombre, String empleadoDni,
                          String empleadoPuesto, Long planillaId, BigDecimal sueldoBruto, 
                          BigDecimal descuentos, BigDecimal aportes, BigDecimal sueldoNeto) {
        this.id = id;
        this.empleadoId = empleadoId;
        this.empleadoNombre = empleadoNombre;
        this.empleadoDni = empleadoDni;
        this.empleadoPuesto = empleadoPuesto;
        this.planillaId = planillaId;
        this.sueldoBruto = sueldoBruto;
        this.descuentos = descuentos;
        this.aportes = aportes;
        this.sueldoNeto = sueldoNeto;
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

    public String getEmpleadoPuesto() {
        return empleadoPuesto;
    }

    public void setEmpleadoPuesto(String empleadoPuesto) {
        this.empleadoPuesto = empleadoPuesto;
    }

    public Long getPlanillaId() {
        return planillaId;
    }

    public void setPlanillaId(Long planillaId) {
        this.planillaId = planillaId;
    }

    public BigDecimal getSueldoBruto() {
        return sueldoBruto;
    }

    public void setSueldoBruto(BigDecimal sueldoBruto) {
        this.sueldoBruto = sueldoBruto;
    }

    public BigDecimal getDescuentos() {
        return descuentos;
    }

    public void setDescuentos(BigDecimal descuentos) {
        this.descuentos = descuentos;
    }

    public BigDecimal getAportes() {
        return aportes;
    }

    public void setAportes(BigDecimal aportes) {
        this.aportes = aportes;
    }

    public BigDecimal getSueldoNeto() {
        return sueldoNeto;
    }

    public void setSueldoNeto(BigDecimal sueldoNeto) {
        this.sueldoNeto = sueldoNeto;
    }
    
    public List<NovedadDTO> getNovedades() {
        return novedades;
    }
    
    public void setNovedades(List<NovedadDTO> novedades) {
        this.novedades = novedades;
    }
}
