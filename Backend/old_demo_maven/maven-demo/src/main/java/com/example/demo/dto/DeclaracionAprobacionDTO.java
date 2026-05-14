package com.example.demo.dto;

// Getters y Setters
public class DeclaracionAprobacionDTO {
    private Long declaracionId;
    private boolean aprobado;

    public Long getDeclaracionId() {
        return declaracionId;
    }

    public void setDeclaracionId(Long declaracionId) {
        this.declaracionId = declaracionId;
    }

    public boolean isAprobado() {
        return aprobado;
    }

    public void setAprobado(boolean aprobado) {
        this.aprobado = aprobado;
    }
}