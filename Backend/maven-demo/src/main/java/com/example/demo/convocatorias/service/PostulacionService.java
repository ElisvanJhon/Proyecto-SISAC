package com.example.demo.convocatorias.service;

import com.example.demo.convocatorias.dto.PostulacionDTO;

import java.util.List;

public interface PostulacionService {
    List<PostulacionDTO> findAll();
    PostulacionDTO findById(String id);
    PostulacionDTO save(PostulacionDTO dto);
    void deleteById(String id);
}
