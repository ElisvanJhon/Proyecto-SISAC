package com.example.demo.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "parametros_tributarios")
public class ParametrosTributarios {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "contribuyente_id")
    private Contribuyentes contribuyente;

    private Integer version;
    
    @Column(name = "tasa_igv")
    private BigDecimal tasaIgv;
    
    @Column(name = "reglas_redondeo")
    private String reglasRedondeo;
    
    @Column(name = "formato_exportacion")
    private String formatoExportacion;
    
    @Column(name = "vigente_desde")
    private LocalDate vigenteDesde;
    
    @Column(name = "vigente_hasta")
    private LocalDate vigenteHasta;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); }

    // Getters y Setters


    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Contribuyentes getContribuyente() {
        return this.contribuyente;
    }

    public void setContribuyente(Contribuyentes contribuyente) {
        this.contribuyente = contribuyente;
    }

    public Integer getVersion() {
        return this.version;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }

    public BigDecimal getTasaIgv() {
        return this.tasaIgv;
    }

    public void setTasaIgv(BigDecimal tasaIgv) {
        this.tasaIgv = tasaIgv;
    }

    public String getReglasRedondeo() {
        return this.reglasRedondeo;
    }

    public void setReglasRedondeo(String reglasRedondeo) {
        this.reglasRedondeo = reglasRedondeo;
    }

    public String getFormatoExportacion() {
        return this.formatoExportacion;
    }

    public void setFormatoExportacion(String formatoExportacion) {
        this.formatoExportacion = formatoExportacion;
    }

    public LocalDate getVigenteDesde() {
        return this.vigenteDesde;
    }

    public void setVigenteDesde(LocalDate vigenteDesde) {
        this.vigenteDesde = vigenteDesde;
    }

    public LocalDate getVigenteHasta() {
        return this.vigenteHasta;
    }

    public void setVigenteHasta(LocalDate vigenteHasta) {
        this.vigenteHasta = vigenteHasta;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

}