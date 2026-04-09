package com.example.demo.dto;

public class LoginResponse {
    private String token;
    private Long userId;
    private String email;
    private String nombreCompleto;
    private String rol;
    private String rolDescripcion;
    
    // Constructor por defecto
    public LoginResponse() {}
    
    // Constructor con parámetros
    public LoginResponse(String token, Long userId, String email, String nombreCompleto, String rol, String rolDescripcion) {
        this.token = token;
        this.userId = userId;
        this.email = email;
        this.nombreCompleto = nombreCompleto;
        this.rol = rol;
        this.rolDescripcion = rolDescripcion;
    }
    
    // Getters y Setters
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getNombreCompleto() {
        return nombreCompleto;
    }
    
    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }
    
    public String getRol() {
        return rol;
    }
    
    public void setRol(String rol) {
        this.rol = rol;
    }
    
    public String getRolDescripcion() {
        return rolDescripcion;
    }
    
    public void setRolDescripcion(String rolDescripcion) {
        this.rolDescripcion = rolDescripcion;
    }
}