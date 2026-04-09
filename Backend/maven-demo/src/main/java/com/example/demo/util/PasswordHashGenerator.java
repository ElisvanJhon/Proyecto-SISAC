package com.example.demo.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHashGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String password = "admin123";
        String hash = encoder.encode(password);
        
        System.out.println("Password: " + password);
        System.out.println("Hash: " + hash);
        
        // Verificar que el hash es correcto
        boolean matches = encoder.matches(password, hash);
        System.out.println("Verification: " + matches);
        
        // Verificar el hash actual en la DB
        String dbHash = "$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lbCOIQce8QdHdEixC";
        boolean dbMatches = encoder.matches(password, dbHash);
        System.out.println("DB Hash matches: " + dbMatches);
    }
}