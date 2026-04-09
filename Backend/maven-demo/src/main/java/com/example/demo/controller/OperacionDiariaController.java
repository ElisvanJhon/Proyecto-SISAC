package com.example.demo.controller;

import com.example.demo.dto.CompraRequestDTO;
import com.example.demo.dto.VentaRequestDTO;
import com.example.demo.service.OperacionDiariaService;
import com.example.demo.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/tax/daily")
public class OperacionDiariaController {

    @Autowired
    private OperacionDiariaService operacionDiariaService;

    @Autowired
    private JwtUtil jwtUtil;

    // Proceso 2 - Emisión de CPE (Venta)
    @PostMapping("/venta")
    public ResponseEntity<?> registrarVenta(@RequestBody VentaRequestDTO ventaRequest,
                                            @RequestHeader("Authorization") String token) {
        try {
            Long contribuyenteId = 1L; // Simulado
            String usuario = jwtUtil.extractUsername(token.substring(7));
            
            Map<String, String> resultado = operacionDiariaService.registrarVenta(contribuyenteId, ventaRequest, usuario);
            return ResponseEntity.ok(resultado);
        } catch (OperacionDiariaService.ValidacionException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage(), "file", e.getArchivoError()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", e.getMessage()));
        }
    }

    // Proceso 2 - Registro de Compras
    @PostMapping("/compra")
    public ResponseEntity<?> registrarCompra(
            @RequestParam("proveedorRuc") String proveedorRuc,
            @RequestParam("numeroFactura") String numeroFactura,
            @RequestParam("montoTotal") double montoTotal,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestHeader("Authorization") String token) {
        
        try {
            Long contribuyenteId = 1L; // Simulado
            String usuario = jwtUtil.extractUsername(token.substring(7));

            CompraRequestDTO compraRequest = new CompraRequestDTO();
            compraRequest.setProveedorRuc(proveedorRuc);
            compraRequest.setNumeroFactura(numeroFactura);
            compraRequest.setMontoTotal(montoTotal);
            
            Map<String, String> resultado = operacionDiariaService.registrarCompra(contribuyenteId, compraRequest, file, usuario);
            return ResponseEntity.ok(resultado);
        } catch (OperacionDiariaService.ValidacionException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage(), "file", e.getArchivoError()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", e.getMessage()));
        }
    }
}