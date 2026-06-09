package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "auditoria")
public class Auditoria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String usuario;
    private String entidad;
    private String accion;
    
    @Column(name = "valores_antes", columnDefinition = "TEXT")
    private String valoresAntes;
    
    
    @Column(name = "valores_despues", columnDefinition = "TEXT")
    private String valoresDespues;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Auditoria() {}

    public Auditoria(String usuario, String entidad, String accion, String valoresAntes, String valoresDespues) {
        this.usuario = usuario;
        this.entidad = entidad;
        this.accion = accion;
        this.valoresAntes = valoresAntes;
        this.valoresDespues = valoresDespues;
    }
    
    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); }

    // Getters y Setters


    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsuario() {
        return this.usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public String getEntidad() {
        return this.entidad;
    }

    public void setEntidad(String entidad) {
        this.entidad = entidad;
    }

    public String getAccion() {
        return this.accion;
    }

    public void setAccion(String accion) {
        this.accion = accion;
    }

    public String getValoresAntes() {
        return this.valoresAntes;
    }

    public void setValoresAntes(String valoresAntes) {
        this.valoresAntes = valoresAntes;
    }

    public String getValoresDespues() {
        return this.valoresDespues;
    }

    public void setValoresDespues(String valoresDespues) {
        this.valoresDespues = valoresDespues;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

}