package com.example.demo.service;

import com.example.demo.entity.Auditoria;
import com.example.demo.repository.AuditoriaRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditoriaService {

    @Autowired
    private AuditoriaRepository auditoriaRepository;

    @Autowired
    private ObjectMapper objectMapper; // Para convertir objetos a JSON

    public void registrar(String usuario, String entidad, String accion, Object antes, Object despues) {
        try {
            String strAntes = (antes != null) ? objectMapper.writeValueAsString(antes) : "{}";
            String strDespues = (despues != null) ? objectMapper.writeValueAsString(despues) : "{}";
            
            Auditoria log = new Auditoria(usuario, entidad, accion, strAntes, strDespues);
            auditoriaRepository.save(log);
        } catch (Exception e) {
            // Manejar error de serialización
            e.printStackTrace();
        }
    }

    public List<Auditoria> findAll() {
        return auditoriaRepository.findAll();
    }

    public List<Auditoria> findByUsuario(String usuario) {
        return auditoriaRepository.findByUsuario(usuario);
    }
}