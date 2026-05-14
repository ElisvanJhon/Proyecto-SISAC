package com.example.demo.dto;

// Getters y Setters
public class CierreRequestDTO {
    private String periodo; // Formato "YYYYMM"

    public String getPeriodo() {
        return periodo;
    }

    public void setPeriodo(String periodo) {
        this.periodo = periodo;
    }
}