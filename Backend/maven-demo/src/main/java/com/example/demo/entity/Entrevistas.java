package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "entrevistas")
public class Entrevistas {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEntrevista;

    @ManyToOne
    @JoinColumn(name = "idPostulante")
    private Postulantes postulante;

    private LocalDate fecha;
    private LocalTime hora;
    private String realiza;
    private String resultado;

    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); }

    // Getters y Setters


    public Long getIdEntrevista() {
        return this.idEntrevista;
    }

    public void setIdEntrevista(Long idEntrevista) {
        this.idEntrevista = idEntrevista;
    }

    public Postulantes getPostulante() {
        return this.postulante;
    }

    public void setPostulante(Postulantes postulante) {
        this.postulante = postulante;
    }

    public LocalDate getFecha() {
        return this.fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public LocalTime getHora() {
        return this.hora;
    }

    public void setHora(LocalTime hora) {
        this.hora = hora;
    }

    public String getRealiza() {
        return this.realiza;
    }

    public void setRealiza(String realiza) {
        this.realiza = realiza;
    }

    public String getResultado() {
        return this.resultado;
    }

    public void setResultado(String resultado) {
        this.resultado = resultado;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

}