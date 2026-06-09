package com.example.demo.convocatorias.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "candidato")
public class Candidato {

    @Id
    @Column(length = 50)
    private String id;

    @Column(name = "nombres_apellidos", nullable = false, length = 150)
    private String nombresApellidos;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(nullable = false, length = 20)
    private String telefono;

    @Column(name = "cv_adjunto", length = 500)
    private String cvAdjunto;

    // Constructores
    public Candidato() {}

    public Candidato(String id, String nombresApellidos, String email, String telefono, String cvAdjunto) {
        this.id = id;
        this.nombresApellidos = nombresApellidos;
        this.email = email;
        this.telefono = telefono;
        this.cvAdjunto = cvAdjunto;
    }

    // Getters & Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getNombresApellidos() { return nombresApellidos; }
    public void setNombresApellidos(String nombresApellidos) { this.nombresApellidos = nombresApellidos; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getCvAdjunto() { return cvAdjunto; }
    public void setCvAdjunto(String cvAdjunto) { this.cvAdjunto = cvAdjunto; }
}
