package com.example.demo.dto;

import java.math.BigDecimal;

public class EmpleadoDTO {
    private Long id;
    private String nombre;
    private String dni;
    private String puesto;
    private BigDecimal sueldoBase;
    private String estado;

    // Constructors
    public EmpleadoDTO() {}

    public EmpleadoDTO(Long id, String nombre, String dni, String puesto, BigDecimal sueldoBase, String estado) {
        this.id = id;
        this.nombre = nombre;
        this.dni = dni;
        this.puesto = puesto;
        this.sueldoBase = sueldoBase;
        this.estado = estado;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDni() {
        return dni;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }

    public String getPuesto() {
        return puesto;
    }

    public void setPuesto(String puesto) {
        this.puesto = puesto;
    }

    public BigDecimal getSueldoBase() {
        return sueldoBase;
    }

    public void setSueldoBase(BigDecimal sueldoBase) {
        this.sueldoBase = sueldoBase;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}
