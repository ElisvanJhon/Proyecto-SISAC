package com.example.demo.controller;

import com.example.demo.entity.Role;
import com.example.demo.entity.UsuarioAdmin;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UsuarioAdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UsuarioAdminRepository usuarioRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<List<UsuarioAdmin>> listarUsuarios() {
        return ResponseEntity.ok(usuarioRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<?> crearUsuario(@RequestBody Map<String, String> body) {
        try {
            // Validar existencia
            if (usuarioRepository.existsByEmail(body.get("email"))) {
                return ResponseEntity.badRequest().body(Map.of("error", "El email ya está registrado"));
            }

            UsuarioAdmin usuario = new UsuarioAdmin();
            usuario.setNombre(body.get("nombre"));
            usuario.setApellido(body.get("apellido"));
            usuario.setEmail(body.get("email"));
            // Hashear password inmediatamente
            usuario.setPasswordHash(passwordEncoder.encode(body.get("password")));
            usuario.setActivo(true);

            Long roleId = Long.parseLong(body.get("roleId"));
            Role role = roleRepository.findById(roleId)
                    .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
            
            usuario.setRole(role);

            usuarioRepository.save(usuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Usuario creado correctamente"));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al crear usuario: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarUsuario(@PathVariable Long id) {
        if (!usuarioRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        usuarioRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Usuario eliminado"));
    }
}