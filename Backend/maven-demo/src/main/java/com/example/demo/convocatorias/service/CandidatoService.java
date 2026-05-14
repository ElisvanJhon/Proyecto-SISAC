package com.example.demo.convocatorias.service;

import com.example.demo.convocatorias.dto.CandidatoDTO;

import java.util.List;

public interface CandidatoService {
    List<CandidatoDTO> findAll();
    CandidatoDTO findById(String id);
    CandidatoDTO save(CandidatoDTO dto);
    void deleteById(String id);
}
