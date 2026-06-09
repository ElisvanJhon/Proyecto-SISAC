package com.example.demo.convocatorias.service.impl;

import com.example.demo.convocatorias.dto.ConvocatoriaDTO;
import com.example.demo.convocatorias.entity.Convocatoria;
import com.example.demo.convocatorias.repository.ConvocatoriaRepository;
import com.example.demo.convocatorias.service.ConvocatoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ConvocatoriaServiceImpl implements ConvocatoriaService {

    @Autowired
    private ConvocatoriaRepository repository;

    @Override
    public List<ConvocatoriaDTO> findAll() {
        return repository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public ConvocatoriaDTO findById(String id) {
        return convertToDto(repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Convocatoria no encontrada con ID: " + id)));
    }

    @Override
    public ConvocatoriaDTO save(ConvocatoriaDTO dto) {
        Convocatoria entity = convertToEntity(dto);
        return convertToDto(repository.save(entity));
    }

    @Override
    public void deleteById(String id) {
        repository.deleteById(id);
    }

    private ConvocatoriaDTO convertToDto(Convocatoria entity) {
        ConvocatoriaDTO dto = new ConvocatoriaDTO();
        dto.setId(entity.getId());
        dto.setTitulo(entity.getTitulo());
        dto.setFechaPublicacion(entity.getFechaPublicacion());
        dto.setDescripcion(entity.getDescripcion());
        return dto;
    }

    private Convocatoria convertToEntity(ConvocatoriaDTO dto) {
        Convocatoria entity = new Convocatoria();
        entity.setId(dto.getId());
        entity.setTitulo(dto.getTitulo());
        entity.setFechaPublicacion(dto.getFechaPublicacion());
        entity.setDescripcion(dto.getDescripcion());
        return entity;
    }
}
