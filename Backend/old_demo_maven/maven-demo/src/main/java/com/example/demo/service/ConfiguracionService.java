package com.example.demo.service;

import com.example.demo.dto.ConfiguracionResponseDTO;
import com.example.demo.dto.ContribuyenteDTO;
import com.example.demo.dto.ParametrosTributariosDTO;
import com.example.demo.entity.CatalogoProductos;
import com.example.demo.entity.Contribuyentes;
import com.example.demo.entity.ParametrosTributarios;
import com.example.demo.repository.CatalogoProductosRepository;
import com.example.demo.repository.ContribuyentesRepository;
import com.example.demo.repository.ParametrosTributariosRepository;
import com.google.common.base.Strings;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ConfiguracionService {

    @Autowired private ContribuyentesRepository contribuyentesRepository;
    @Autowired private ParametrosTributariosRepository parametrosTributariosRepository;
    @Autowired private CatalogoProductosRepository catalogoProductosRepository;
    @Autowired private AuditoriaService auditoriaService;

    // Obtener configuración consolidada
    public ConfiguracionResponseDTO getConfiguracion(Long contribuyenteId) {
        ConfiguracionResponseDTO response = new ConfiguracionResponseDTO();

        response.setContribuyente(contribuyentesRepository.findById(contribuyenteId).orElse(null));
        response.setParametros(parametrosTributariosRepository.findByContribuyenteIdAndVigenteHastaIsNull(contribuyenteId).orElse(null));
        response.setCantidadProductos(catalogoProductosRepository.countByContribuyenteId(contribuyenteId));

        return response;
    }

    // Proceso 1 - Paso 1: Alta Contribuyente
    @Transactional
    public ConfiguracionResponseDTO crearActualizarContribuyente(ContribuyenteDTO dto, String usuario) throws Exception { // Añadir throws
        // En este diseño, el ID 1 es el único contribuyente (no multi-tenant)
        // Validar que el DTO tenga ID si es una actualización
        if (dto.getId() == null) {
            // Podríamos decidir crear uno nuevo si no existe, o lanzar error.
            // Por simplicidad, asumimos ID 1 siempre existe o se crea.
            dto.setId(1L); // Forzar ID 1 para este caso
        }

        Contribuyentes contribuyente = contribuyentesRepository.findById(dto.getId()).orElse(new Contribuyentes());

        // Clonar para auditoría ANTES de modificar
        Contribuyentes oldContribuyente = clonarContribuyente(contribuyente);

        // Actualizar datos usando setters
        contribuyente.setRuc(dto.getRuc());
        contribuyente.setRazonSocial(dto.getRazonSocial());
        contribuyente.setRegimen(dto.getRegimen());
        contribuyente.setDomicilio(dto.getDomicilio());
        contribuyente.setRepresentanteLegal(dto.getRepresentanteLegal());
        contribuyente.setCuentaBancaria(dto.getCuentaBancaria());

        Contribuyentes savedContribuyente = contribuyentesRepository.save(contribuyente);

        // Registrar auditoría con el objeto ANTES y DESPUÉS
        auditoriaService.registrar(usuario, "Contribuyentes", "GUARDAR_PERFIL", oldContribuyente, savedContribuyente);

        return getConfiguracion(savedContribuyente.getId()); // Usar getter
    }

    // Proceso 1 - Paso 2: Guardar Parámetros
    @Transactional
    public ConfiguracionResponseDTO guardarParametros(Long contribuyenteId, ParametrosTributariosDTO dto, String usuario) throws Exception {
        Contribuyentes contribuyente = contribuyentesRepository.findById(contribuyenteId)
            .orElseThrow(() -> new Exception("Contribuyente no encontrado"));

        // Versionado: Damos de baja al parámetro anterior
        Optional<ParametrosTributarios> optAnterior = parametrosTributariosRepository.findByContribuyenteIdAndVigenteHastaIsNull(contribuyenteId);
        int nuevaVersion = 1;

        if (optAnterior.isPresent()) {
            ParametrosTributarios anterior = optAnterior.get();
            ParametrosTributarios oldAnterior = clonarParametros(anterior); // Clonar para auditoría

            anterior.setVigenteHasta(LocalDate.now().minusDays(1)); // Usar setter
            parametrosTributariosRepository.save(anterior);
            nuevaVersion = anterior.getVersion() + 1; // Usar getter

            auditoriaService.registrar(usuario, "ParametrosTributarios", "VERSIONAR_FIN", oldAnterior, anterior);
        }

        // Creamos el nuevo parámetro usando setters
        ParametrosTributarios nuevo = new ParametrosTributarios();
        nuevo.setContribuyente(contribuyente);
        nuevo.setVersion(nuevaVersion);
        nuevo.setTasaIgv(dto.getTasaIgv());
        nuevo.setReglasRedondeo(dto.getReglasRedondeo());
        nuevo.setFormatoExportacion(dto.getFormatoExportacion());
        nuevo.setVigenteDesde(LocalDate.now());
        nuevo.setVigenteHasta(null); // Vigente

        ParametrosTributarios savedNuevo = parametrosTributariosRepository.save(nuevo);

        auditoriaService.registrar(usuario, "ParametrosTributarios", "VERSIONAR_INICIO", null, savedNuevo);

        return getConfiguracion(contribuyenteId);
    }

    // Proceso 1 - Paso 3: Cargar Catálogo
    @Transactional
    public void cargarCatalogoCSV(Long contribuyenteId, MultipartFile file, String usuario) throws Exception {
        Contribuyentes contribuyente = contribuyentesRepository.findById(contribuyenteId)
            .orElseThrow(() -> new Exception("Contribuyente no encontrado"));

        // Validar RUC básico (BPMN)
        if (Strings.isNullOrEmpty(contribuyente.getRuc()) || contribuyente.getRuc().length() != 11) { // Usar getter
            throw new Exception("Validación NO OK: El RUC del contribuyente no es válido. Complete el Perfil del Contribuyente primero.");
        }

        List<CatalogoProductos> productos = new ArrayList<>();
        // Corrección de CSVFormat deprecated
        CSVFormat csvFormat = CSVFormat.DEFAULT.builder()
                                .setHeader() // Indica que la primera línea es el header
                                .setSkipHeaderRecord(true) // Saltar la línea del header al leer datos
                                .setIgnoreHeaderCase(true) // Ignorar mayúsc/minúsc en headers
                                .setTrim(true) // Quitar espacios en blanco
                                .build();

        try (BufferedReader fileReader = new BufferedReader(new InputStreamReader(file.getInputStream(), "UTF-8"));
             CSVParser csvParser = new CSVParser(fileReader, csvFormat)) { // Usar el formato creado

            for (CSVRecord csvRecord : csvParser) {
                // Validar consistencia del catálogo (BPMN)
                if (Strings.isNullOrEmpty(csvRecord.get("codigo")) || Strings.isNullOrEmpty(csvRecord.get("precio_unitario"))) {
                    throw new Exception("Validación NO OK: El archivo CSV contiene filas con código o precio unitario vacíos. Revise el archivo.");
                }

                CatalogoProductos producto = new CatalogoProductos();
                // Usar setters
                producto.setContribuyente(contribuyente);
                producto.setCodigo(csvRecord.get("codigo"));
                producto.setDescripcion(csvRecord.get("descripcion"));
                producto.setPrecioUnitario(new BigDecimal(csvRecord.get("precio_unitario")));
                producto.setAfectacionIgv(csvRecord.get("afectacion_igv"));

                productos.add(producto);
            }

            // Persistir (BPMN)
            catalogoProductosRepository.saveAll(productos);

            // Crear AuditLogEntry (BPMN)
            auditoriaService.registrar(usuario, "CatalogoProductos", "CARGA_MASIVA_CSV", null, "Carga de " + productos.size() + " productos.");

        } catch (Exception e) {
            // Generar InformeValidacion.pdf (BPMN) - Simulado con excepción
            throw new Exception("Validación NO OK. " + e.getMessage());
        }
    }
    
    // Helper para clonar Contribuyentes para auditoría
    private Contribuyentes clonarContribuyente(Contribuyentes original) {
        if (original == null || original.getId() == null) return null;
        Contribuyentes clon = new Contribuyentes();
        clon.setId(original.getId());
        clon.setRuc(original.getRuc());
        clon.setRazonSocial(original.getRazonSocial());
        clon.setRegimen(original.getRegimen());
        clon.setDomicilio(original.getDomicilio());
        clon.setRepresentanteLegal(original.getRepresentanteLegal());
        clon.setCuentaBancaria(original.getCuentaBancaria());
        clon.setCreatedAt(original.getCreatedAt());
        clon.setUpdatedAt(original.getUpdatedAt());
        return clon;
    }
    
     // Helper para clonar ParametrosTributarios para auditoría
    private ParametrosTributarios clonarParametros(ParametrosTributarios original) {
        if (original == null || original.getId() == null) return null;
        ParametrosTributarios clon = new ParametrosTributarios();
        clon.setId(original.getId());
        clon.setContribuyente(original.getContribuyente());
        clon.setVersion(original.getVersion());
        clon.setTasaIgv(original.getTasaIgv());
        clon.setReglasRedondeo(original.getReglasRedondeo());
        clon.setFormatoExportacion(original.getFormatoExportacion());
        clon.setVigenteDesde(original.getVigenteDesde());
        clon.setVigenteHasta(original.getVigenteHasta());
        clon.setCreatedAt(original.getCreatedAt());
        return clon;
    }
}