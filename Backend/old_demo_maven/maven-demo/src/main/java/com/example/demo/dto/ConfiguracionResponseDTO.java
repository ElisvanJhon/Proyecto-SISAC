package com.example.demo.dto;

import com.example.demo.entity.CatalogoProductos;
import com.example.demo.entity.Contribuyentes;
import com.example.demo.entity.ParametrosTributarios;

import java.util.List;

// Getters y Setters
public class ConfiguracionResponseDTO {
    private Contribuyentes contribuyente;
    private ParametrosTributarios parametros;
    private long cantidadProductos;

    public Contribuyentes getContribuyente() {
        return contribuyente;
    }

    public void setContribuyente(Contribuyentes contribuyente) {
        this.contribuyente = contribuyente;
    }

    public ParametrosTributarios getParametros() {
        return parametros;
    }

    public void setParametros(ParametrosTributarios parametros) {
        this.parametros = parametros;
    }

    public long getCantidadProductos() {
        return cantidadProductos;
    }

    public void setCantidadProductos(long cantidadProductos) {
        this.cantidadProductos = cantidadProductos;
    }
}