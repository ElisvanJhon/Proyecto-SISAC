package com.example.demo.convocatorias.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CandidatoDTO {

    private String id;
    private String nombresApellidos;
    private String email;
    private String telefono;

    @JsonProperty("cvAdjunto")
    private String cvAdjunto;

    public CandidatoDTO() {}

    public CandidatoDTO(String id, String nombresApellidos, String email, String telefono, String cvAdjunto) {
        this.id = id;
        this.nombresApellidos = nombresApellidos;
        this.email = email;
        this.telefono = telefono;
        this.cvAdjunto = cvAdjunto;
    }

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
