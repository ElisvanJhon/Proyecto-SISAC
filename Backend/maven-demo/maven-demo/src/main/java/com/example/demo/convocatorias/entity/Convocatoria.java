package com.example.demo.convocatorias.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "convocatoria")
public class Convocatoria {

    @Id
    @Column(length = 50)
    private String id;

    @Column(nullable = false, length = 200)
    private String titulo;

    @Column(name = "fecha_publicacion", nullable = false)
    private LocalDate fechaPublicacion;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    // Constructors
    public Convocatoria() {}

    public Convocatoria(String id, String titulo, LocalDate fechaPublicacion, String descripcion) {
        this.id = id;
        this.titulo = titulo;
        this.fechaPublicacion = fechaPublicacion;
        this.descripcion = descripcion;
    }

    // Getters & Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public LocalDate getFechaPublicacion() { return fechaPublicacion; }
    public void setFechaPublicacion(LocalDate fechaPublicacion) { this.fechaPublicacion = fechaPublicacion; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
}
