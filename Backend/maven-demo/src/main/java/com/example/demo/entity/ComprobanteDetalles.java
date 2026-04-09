package com.example.demo.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "comprobante_detalles")
public class ComprobanteDetalles {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "comprobante_id")
    private Comprobantes comprobante;

    @ManyToOne
    @JoinColumn(name = "producto_id")
    private CatalogoProductos producto;

    private BigDecimal cantidad;
    private BigDecimal precioUnitario;
    private String afectacionIgv;
    private BigDecimal subtotal;
    private BigDecimal igv;
    private BigDecimal total;

    // Getters y Setters


    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Comprobantes getComprobante() {
        return this.comprobante;
    }

    public void setComprobante(Comprobantes comprobante) {
        this.comprobante = comprobante;
    }

    public CatalogoProductos getProducto() {
        return this.producto;
    }

    public void setProducto(CatalogoProductos producto) {
        this.producto = producto;
    }

    public BigDecimal getCantidad() {
        return this.cantidad;
    }

    public void setCantidad(BigDecimal cantidad) {
        this.cantidad = cantidad;
    }

    public BigDecimal getPrecioUnitario() {
        return this.precioUnitario;
    }

    public void setPrecioUnitario(BigDecimal precioUnitario) {
        this.precioUnitario = precioUnitario;
    }

    public String getAfectacionIgv() {
        return this.afectacionIgv;
    }

    public void setAfectacionIgv(String afectacionIgv) {
        this.afectacionIgv = afectacionIgv;
    }

    public BigDecimal getSubtotal() {
        return this.subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    public BigDecimal getIgv() {
        return this.igv;
    }

    public void setIgv(BigDecimal igv) {
        this.igv = igv;
    }

    public BigDecimal getTotal() {
        return this.total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

}