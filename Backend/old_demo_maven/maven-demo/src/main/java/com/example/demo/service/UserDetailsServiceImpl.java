package com.example.demo.service;

import com.example.demo.entity.UsuarioAdmin;
import com.example.demo.repository.UsuarioAdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UsuarioAdminRepository usuarioAdminRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        System.out.println("--> Buscando usuario por email: " + email);
        
        UsuarioAdmin usuario = usuarioAdminRepository.findByEmailAndActivoTrue(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + email));
        
        System.out.println("--> Usuario encontrado: " + usuario.getEmail() + ", Activo: " + usuario.getActivo());
        System.out.println("--> Password hash en DB: " + usuario.getPasswordHash());

        Collection<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + usuario.getRole().getNombre()));

        return new User(
                usuario.getEmail(),
                usuario.getPasswordHash(),
                usuario.getActivo(),
                true, // accountNonExpired
                true, // credentialsNonExpired
                true, // accountNonLocked
                authorities
        );
    }

    public UsuarioAdmin findByEmail(String email) {
        return usuarioAdminRepository.findByEmailAndActivoTrue(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + email));
    }
}