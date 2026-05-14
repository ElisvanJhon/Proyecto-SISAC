package com.example.demo.service;

import com.example.demo.dto.PagoDTO;
import com.example.demo.entity.Pagos;
import com.example.demo.repository.PagosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PagosService {

    @Autowired
    private PagosRepository pagosRepository;

    @Transactional(readOnly = true)
    public List<PagoDTO> listarTodos() {
        return pagosRepository.findByOrderByFechaPagoDesc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PagoDTO> listarPorEstado(String estado) {
        return pagosRepository.findByEstado(estado).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PagoDTO obtenerPorId(Long id) {
        Pagos pago = pagosRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado con ID: " + id));
        return convertToDTO(pago);
    }

    @Transactional
    public PagoDTO crear(PagoDTO pagoDTO) {
        Pagos pago = new Pagos();
        pago.setFechaPago(pagoDTO.getFechaPago());
        pago.setMonto(pagoDTO.getMonto());
        pago.setEstado(pagoDTO.getEstado() != null ? pagoDTO.getEstado() : "PENDIENTE");

        Pagos saved = pagosRepository.save(pago);
        return convertToDTO(saved);
    }

    @Transactional
    public PagoDTO completar(Long id) {
        Pagos pago = pagosRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado con ID: " + id));

        if ("COMPLETADO".equals(pago.getEstado())) {
            throw new RuntimeException("El pago ya está completado");
        }

        pago.setEstado("COMPLETADO");
        Pagos updated = pagosRepository.save(pago);

        return convertToDTO(updated);
    }

    @Transactional
    public PagoDTO actualizar(Long id, PagoDTO pagoDTO) {
        Pagos pago = pagosRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado con ID: " + id));

        if ("COMPLETADO".equals(pago.getEstado())) {
            throw new RuntimeException("No se puede modificar un pago completado");
        }

        pago.setFechaPago(pagoDTO.getFechaPago());
        pago.setMonto(pagoDTO.getMonto());
        pago.setEstado(pagoDTO.getEstado());

        Pagos updated = pagosRepository.save(pago);
        return convertToDTO(updated);
    }

    @Transactional
    public void eliminar(Long id) {
        Pagos pago = pagosRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado con ID: " + id));

        if ("COMPLETADO".equals(pago.getEstado())) {
            throw new RuntimeException("No se puede eliminar un pago completado");
        }

        pagosRepository.deleteById(id);
    }

    private PagoDTO convertToDTO(Pagos pago) {
        return new PagoDTO(
                pago.getId(),
                pago.getFechaPago(),
                pago.getMonto(),
                pago.getEstado()
        );
    }
}
