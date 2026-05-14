package com.example.demo.convocatorias.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "entrevistas")
public class Entrevista {

    @Id
    @Column(length = 50)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "convocatoria_id", nullable = false)
    private Convocatoria convocatoria;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidato_id", nullable = false)
    private Candidato candidato;

    @Column(name = "nombre_evaluador", nullable = false, length = 100)
    private String nombreEvaluador;

    @Column(nullable = false, length = 200)
    private String resultado;

    @Column(name = "fecha_evaluacion", nullable = false)
    private LocalDate fechaEvaluacion;

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    // Constructores
    public Entrevista() {}

    public Entrevista(String id, Convocatoria convocatoria, Candidato candidato,
                      String nombreEvaluador, String resultado, LocalDate fechaEvaluacion,
                      String observaciones) {
        this.id = id;
        this.convocatoria = convocatoria;
        this.candidato = candidato;
        this.nombreEvaluador = nombreEvaluador;
        this.resultado = resultado;
        this.fechaEvaluacion = fechaEvaluacion;
        this.observaciones = observaciones;
    }

    // Getters & Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Convocatoria getConvocatoria() { return convocatoria; }
    public void setConvocatoria(Convocatoria convocatoria) { this.convocatoria = convocatoria; }

    public Candidato getCandidato() { return candidato; }
    public void setCandidato(Candidato candidato) { this.candidato = candidato; }

    public String getNombreEvaluador() { return nombreEvaluador; }
    public void setNombreEvaluador(String nombreEvaluador) { this.nombreEvaluador = nombreEvaluador; }

    public String getResultado() { return resultado; }
    public void setResultado(String resultado) { this.resultado = resultado; }

    public LocalDate getFechaEvaluacion() { return fechaEvaluacion; }
    public void setFechaEvaluacion(LocalDate fechaEvaluacion) { this.fechaEvaluacion = fechaEvaluacion; }

    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
}
