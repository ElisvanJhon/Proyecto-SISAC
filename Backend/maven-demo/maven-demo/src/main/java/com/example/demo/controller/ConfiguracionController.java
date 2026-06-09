package com.example.demo.controller;

import com.example.demo.dto.ConfiguracionResponseDTO;
import com.example.demo.dto.ContribuyenteDTO;
import com.example.demo.dto.ParametrosTributariosDTO;
import com.example.demo.service.ConfiguracionService;
import com.example.demo.util.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/tax/config")
public class ConfiguracionController {

    @Autowired
    private ConfiguracionService configuracionService;

    @Autowired
    private JwtUtil jwtUtil;

    // Obtener la configuración actual del contribuyente logueado
    @GetMapping
    public ResponseEntity<ConfiguracionResponseDTO> getConfiguracion(@RequestHeader("Authorization") String token) {
        try {
            Long contribuyenteId = jwtUtil.extractContribuyenteIdFromToken(token); // Asume que el ID del contribuyente está en el token o se puede obtener
            if (contribuyenteId == null) {
                 // Si no hay contribuyente ID, el admin debe crear uno.
                 // Para este caso, asumiremos que el ADMIN_TRIBUTARIO está asociado a UN contribuyente.
                 // En un sistema multi-tenant, esto sería diferente.
                 // Por ahora, simulamos que está atado al ID 1
                 contribuyenteId = 1L; 
            }
            ConfiguracionResponseDTO config = configuracionService.getConfiguracion(contribuyenteId);
            return ResponseEntity.ok(config);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // Proceso 1 - Paso 1: Alta Contribuyente
    @PostMapping("/contribuyente")
    public ResponseEntity<?> guardarContribuyente(@RequestBody ContribuyenteDTO dto, @RequestHeader("Authorization") String token) {
        try {
            String usuario = jwtUtil.extractUsername(token.substring(7));
            // Asumimos que un admin crea/actualiza el contribuyente ID 1
            dto.setId(1L); 
            ConfiguracionResponseDTO config = configuracionService.crearActualizarContribuyente(dto, usuario);
            return ResponseEntity.ok(config);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Proceso 1 - Paso 2: Guardar Parámetros
    @PostMapping("/parametros")
    public ResponseEntity<?> guardarParametros(@RequestBody ParametrosTributariosDTO dto, @RequestHeader("Authorization") String token) {
        try {
            String usuario = jwtUtil.extractUsername(token.substring(7));
            // Asumimos contribuyente ID 1
            Long contribuyenteId = 1L;
            ConfiguracionResponseDTO config = configuracionService.guardarParametros(contribuyenteId, dto, usuario);
            return ResponseEntity.ok(config);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Proceso 1 - Paso 3: Cargar Catálogo
    @PostMapping("/catalogo")
    public ResponseEntity<?> cargarCatalogo(@RequestParam("file") MultipartFile file, @RequestHeader("Authorization") String token) {
        try {
            String usuario = jwtUtil.extractUsername(token.substring(7));
            // Asumimos contribuyente ID 1
            Long contribuyenteId = 1L; 
            configuracionService.cargarCatalogoCSV(contribuyenteId, file, usuario);
            return ResponseEntity.ok(Map.of("message", "Catálogo cargado y validado con éxito."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Error al cargar el archivo: " + e.getMessage()));
        }
    }
}