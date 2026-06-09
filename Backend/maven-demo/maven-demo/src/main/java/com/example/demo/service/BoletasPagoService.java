package com.example.demo.service;

import com.example.demo.dto.BoletaPagoDTO;
import com.example.demo.dto.RemuneracionDTO;
import com.example.demo.entity.*;
import com.example.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BoletasPagoService {

    @Autowired
    private BoletasPagoRepository boletasRepository;

    @Autowired
    private PagosRepository pagosRepository;

    @Autowired
    private EmpleadosRepository empleadosRepository;

    @Autowired
    private PlanillasRepository planillasRepository;

    @Autowired
    private RemuneracionesRepository remuneracionesRepository;

    @Transactional(readOnly = true)
    public List<BoletaPagoDTO> listarTodas() {
        return boletasRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BoletaPagoDTO> listarPorPago(Long pagoId) {
        Pagos pago = pagosRepository.findById(pagoId)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado con ID: " + pagoId));
        
        return boletasRepository.findByPago(pago).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BoletaPagoDTO> listarPorEmpleado(Long empleadoId) {
        Empleados empleado = empleadosRepository.findById(empleadoId)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado con ID: " + empleadoId));
        
        return boletasRepository.findByEmpleado(empleado).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BoletaPagoDTO obtenerPorId(Long id) {
        BoletasPago boleta = boletasRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Boleta no encontrada con ID: " + id));
        
        BoletaPagoDTO dto = convertToDTO(boleta);
        
        // Agregar detalle de remuneración
        Planillas planilla = planillasRepository.findByPeriodo(boleta.getPeriodo())
                .orElse(null);
        
        if (planilla != null) {
            remuneracionesRepository.findByPlanillaAndEmpleado(planilla, boleta.getEmpleado())
                    .ifPresent(rem -> {
                        RemuneracionDTO remDTO = new RemuneracionDTO(
                                rem.getId(),
                                rem.getEmpleado().getId(),
                                rem.getEmpleado().getNombre(),
                                rem.getEmpleado().getDni(),
                                rem.getEmpleado().getPuesto(),
                                rem.getPlanilla().getId(),
                                rem.getSueldoBruto(),
                                rem.getDescuentos(),
                                rem.getAportes(),
                                rem.getSueldoNeto()
                        );
                        dto.setDetalleRemuneracion(remDTO);
                    });
        }
        
        return dto;
    }

    @Transactional
    public List<BoletaPagoDTO> generarBoletasPorPlanilla(Long planillaId) {
        Planillas planilla = planillasRepository.findById(planillaId)
                .orElseThrow(() -> new RuntimeException("Planilla no encontrada con ID: " + planillaId));

        if (!"PAGADA".equals(planilla.getEstado())) {
            throw new RuntimeException("Solo se pueden generar boletas de planillas en estado PAGADA");
        }

        if (planilla.getPago() == null) {
            throw new RuntimeException("La planilla no tiene un pago asociado");
        }

        List<Remuneraciones> remuneraciones = remuneracionesRepository.findByPlanilla(planilla);
        
        if (remuneraciones.isEmpty()) {
            throw new RuntimeException("La planilla no tiene remuneraciones");
        }

        return remuneraciones.stream()
                .map(rem -> {
                    // Verificar si ya existe boleta para este empleado y periodo
                    return boletasRepository.findByEmpleadoAndPeriodo(rem.getEmpleado(), planilla.getPeriodo())
                            .orElseGet(() -> {
                                BoletasPago boleta = new BoletasPago();
                                boleta.setEmpleado(rem.getEmpleado());
                                boleta.setPago(planilla.getPago());
                                boleta.setPeriodo(planilla.getPeriodo());
                                boleta.setSueldoNeto(rem.getSueldoNeto());
                                boleta.setFormato("PDF");
                                return boletasRepository.save(boleta);
                            });
                })
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public BoletaPagoDTO crearManual(BoletaPagoDTO boletaDTO) {
        Empleados empleado = empleadosRepository.findById(boletaDTO.getEmpleadoId())
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado con ID: " + boletaDTO.getEmpleadoId()));

        Pagos pago = pagosRepository.findById(boletaDTO.getPagoId())
                .orElseThrow(() -> new RuntimeException("Pago no encontrado con ID: " + boletaDTO.getPagoId()));

        // Verificar si ya existe
        boletasRepository.findByEmpleadoAndPeriodo(empleado, boletaDTO.getPeriodo())
                .ifPresent(b -> {
                    throw new RuntimeException("Ya existe una boleta para este empleado en el periodo " + boletaDTO.getPeriodo());
                });

        BoletasPago boleta = new BoletasPago();
        boleta.setEmpleado(empleado);
        boleta.setPago(pago);
        boleta.setPeriodo(boletaDTO.getPeriodo());
        boleta.setSueldoNeto(boletaDTO.getSueldoNeto());
        boleta.setFormato(boletaDTO.getFormato() != null ? boletaDTO.getFormato() : "PDF");

        BoletasPago saved = boletasRepository.save(boleta);
        return convertToDTO(saved);
    }

    @Transactional
    public void eliminar(Long id) {
        if (!boletasRepository.existsById(id)) {
            throw new RuntimeException("Boleta no encontrada con ID: " + id);
        }
        boletasRepository.deleteById(id);
    }

    private BoletaPagoDTO convertToDTO(BoletasPago boleta) {
        return new BoletaPagoDTO(
                boleta.getId(),
                boleta.getEmpleado().getId(),
                boleta.getEmpleado().getNombre(),
                boleta.getEmpleado().getDni(),
                boleta.getPago() != null ? boleta.getPago().getId() : null,
                boleta.getPeriodo(),
                boleta.getSueldoNeto(),
                boleta.getFormato()
        );
    }
}
