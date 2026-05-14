package com.example.demo.controller;

import com.example.demo.dto.AsistenciaDTO;
import com.example.demo.service.AsistenciasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/asistencias")
@CrossOrigin(origins = "*")
public class AsistenciasController {

    @Autowired
    private AsistenciasService asistenciasService;

    @GetMapping
    public ResponseEntity<List<AsistenciaDTO>> listarTodas(
            @RequestParam(required = false) String periodo,
            @RequestParam(required = false) Long empleadoId) {
        try {
            List<AsistenciaDTO> asistencias;
            
            if (empleadoId != null && periodo != null) {
                asistencias = asistenciasService.listarPorEmpleadoYPeriodo(empleadoId, periodo);
            } else if (empleadoId != null) {
                asistencias = asistenciasService.listarPorEmpleado(empleadoId);
            } else if (periodo != null) {
                asistencias = asistenciasService.listarPorPeriodo(periodo);
            } else {
                asistencias = asistenciasService.listarTodas();
            }
            
            return ResponseEntity.ok(asistencias);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/resumen")
    public ResponseEntity<?> obtenerResumen(
            @RequestParam Long empleadoId,
            @RequestParam String periodo) {
        try {
            Map<String, BigDecimal> resumen = asistenciasService.obtenerResumenPorEmpleadoYPeriodo(empleadoId, periodo);
            return ResponseEntity.ok(resumen);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> registrar(@RequestBody AsistenciaDTO asistenciaDTO) {
        try {
            AsistenciaDTO created = asistenciasService.registrar(asistenciaDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al registrar asistencia"));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody AsistenciaDTO asistenciaDTO) {
        try {
            AsistenciaDTO updated = asistenciasService.actualizar(id, asistenciaDTO);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al actualizar asistencia"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            asistenciasService.eliminar(id);
            return ResponseEntity.ok(Map.of("message", "Asistencia eliminada correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al eliminar asistencia"));
        }
    }
}
