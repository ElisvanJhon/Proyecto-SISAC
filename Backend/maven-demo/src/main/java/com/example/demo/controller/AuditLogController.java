package com.example.demo.controller;

import com.example.demo.entity.Auditoria;
import com.example.demo.service.AuditoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit")
public class AuditLogController {

    @Autowired
    private AuditoriaService auditoriaService;

    @GetMapping
    public ResponseEntity<List<Auditoria>> listarAuditoria() {
        return ResponseEntity.ok(auditoriaService.findAll());
    }

    @GetMapping("/user/{usuario}")
    public ResponseEntity<List<Auditoria>> listarPorUsuario(@PathVariable String usuario) {
        return ResponseEntity.ok(auditoriaService.findByUsuario(usuario));
    }
}