package com.example.demo.controller;

import com.example.demo.dto.BoletaPagoDTO;
import com.example.demo.service.BoletasPagoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/boletas")
@CrossOrigin(origins = "*")
public class BoletasPagoController {

    @Autowired
    private BoletasPagoService boletasService;

    @GetMapping
    public ResponseEntity<List<BoletaPagoDTO>> listarTodas(
            @RequestParam(required = false) Long pagoId,
            @RequestParam(required = false) Long empleadoId) {
        try {
            List<BoletaPagoDTO> boletas;
            
            if (pagoId != null) {
                boletas = boletasService.listarPorPago(pagoId);
            } else if (empleadoId != null) {
                boletas = boletasService.listarPorEmpleado(empleadoId);
            } else {
                boletas = boletasService.listarTodas();
            }
            
            return ResponseEntity.ok(boletas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<BoletaPagoDTO> obtenerPorId(@PathVariable Long id) {
        try {
            BoletaPagoDTO boleta = boletasService.obtenerPorId(id);
            return ResponseEntity.ok(boleta);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/generar/{planillaId}")
    public ResponseEntity<?> generarBoletasPorPlanilla(@PathVariable Long planillaId) {
        try {
            List<BoletaPagoDTO> boletas = boletasService.generarBoletasPorPlanilla(planillaId);
            return ResponseEntity.status(HttpStatus.CREATED).body(boletas);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al generar boletas"));
        }
    }

    @PostMapping
    public ResponseEntity<?> crearManual(@RequestBody BoletaPagoDTO boletaDTO) {
        try {
            BoletaPagoDTO created = boletasService.crearManual(boletaDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al crear boleta"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            boletasService.eliminar(id);
            return ResponseEntity.ok(Map.of("message", "Boleta eliminada correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al eliminar boleta"));
        }
    }
}
