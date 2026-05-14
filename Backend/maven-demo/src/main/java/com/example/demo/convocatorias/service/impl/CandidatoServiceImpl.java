package com.example.demo.convocatorias.service.impl;

import com.example.demo.convocatorias.dto.CandidatoDTO;
import com.example.demo.convocatorias.entity.Candidato;
import com.example.demo.convocatorias.repository.CandidatoRepository;
import com.example.demo.convocatorias.service.CandidatoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CandidatoServiceImpl implements CandidatoService {

    @Autowired
    private CandidatoRepository repository;

    @Override
    public List<CandidatoDTO> findAll() {
        return repository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public CandidatoDTO findById(String id) {
        return convertToDto(repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidato no encontrado con ID: " + id)));
    }

    @Override
    public CandidatoDTO save(CandidatoDTO dto) {
        Candidato entity = convertToEntity(dto);
        return convertToDto(repository.save(entity));
    }

    @Override
    public void deleteById(String id) {
        repository.deleteById(id);
    }

    private CandidatoDTO convertToDto(Candidato entity) {
        CandidatoDTO dto = new CandidatoDTO();
        dto.setId(entity.getId());
        dto.setNombresApellidos(entity.getNombresApellidos());
        dto.setEmail(entity.getEmail());
        dto.setTelefono(entity.getTelefono());
        dto.setCvAdjunto(entity.getCvAdjunto());
        return dto;
    }

    private Candidato convertToEntity(CandidatoDTO dto) {
        Candidato entity = new Candidato();
        entity.setId(dto.getId());
        entity.setNombresApellidos(dto.getNombresApellidos());
        entity.setEmail(dto.getEmail());
        entity.setTelefono(dto.getTelefono());
        entity.setCvAdjunto(dto.getCvAdjunto());
        return entity;
    }
}
