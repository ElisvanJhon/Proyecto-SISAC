package com.example.demo.service;

import com.example.demo.dto.AsistenciaDTO;
import com.example.demo.entity.Asistencias;
import com.example.demo.entity.Empleados;
import com.example.demo.repository.AsistenciasRepository;
import com.example.demo.repository.EmpleadosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AsistenciasService {

    @Autowired
    private AsistenciasRepository asistenciasRepository;

    @Autowired
    private EmpleadosRepository empleadosRepository;

    @Transactional(readOnly = true)
    public List<AsistenciaDTO> listarTodas() {
        return asistenciasRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AsistenciaDTO> listarPorPeriodo(String periodo) {
        return asistenciasRepository.findByPeriodo(periodo).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AsistenciaDTO> listarPorEmpleado(Long empleadoId) {
        Empleados empleado = empleadosRepository.findById(empleadoId)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado con ID: " + empleadoId));
        
        return asistenciasRepository.findByEmpleado(empleado).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AsistenciaDTO> listarPorEmpleadoYPeriodo(Long empleadoId, String periodo) {
        return asistenciasRepository.findByEmpleadoIdAndPeriodo(empleadoId, periodo).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public AsistenciaDTO registrar(AsistenciaDTO asistenciaDTO) {
        Empleados empleado = empleadosRepository.findById(asistenciaDTO.getEmpleadoId())
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado con ID: " + asistenciaDTO.getEmpleadoId()));

        Asistencias asistencia = new Asistencias();
        asistencia.setEmpleado(empleado);
        asistencia.setFecha(asistenciaDTO.getFecha());
        asistencia.setHorasTrabajadas(asistenciaDTO.getHorasTrabajadas() != null ? asistenciaDTO.getHorasTrabajadas() : BigDecimal.ZERO);
        asistencia.setHorasExtra(asistenciaDTO.getHorasExtra() != null ? asistenciaDTO.getHorasExtra() : BigDecimal.ZERO);
        asistencia.setTardanza(asistenciaDTO.getTardanza() != null ? asistenciaDTO.getTardanza() : BigDecimal.ZERO);
        asistencia.setAusencia(asistenciaDTO.getAusencia() != null ? asistenciaDTO.getAusencia() : false);

        Asistencias saved = asistenciasRepository.save(asistencia);
        return convertToDTO(saved);
    }

    @Transactional
    public AsistenciaDTO actualizar(Long id, AsistenciaDTO asistenciaDTO) {
        Asistencias asistencia = asistenciasRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asistencia no encontrada con ID: " + id));

        asistencia.setFecha(asistenciaDTO.getFecha());
        asistencia.setHorasTrabajadas(asistenciaDTO.getHorasTrabajadas());
        asistencia.setHorasExtra(asistenciaDTO.getHorasExtra());
        asistencia.setTardanza(asistenciaDTO.getTardanza());
        asistencia.setAusencia(asistenciaDTO.getAusencia());

        Asistencias updated = asistenciasRepository.save(asistencia);
        return convertToDTO(updated);
    }

    @Transactional
    public void eliminar(Long id) {
        if (!asistenciasRepository.existsById(id)) {
            throw new RuntimeException("Asistencia no encontrada con ID: " + id);
        }
        asistenciasRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public Map<String, BigDecimal> obtenerResumenPorEmpleadoYPeriodo(Long empleadoId, String periodo) {
        List<Asistencias> asistencias = asistenciasRepository.findByEmpleadoIdAndPeriodo(empleadoId, periodo);
        
        BigDecimal totalHorasTrabajadas = asistencias.stream()
                .map(Asistencias::getHorasTrabajadas)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalHorasExtra = asistencias.stream()
                .map(Asistencias::getHorasExtra)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalTardanzas = asistencias.stream()
                .map(Asistencias::getTardanza)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        long totalAusencias = asistencias.stream()
                .filter(a -> a.getAusencia() != null && a.getAusencia())
                .count();

        return Map.of(
                "totalHorasTrabajadas", totalHorasTrabajadas,
                "totalHorasExtra", totalHorasExtra,
                "totalTardanzas", totalTardanzas,
                "totalAusencias", BigDecimal.valueOf(totalAusencias)
        );
    }

    private AsistenciaDTO convertToDTO(Asistencias asistencia) {
        return new AsistenciaDTO(
                asistencia.getId(),
                asistencia.getEmpleado().getId(),
                asistencia.getEmpleado().getNombre(),
                asistencia.getFecha(),
                asistencia.getHorasTrabajadas(),
                asistencia.getHorasExtra(),
                asistencia.getTardanza(),
                asistencia.getAusencia()
        );
    }
}
