package com.example.demo.convocatorias.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;

public class EntrevistaDTO {

    private String id;

    @JsonProperty("convocatoriaId")
    private String convocatoriaId;

    @JsonProperty("candidatoId")
    private String candidatoId;

    @JsonProperty("nombreEvaluador")
    private String nombreEvaluador;

    @JsonProperty("resultado")
    private String resultado;

    @JsonProperty("fechaEvaluacion")
    private LocalDate fechaEvaluacion;

    private String observaciones;

    public EntrevistaDTO() {}

    public EntrevistaDTO(String id, String convocatoriaId, String candidatoId,
                         String nombreEvaluador, String resultado, LocalDate fechaEvaluacion,
                         String observaciones) {
        this.id = id;
        this.convocatoriaId = convocatoriaId;
        this.candidatoId = candidatoId;
        this.nombreEvaluador = nombreEvaluador;
        this.resultado = resultado;
        this.fechaEvaluacion = fechaEvaluacion;
        this.observaciones = observaciones;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getConvocatoriaId() { return convocatoriaId; }
    public void setConvocatoriaId(String convocatoriaId) { this.convocatoriaId = convocatoriaId; }

    public String getCandidatoId() { return candidatoId; }
    public void setCandidatoId(String candidatoId) { this.candidatoId = candidatoId; }

    public String getNombreEvaluador() { return nombreEvaluador; }
    public void setNombreEvaluador(String nombreEvaluador) { this.nombreEvaluador = nombreEvaluador; }

    public String getResultado() { return resultado; }
    public void setResultado(String resultado) { this.resultado = resultado; }

    public LocalDate getFechaEvaluacion() { return fechaEvaluacion; }
    public void setFechaEvaluacion(LocalDate fechaEvaluacion) { this.fechaEvaluacion = fechaEvaluacion; }

    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
}
