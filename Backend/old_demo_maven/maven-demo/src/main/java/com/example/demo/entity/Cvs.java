package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "cvs")
public class Cvs {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCV;

    @ManyToOne
    @JoinColumn(name = "idPostulante")
    private Postulantes postulante;

    private LocalDate fechaRecepcion;
    private Boolean aceptado;

    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); }

    // Getters y Setters


    public Long getIdCV() {
        return this.idCV;
    }

    public void setIdCV(Long idCV) {
        this.idCV = idCV;
    }

    public Postulantes getPostulante() {
        return this.postulante;
    }

    public void setPostulante(Postulantes postulante) {
        this.postulante = postulante;
    }

    public LocalDate getFechaRecepcion() {
        return this.fechaRecepcion;
    }

    public void setFechaRecepcion(LocalDate fechaRecepcion) {
        this.fechaRecepcion = fechaRecepcion;
    }

    public Boolean getAceptado() {
        return this.aceptado;
    }

    public void setAceptado(Boolean aceptado) {
        this.aceptado = aceptado;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

}