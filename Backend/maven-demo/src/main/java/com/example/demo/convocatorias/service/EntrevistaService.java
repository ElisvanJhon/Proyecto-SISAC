package com.example.demo.convocatorias.service;

import com.example.demo.convocatorias.dto.EntrevistaDTO;

import java.util.List;

public interface EntrevistaService {
    List<EntrevistaDTO> findAll();
    EntrevistaDTO findById(String id);
    EntrevistaDTO save(EntrevistaDTO dto);
    void deleteById(String id);
}
