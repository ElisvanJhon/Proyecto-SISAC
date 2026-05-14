package com.example.demo.convocatorias.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;

public class PostulacionDTO {

    private String id;

    @JsonProperty("convocatoriaId")
    private String convocatoriaId;

    @JsonProperty("candidatoId")
    private String candidatoId;

    @JsonProperty("fechaEvaluacion")
    private LocalDate fechaEvaluacion;

    private String estado;
    private String observaciones;

    public PostulacionDTO() {}

    public PostulacionDTO(String id, String convocatoriaId, String candidatoId,
                          LocalDate fechaEvaluacion, String estado, String observaciones) {
        this.id = id;
        this.convocatoriaId = convocatoriaId;
        this.candidatoId = candidatoId;
        this.fechaEvaluacion = fechaEvaluacion;
        this.estado = estado;
        this.observaciones = observaciones;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getConvocatoriaId() { return convocatoriaId; }
    public void setConvocatoriaId(String convocatoriaId) { this.convocatoriaId = convocatoriaId; }

    public String getCandidatoId() { return candidatoId; }
    public void setCandidatoId(String candidatoId) { this.candidatoId = candidatoId; }

    public LocalDate getFechaEvaluacion() { return fechaEvaluacion; }
    public void setFechaEvaluacion(LocalDate fechaEvaluacion) { this.fechaEvaluacion = fechaEvaluacion; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
}
