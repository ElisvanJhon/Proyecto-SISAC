package com.example.demo.convocatorias.controller;

import com.example.demo.convocatorias.dto.ConvocatoriaDTO;
import com.example.demo.convocatorias.service.ConvocatoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/convocatorias")
public class ConvocatoriaController {

    @Autowired
    private ConvocatoriaService service;

    @GetMapping
    public ResponseEntity<List<ConvocatoriaDTO>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @PostMapping
    public ResponseEntity<ConvocatoriaDTO> create(@RequestBody ConvocatoriaDTO dto) {
        return ResponseEntity.status(201).body(service.save(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ConvocatoriaDTO> update(@PathVariable String id, @RequestBody ConvocatoriaDTO dto) {
        if (!id.equals(dto.getId())) {
            throw new IllegalArgumentException("ID en URL y cuerpo no coinciden");
        }
        return ResponseEntity.ok(service.save(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
