package com.example.demo.service;

import com.example.demo.entity.UsuarioAdmin;
import com.example.demo.repository.UsuarioAdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UsuarioAdminRepository usuarioAdminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UsuarioAdmin authenticate(String email, String password) {
        UsuarioAdmin usuario = usuarioAdminRepository.findByEmailAndActivoTrue(email)
                .orElse(null);
        
        if (usuario != null && passwordEncoder.matches(password, usuario.getPasswordHash())) {
            return usuario;
        }
        
        return null;
    }

    public UsuarioAdmin findByEmail(String email) {
        return usuarioAdminRepository.findByEmailAndActivoTrue(email)
                .orElse(null);
    }

    public boolean existsByEmail(String email) {
        return usuarioAdminRepository.existsByEmail(email);
    }
}