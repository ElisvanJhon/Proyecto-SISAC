package com.example.demo.service;

import com.example.demo.dto.PresupuestoDTO;
import com.example.demo.entity.PresupuestoPlanilla;
import com.example.demo.repository.PresupuestoPlanillaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PresupuestoService {

    @Autowired
    private PresupuestoPlanillaRepository presupuestoRepository;

    @Transactional(readOnly = true)
    public List<PresupuestoDTO> listarTodos() {
        return presupuestoRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PresupuestoDTO obtenerPorId(Long id) {
        PresupuestoPlanilla presupuesto = presupuestoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Presupuesto no encontrado con ID: " + id));
        return convertToDTO(presupuesto);
    }

    @Transactional(readOnly = true)
    public PresupuestoDTO obtenerPorPeriodo(String periodo) {
        PresupuestoPlanilla presupuesto = presupuestoRepository.findByPeriodo(periodo)
                .orElseThrow(() -> new RuntimeException("No existe presupuesto para el periodo: " + periodo));
        return convertToDTO(presupuesto);
    }

    @Transactional
    public PresupuestoDTO crear(PresupuestoDTO presupuestoDTO) {
        // Validar que no exista presupuesto para el periodo
        presupuestoRepository.findByPeriodo(presupuestoDTO.getPeriodo()).ifPresent(p -> {
            throw new RuntimeException("Ya existe un presupuesto para el periodo: " + presupuestoDTO.getPeriodo());
        });

        PresupuestoPlanilla presupuesto = new PresupuestoPlanilla();
        presupuesto.setPeriodo(presupuestoDTO.getPeriodo());
        presupuesto.setMontoTotal(presupuestoDTO.getMontoTotal());

        PresupuestoPlanilla saved = presupuestoRepository.save(presupuesto);
        return convertToDTO(saved);
    }

    @Transactional
    public PresupuestoDTO actualizar(Long id, PresupuestoDTO presupuestoDTO) {
        PresupuestoPlanilla presupuesto = presupuestoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Presupuesto no encontrado con ID: " + id));

        presupuesto.setMontoTotal(presupuestoDTO.getMontoTotal());

        PresupuestoPlanilla updated = presupuestoRepository.save(presupuesto);
        return convertToDTO(updated);
    }

    @Transactional
    public void eliminar(Long id) {
        if (!presupuestoRepository.existsById(id)) {
            throw new RuntimeException("Presupuesto no encontrado con ID: " + id);
        }
        presupuestoRepository.deleteById(id);
    }

    private PresupuestoDTO convertToDTO(PresupuestoPlanilla presupuesto) {
        return new PresupuestoDTO(
                presupuesto.getId(),
                presupuesto.getPeriodo(),
                presupuesto.getMontoTotal()
        );
    }
}
