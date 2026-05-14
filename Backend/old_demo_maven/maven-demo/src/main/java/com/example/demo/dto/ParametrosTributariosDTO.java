package com.example.demo.dto;

import java.math.BigDecimal;

// Getters y Setters
public class ParametrosTributariosDTO {
    private BigDecimal tasaIgv;
    private String reglasRedondeo;
    private String formatoExportacion;

    public BigDecimal getTasaIgv() {
        return tasaIgv;
    }

    public void setTasaIgv(BigDecimal tasaIgv) {
        this.tasaIgv = tasaIgv;
    }

    public String getReglasRedondeo() {
        return reglasRedondeo;
    }

    public void setReglasRedondeo(String reglasRedondeo) {
        this.reglasRedondeo = reglasRedondeo;
    }

    public String getFormatoExportacion() {
        return formatoExportacion;
    }

    public void setFormatoExportacion(String formatoExportacion) {
        this.formatoExportacion = formatoExportacion;
    }
}