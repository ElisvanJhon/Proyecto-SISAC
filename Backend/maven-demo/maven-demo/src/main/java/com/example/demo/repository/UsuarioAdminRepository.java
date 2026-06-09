package com.example.demo.repository;

import com.example.demo.entity.UsuarioAdmin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioAdminRepository extends JpaRepository<UsuarioAdmin, Long> {
    
    Optional<UsuarioAdmin> findByEmailAndActivoTrue(String email);
    
    Optional<UsuarioAdmin> findByEmail(String email);
    
    boolean existsByEmail(String email);
}