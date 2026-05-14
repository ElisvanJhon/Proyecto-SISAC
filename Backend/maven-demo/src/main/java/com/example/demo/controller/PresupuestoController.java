package com.example.demo.controller;

import com.example.demo.dto.PresupuestoDTO;
import com.example.demo.service.PresupuestoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/presupuestos")
@CrossOrigin(origins = "*")
public class PresupuestoController {

    @Autowired
    private PresupuestoService presupuestoService;

    @GetMapping
    public ResponseEntity<List<PresupuestoDTO>> listarTodos() {
        try {
            List<PresupuestoDTO> presupuestos = presupuestoService.listarTodos();
            return ResponseEntity.ok(presupuestos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<PresupuestoDTO> obtenerPorId(@PathVariable Long id) {
        try {
            PresupuestoDTO presupuesto = presupuestoService.obtenerPorId(id);
            return ResponseEntity.ok(presupuesto);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/periodo/{periodo}")
    public ResponseEntity<?> obtenerPorPeriodo(@PathVariable String periodo) {
        try {
            PresupuestoDTO presupuesto = presupuestoService.obtenerPorPeriodo(periodo);
            return ResponseEntity.ok(presupuesto);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody PresupuestoDTO presupuestoDTO) {
        try {
            PresupuestoDTO created = presupuestoService.crear(presupuestoDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al crear presupuesto"));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody PresupuestoDTO presupuestoDTO) {
        try {
            PresupuestoDTO updated = presupuestoService.actualizar(id, presupuestoDTO);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al actualizar presupuesto"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            presupuestoService.eliminar(id);
            return ResponseEntity.ok(Map.of("message", "Presupuesto eliminado correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al eliminar presupuesto"));
        }
    }
}
