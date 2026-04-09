package com.example.demo.controller;

import com.example.demo.dto.CierreRequestDTO;
import com.example.demo.dto.DeclaracionAprobacionDTO;
import com.example.demo.entity.Declaraciones;
import com.example.demo.service.CierreMensualService;
import com.example.demo.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/tax/closing")
public class CierreMensualController {

    @Autowired
    private CierreMensualService cierreMensualService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/iniciar")
    public ResponseEntity<?> iniciarCierre(@RequestBody CierreRequestDTO request,
                                           @RequestHeader("Authorization") String token) {
        try {
            Long contribuyenteId = jwtUtil.extractContribuyenteIdFromToken(token); // Necesitarás implementar esto en JwtUtil
            String usuario = jwtUtil.extractUsername(token.substring(7));
            
            Declaraciones declaracion = cierreMensualService.iniciarProcesoCierre(contribuyenteId, request.getPeriodo(), usuario);
            return ResponseEntity.ok(declaracion);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/aprobar")
    public ResponseEntity<?> aprobarDeclaracion(@RequestBody DeclaracionAprobacionDTO request,
                                                  @RequestHeader("Authorization") String token) {
        try {
            String usuario = jwtUtil.extractUsername(token.substring(7));
            Declaraciones declaracion = cierreMensualService.aprobarDeclaracion(request.getDeclaracionId(), usuario, request.isAprobado());
            return ResponseEntity.ok(declaracion);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/descargar/{declaracionId}/{tipoArchivo}")
    public ResponseEntity<Resource> descargarArchivo(@PathVariable Long declaracionId, 
                                                       @PathVariable String tipoArchivo) {
        try {
            Resource resource = cierreMensualService.cargarArchivoComoRecurso(declaracionId, tipoArchivo);
            String contentType = "application/octet-stream";
            
            if (tipoArchivo.endsWith("xlsx")) {
                contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            } else if (tipoArchivo.endsWith("pdf")) {
                contentType = "application/pdf";
            } else if (tipoArchivo.endsWith("zip")) {
                contentType = "application/zip";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}