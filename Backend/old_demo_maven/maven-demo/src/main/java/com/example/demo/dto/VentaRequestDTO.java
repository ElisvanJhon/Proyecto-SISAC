package com.example.demo.dto;

import java.util.List;

// Getters y Setters
public class VentaRequestDTO {
    private String clienteRucDni;
    private List<ItemVentaDTO> items;

    public String getClienteRucDni() {
        return clienteRucDni;
    }

    public void setClienteRucDni(String clienteRucDni) {
        this.clienteRucDni = clienteRucDni;
    }

    public List<ItemVentaDTO> getItems() {
        return items;
    }

    public void setItems(List<ItemVentaDTO> items) {
        this.items = items;
    }

    // Clase anidada para los ítems
    public static class ItemVentaDTO {
        private Long productoId;
        private int cantidad;

        public Long getProductoId() {
            return productoId;
        }

        public void setProductoId(Long productoId) {
            this.productoId = productoId;
        }

        public int getCantidad() {
            return cantidad;
        }

        public void setCantidad(int cantidad) {
            this.cantidad = cantidad;
        }
    }
}