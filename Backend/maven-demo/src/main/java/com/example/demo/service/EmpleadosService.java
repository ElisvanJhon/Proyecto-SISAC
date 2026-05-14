package com.example.demo.service;

import com.example.demo.dto.EmpleadoDTO;
import com.example.demo.entity.Empleados;
import com.example.demo.repository.EmpleadosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmpleadosService {

    @Autowired
    private EmpleadosRepository empleadosRepository;

    @Transactional(readOnly = true)
    public List<EmpleadoDTO> listarTodos() {
        return empleadosRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EmpleadoDTO> listarPorEstado(String estado) {
        return empleadosRepository.findByEstado(estado).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EmpleadoDTO obtenerPorId(Long id) {
        Empleados empleado = empleadosRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado con ID: " + id));
        return convertToDTO(empleado);
    }

    @Transactional
    public EmpleadoDTO crear(EmpleadoDTO empleadoDTO) {
        // Validar DNI único
        empleadosRepository.findByDni(empleadoDTO.getDni()).ifPresent(e -> {
            throw new RuntimeException("Ya existe un empleado con el DNI: " + empleadoDTO.getDni());
        });

        Empleados empleado = new Empleados();
        empleado.setNombre(empleadoDTO.getNombre());
        empleado.setDni(empleadoDTO.getDni());
        empleado.setPuesto(empleadoDTO.getPuesto());
        empleado.setSueldoBase(empleadoDTO.getSueldoBase());
        empleado.setEstado(empleadoDTO.getEstado() != null ? empleadoDTO.getEstado() : "ACTIVO");

        Empleados saved = empleadosRepository.save(empleado);
        return convertToDTO(saved);
    }

    @Transactional
    public EmpleadoDTO actualizar(Long id, EmpleadoDTO empleadoDTO) {
        Empleados empleado = empleadosRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado con ID: " + id));

        if (!empleado.getDni().equals(empleadoDTO.getDni())) {
            empleadosRepository.findByDni(empleadoDTO.getDni()).ifPresent(e -> {
                throw new RuntimeException("Ya existe un empleado con el DNI: " + empleadoDTO.getDni());
            });
        }

        empleado.setNombre(empleadoDTO.getNombre());
        empleado.setDni(empleadoDTO.getDni());
        empleado.setPuesto(empleadoDTO.getPuesto());
        empleado.setSueldoBase(empleadoDTO.getSueldoBase());
        empleado.setEstado(empleadoDTO.getEstado());

        Empleados updated = empleadosRepository.save(empleado);
        return convertToDTO(updated);
    }

    @Transactional
    public void eliminar(Long id) {
        Empleados empleado = empleadosRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado con ID: " + id));
        
        // Soft delete: cambiar estado a ELIMINADO en lugar de borrar físicamente
        empleado.setEstado("ELIMINADO");
        empleadosRepository.save(empleado);
    }

    @Transactional
    public EmpleadoDTO cambiarEstado(Long id, String nuevoEstado) {
        Empleados empleado = empleadosRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado con ID: " + id));
        
        empleado.setEstado(nuevoEstado);
        Empleados updated = empleadosRepository.save(empleado);
        return convertToDTO(updated);
    }

    private EmpleadoDTO convertToDTO(Empleados empleado) {
        return new EmpleadoDTO(
                empleado.getId(),
                empleado.getNombre(),
                empleado.getDni(),
                empleado.getPuesto(),
                empleado.getSueldoBase(),
                empleado.getEstado()
        );
    }
}
