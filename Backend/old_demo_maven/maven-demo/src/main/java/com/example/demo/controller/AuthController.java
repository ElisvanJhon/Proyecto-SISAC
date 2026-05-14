package com.example.demo.controller;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.dto.UserInfoResponse;
import com.example.demo.entity.UsuarioAdmin;
import com.example.demo.service.AuthService;
import com.example.demo.service.UserDetailsServiceImpl;
import com.example.demo.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        System.out.println("🔍 Login attempt - Email: " + loginRequest.getEmail());
        
        try {
            System.out.println("🔍 Attempting authentication...");
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );
            System.out.println("✅ Authentication successful");

            UsuarioAdmin usuario = userDetailsService.findByEmail(loginRequest.getEmail());
            System.out.println("🔍 Usuario encontrado: " + usuario.getEmail() + ", Rol: " + usuario.getRole().getNombre());
            
            String token = jwtUtil.generateToken(
                usuario.getEmail(), 
                usuario.getRole().getNombre(), 
                usuario.getId()
            );

            LoginResponse response = new LoginResponse(
                token,
                usuario.getId(),
                usuario.getEmail(),
                usuario.getNombreCompleto(),
                usuario.getRole().getNombre(),
                usuario.getRole().getDescripcion()
            );

            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Credenciales inválidas"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Error interno del servidor"));
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token) {
        try {
            if (token != null && token.startsWith("Bearer ")) {
                String jwtToken = token.substring(7);
                
                if (jwtUtil.isValidToken(jwtToken)) {
                    String email = jwtUtil.extractUsername(jwtToken);
                    UsuarioAdmin usuario = userDetailsService.findByEmail(email);
                    
                    UserInfoResponse userInfo = new UserInfoResponse(
                        usuario.getId(),
                        usuario.getEmail(),
                        usuario.getNombreCompleto(),
                        usuario.getRole().getNombre(),
                        usuario.getRole().getDescripcion()
                    );
                    
                    return ResponseEntity.ok(userInfo);
                }
            }
            
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Token inválido"));
                    
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Token inválido"));
        }
    }

    @GetMapping("/user-info")
    public ResponseEntity<?> getUserInfo(@RequestHeader("Authorization") String token) {
        try {
            if (token != null && token.startsWith("Bearer ")) {
                String jwtToken = token.substring(7);
                String email = jwtUtil.extractUsername(jwtToken);
                
                UsuarioAdmin usuario = userDetailsService.findByEmail(email);
                
                UserInfoResponse userInfo = new UserInfoResponse(
                    usuario.getId(),
                    usuario.getEmail(),
                    usuario.getNombreCompleto(),
                    usuario.getRole().getNombre(),
                    usuario.getRole().getDescripcion()
                );
                
                return ResponseEntity.ok(userInfo);
            }
            
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Token no proporcionado"));
                    
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Error al obtener información del usuario"));
        }
    }

    // Clase interna para respuestas de error
    public static class ErrorResponse {
        private String message;
        
        public ErrorResponse(String message) {
            this.message = message;
        }
        
        public String getMessage() {
            return message;
        }
        
        public void setMessage(String message) {
            this.message = message;
        }
    }
}