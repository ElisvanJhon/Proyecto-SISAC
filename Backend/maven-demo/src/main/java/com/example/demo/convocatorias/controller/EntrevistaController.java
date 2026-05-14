package com.example.demo.convocatorias.controller;

import com.example.demo.convocatorias.dto.EntrevistaDTO;
import com.example.demo.convocatorias.service.EntrevistaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/entrevistas")
public class EntrevistaController {

    @Autowired
    private EntrevistaService service;

    @GetMapping
    public ResponseEntity<List<EntrevistaDTO>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @PostMapping
    public ResponseEntity<EntrevistaDTO> create(@RequestBody EntrevistaDTO dto) {
        return ResponseEntity.status(201).body(service.save(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EntrevistaDTO> update(@PathVariable String id, @RequestBody EntrevistaDTO dto) {
        if (!id.equals(dto.getId())) {
            throw new IllegalArgumentException("ID en URL debe coincidir con ID en el cuerpo");
        }
        return ResponseEntity.ok(service.save(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
