package com.example.demo.service;

import com.example.demo.dto.CompraRequestDTO;
import com.example.demo.dto.VentaRequestDTO;
import com.example.demo.entity.*;
import com.example.demo.repository.*;
import com.google.common.base.Strings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode; // Importar RoundingMode
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class OperacionDiariaService {

    @Autowired private ComprobantesRepository comprobantesRepository;
    @Autowired private ClientesRepository clientesRepository;
    @Autowired private CatalogoProductosRepository catalogoProductosRepository;
    @Autowired private ParametrosTributariosRepository parametrosTributariosRepository;
    @Autowired private RegistroVentasRepository registroVentasRepository;
    @Autowired private RegistroComprasRepository registroComprasRepository;
    @Autowired private ProveedoresRepository proveedoresRepository;
    @Autowired private ContribuyentesRepository contribuyentesRepository;
    @Autowired private AuditoriaService auditoriaService;

    private final Path fileStorageLocation = Paths.get("sisac_storage").toAbsolutePath().normalize();

    // --- Proceso 2: Emisión CPE (Venta) ---

    @Transactional
    public Map<String, String> registrarVenta(Long contribuyenteId, VentaRequestDTO ventaRequest, String usuario) throws Exception {

        // 1. Obtener parámetros (tasa IGV)
        ParametrosTributarios params = parametrosTributariosRepository.findByContribuyenteIdAndVigenteHastaIsNull(contribuyenteId)
            .orElseThrow(() -> new ValidacionException("No se encontraron parámetros tributarios activos.", "ErrorFacturacion.pdf"));

        // 2. Buscar o crear cliente
        Clientes cliente = clientesRepository.findByRucDni(ventaRequest.getClienteRucDni())
            .orElseGet(() -> {
                Clientes c = new Clientes();
                c.setRucDni(ventaRequest.getClienteRucDni()); // Usar setter
                c.setNombre("Cliente - " + ventaRequest.getClienteRucDni()); // Simulado, Usar setter
                return clientesRepository.save(c);
            });

        Contribuyentes contribuyente = contribuyentesRepository.findById(contribuyenteId)
            .orElseThrow(() -> new Exception("Contribuyente no encontrado"));

        Comprobantes comprobante = new Comprobantes();
        // Usar setters
        comprobante.setContribuyente(contribuyente);
        comprobante.setCliente(cliente);
        comprobante.setFechaEmision(LocalDate.now());
        comprobante.setTipo("FACTURA"); // Simulado
        comprobante.setSerie("F001");    // Simulado
        comprobante.setCorrelativo(123); // Simulado

        BigDecimal subtotalTotal = BigDecimal.ZERO;
        BigDecimal igvTotal = BigDecimal.ZERO;
        List<ComprobanteDetalles> detalles = new ArrayList<>();

        // 3. Procesar ítems y calcular IGV
        for (VentaRequestDTO.ItemVentaDTO itemDTO : ventaRequest.getItems()) {
            CatalogoProductos producto = catalogoProductosRepository.findById(itemDTO.getProductoId())
                .orElseThrow(() -> new ValidacionException("Producto ID " + itemDTO.getProductoId() + " no existe.", "ErrorFacturacion.pdf"));

            ComprobanteDetalles detalle = new ComprobanteDetalles();
            BigDecimal cantidad = new BigDecimal(itemDTO.getCantidad());
            BigDecimal precioUnitario = producto.getPrecioUnitario(); // Usar getter

            // Simulación de cálculo de IGV (Corregido)
            BigDecimal subtotalItem = precioUnitario.multiply(cantidad);
            BigDecimal igvItem = BigDecimal.ZERO; // Inicializar
             if (params.getTasaIgv() != null) { // Usar getter y check null
                igvItem = subtotalItem.multiply(params.getTasaIgv().divide(new BigDecimal(100)));
             }

            // Usar setters
            detalle.setComprobante(comprobante); // Establecer relación bidireccional si es necesario
            detalle.setProducto(producto);
            detalle.setCantidad(cantidad);
            detalle.setPrecioUnitario(precioUnitario);
            detalle.setAfectacionIgv(producto.getAfectacionIgv()); // Usar getter
            detalle.setSubtotal(subtotalItem);
            detalle.setIgv(igvItem);
            detalle.setTotal(subtotalItem.add(igvItem));

            detalles.add(detalle);
            subtotalTotal = subtotalTotal.add(subtotalItem);
            igvTotal = igvTotal.add(igvItem);
        }

        // Usar setters
        comprobante.setSubtotal(subtotalTotal);
        comprobante.setIgv(igvTotal);
        comprobante.setTotal(subtotalTotal.add(igvTotal));
        comprobante.setDetalles(detalles); // Asegúrate que la relación @OneToMany esté configurada con CascadeType.ALL

        // 4. Generar CPE_XML y CPE_PDF (Simulación)
        String baseName = "CPE_" + comprobante.getSerie() + "-" + comprobante.getCorrelativo(); // Usar getters
        String xmlPath = simularAlmacenamiento(baseName + ".xml");
        String pdfPath = simularAlmacenamiento(baseName + ".pdf");

        // Usar setters
        comprobante.setXmlPath(xmlPath);
        comprobante.setPdfPath(pdfPath);
        comprobante.setEstado("EMITIDO");

        Comprobantes savedComprobante = comprobantesRepository.save(comprobante);

        // 5. Crear RegistroVentasEntry y AuditLogEntry (Usar setters)
        RegistroVentas registroVenta = new RegistroVentas();
        registroVenta.setComprobante(savedComprobante);
        registroVenta.setFecha(savedComprobante.getFechaEmision()); // Usar getter
        registroVenta.setMontoTotal(savedComprobante.getTotal()); // Usar getter
        registroVenta.setIgv(savedComprobante.getIgv());       // Usar getter
        registroVenta.setEstado("REGISTRADO");
        registroVentasRepository.save(registroVenta);

        auditoriaService.registrar(usuario, "Comprobantes", "EMITIR_CPE", null, savedComprobante);

        return Map.of(
            "message", "CPE generado exitosamente.",
            "xml", xmlPath,
            "pdf", pdfPath
        );
    }

    // --- Proceso 2: Registro de Compras ---

    @Transactional
    public Map<String, String> registrarCompra(Long contribuyenteId, CompraRequestDTO compraRequest, MultipartFile file, String usuario) throws Exception {

        // 1. Buscar o crear proveedor
        Proveedores proveedor = proveedoresRepository.findByRuc(compraRequest.getProveedorRuc())
            .orElseGet(() -> {
                Proveedores p = new Proveedores();
                p.setRuc(compraRequest.getProveedorRuc()); // Usar setter
                p.setRazonSocial("Proveedor - " + compraRequest.getProveedorRuc()); // Simulado, Usar setter
                return proveedoresRepository.save(p);
            });

        // 2. Validar duplicados
        boolean duplicado = registroComprasRepository.existsByProveedorIdAndNumeroFactura(proveedor.getId(), compraRequest.getNumeroFactura()); // Usar getter
        if (duplicado) {
            throw new ValidacionException("Factura duplicada: " + compraRequest.getNumeroFactura(), "IncidenciaCompra.pdf");
        }

        Contribuyentes contribuyente = contribuyentesRepository.findById(contribuyenteId)
            .orElseThrow(() -> new Exception("Contribuyente no encontrado"));

        RegistroCompras compra = new RegistroCompras();
        // Usar setters
        compra.setContribuyente(contribuyente);
        compra.setProveedor(proveedor);
        compra.setNumeroFactura(compraRequest.getNumeroFactura());
        compra.setFechaEmision(LocalDate.now()); // Simulado, debería venir del DTO/XML

        // 3. Calcular IGV (crédito fiscal) (Corregido con RoundingMode)
        ParametrosTributarios params = parametrosTributariosRepository.findByContribuyenteIdAndVigenteHastaIsNull(contribuyenteId)
            .orElseThrow(() -> new ValidacionException("No se encontraron parámetros tributarios activos.", "IncidenciaCompra.pdf"));

        BigDecimal montoTotal = new BigDecimal(compraRequest.getMontoTotal());
        BigDecimal igv = BigDecimal.ZERO; // Inicializar

        if (params.getTasaIgv() != null && params.getTasaIgv().compareTo(BigDecimal.ZERO) > 0) { // Usar getter y check > 0
            BigDecimal tasaMasUno = params.getTasaIgv().divide(new BigDecimal(100)).add(BigDecimal.ONE);
            // Usar RoundingMode en lugar de la constante deprecada
            BigDecimal subtotal = montoTotal.divide(tasaMasUno, 2, RoundingMode.HALF_UP);
            igv = montoTotal.subtract(subtotal);
        } else {
             // Si la tasa es 0 o nula, el IGV es 0
            igv = BigDecimal.ZERO;
        }


        // Usar setters
        compra.setMontoTotal(montoTotal);
        compra.setIgv(igv);
        compra.setValidado(true); // BPMN: Validación OK

        // 4. Guardar archivo
        if (file != null && !file.isEmpty()) {
            String path = almacenarArchivo(file, "compras"); // Usar método refactorizado
            if (path.endsWith(".xml")) compra.setXmlPath(path); // Usar setter
            if (path.endsWith(".pdf")) compra.setPdfPath(path); // Usar setter
        }

        RegistroCompras savedCompra = registroComprasRepository.save(compra);
        auditoriaService.registrar(usuario, "RegistroCompras", "REGISTRAR_COMPRA", null, savedCompra);

        return Map.of("message", "Compra registrada correctamente.");
    }

    // --- Utilidades ---

    // Refactorizado para almacenar archivos físicos
    private String almacenarArchivo(MultipartFile file, String subdirectorio) throws IOException {
        Path targetDir = this.fileStorageLocation.resolve(subdirectorio).normalize();
        Files.createDirectories(targetDir); // Asegura que el subdirectorio exista

        String originalFilename = Strings.nullToEmpty(file.getOriginalFilename());
        String fileName = UUID.randomUUID().toString() + "_" + originalFilename;
        Path targetLocation = targetDir.resolve(fileName);

        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        return Paths.get(subdirectorio, fileName).toString(); // Devuelve ruta relativa
    }

    // Simulación simple para generar archivos vacíos si almacenarArchivo no es adecuado
    private String simularAlmacenamiento(String originalFilename) throws IOException {
        Files.createDirectories(this.fileStorageLocation);
        String fileName = UUID.randomUUID().toString() + "_" + originalFilename;
        Path targetLocation = this.fileStorageLocation.resolve(fileName);
        // Simulación: crear un archivo vacío
        if (!Files.exists(targetLocation)) {
            Files.createFile(targetLocation);
        }
        return fileName; // Devolvemos solo el nombre
    }

    // Clase de excepción personalizada para manejar errores de validación del BPMN
    public static class ValidacionException extends Exception {
        private final String archivoError;
        public ValidacionException(String message, String archivoError) {
            super(message);
            this.archivoError = archivoError;
        }
        public String getArchivoError() {
            return archivoError;
        }
    }
    
     // Helper para clonar
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