package com.example.demo.service;

import com.example.demo.entity.*;
import com.example.demo.repository.*;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;

import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.io.font.constants.StandardFonts;
import java.math.RoundingMode;

import java.io.*;
import java.math.BigDecimal;
import java.net.MalformedURLException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.DecimalFormat;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class PlanillaExportService {

    private static final Logger log = LoggerFactory.getLogger(PlanillaExportService.class);

    @Autowired private PlanillasRepository planillasRepository;
    @Autowired private RemuneracionesRepository remuneracionesRepository;
    @Autowired private EmpleadosRepository empleadosRepository;
    @Autowired private AsistenciasRepository asistenciasRepository;

    private final Path fileStorageLocation = Paths.get("sisac_storage/planillas").toAbsolutePath().normalize();
    private static final DecimalFormat df = new DecimalFormat("#,##0.00");
    private static final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    public PlanillaExportService() {
        try {
            Files.createDirectories(this.fileStorageLocation);
            log.info("Directorio de almacenamiento de planillas verificado/creado en: {}", fileStorageLocation);
        } catch (Exception ex) {
            log.error("No se pudo crear el directorio de almacenamiento de archivos.", ex);
            throw new RuntimeException("No se pudo crear el directorio de almacenamiento de archivos.", ex);
        }
    }

    /**
     * Genera archivo PLAME en formato TXT según especificaciones SUNAT
     */
    public Resource exportarPLAME(Long planillaId) throws Exception {
        log.info("Iniciando exportación PLAME para planilla ID: {}", planillaId);
        
        Planillas planilla = planillasRepository.findById(planillaId)
            .orElseThrow(() -> new Exception("Planilla no encontrada con ID: " + planillaId));
        
        List<Remuneraciones> remuneraciones = remuneracionesRepository.findByPlanilla(planilla);
        
        String fileName = "PLAME_" + planilla.getPeriodo() + ".txt";
        Path filePath = this.fileStorageLocation.resolve(fileName);
        
        try (BufferedWriter writer = new BufferedWriter(
                new OutputStreamWriter(new FileOutputStream(filePath.toFile()), StandardCharsets.UTF_8))) {
            
            // Escribir encabezado PLAME (simplificado - ajustar según formato oficial SUNAT)
            writer.write("# PLAME - Planilla Electrónica\n");
            writer.write("# Periodo: " + formatPeriodo(planilla.getPeriodo()) + "\n");
            writer.write("# Fecha Generación: " + java.time.LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")) + "\n");
            writer.write("#\n");
            writer.write("# Formato: DNI|Nombre|SueldoBruto|Descuentos|SueldoNeto|Aportes\n");
            writer.write("#----------------------------------------------------------------\n");
            
            for (Remuneraciones rem : remuneraciones) {
                Empleados emp = rem.getEmpleado();
                
                // Formato: DNI|Nombre|Bruto|Descuentos|Neto|Aportes
                String linea = String.format("%s|%s|%.2f|%.2f|%.2f|%.2f\n",
                    nvl(emp.getDni()),
                    nvl(emp.getNombre()),
                    nvl(rem.getSueldoBruto()),
                    nvl(rem.getDescuentos()),
                    nvl(rem.getSueldoNeto()),
                    nvl(rem.getAportes())
                );
                writer.write(linea);
            }
            
            log.info("Archivo PLAME generado exitosamente: {}", fileName);
        } catch (IOException e) {
            log.error("Error generando archivo PLAME", e);
            throw new Exception("Error al generar archivo PLAME: " + e.getMessage(), e);
        }
        
        return cargarArchivoComoRecurso(fileName);
    }

    /**
     * Genera archivo CSV para telecredito bancario
     */
    public Resource exportarBanco(Long planillaId) throws Exception {
        log.info("Iniciando exportación bancaria para planilla ID: {}", planillaId);
        
        Planillas planilla = planillasRepository.findById(planillaId)
            .orElseThrow(() -> new Exception("Planilla no encontrada con ID: " + planillaId));
        
        List<Remuneraciones> remuneraciones = remuneracionesRepository.findByPlanilla(planilla);
        
        String fileName = "BANCO_" + planilla.getPeriodo() + ".csv";
        Path filePath = this.fileStorageLocation.resolve(fileName);
        
        try (BufferedWriter writer = new BufferedWriter(
                new OutputStreamWriter(new FileOutputStream(filePath.toFile()), StandardCharsets.UTF_8))) {
            
            // Escribir encabezado CSV
            writer.write("DNI,Nombre,Puesto,Monto a Pagar,Periodo\n");
            
            for (Remuneraciones rem : remuneraciones) {
                Empleados emp = rem.getEmpleado();
                
                // Formato CSV: DNI,Nombre,Puesto,Monto,Periodo
                String linea = String.format("%s,\"%s\",\"%s\",%.2f,%s\n",
                    nvl(emp.getDni()),
                    nvl(emp.getNombre()),
                    nvl(emp.getPuesto()),
                    nvl(rem.getSueldoNeto()),
                    formatPeriodo(planilla.getPeriodo())
                );
                writer.write(linea);
            }
            
            log.info("Archivo de telecredito bancario generado exitosamente: {}", fileName);
        } catch (IOException e) {
            log.error("Error generando archivo bancario", e);
            throw new Exception("Error al generar archivo bancario: " + e.getMessage(), e);
        }
        
        return cargarArchivoComoRecurso(fileName);
    }

    /**
     * Genera archivo Excel para telecredito bancario
     */
    public Resource exportarBancoExcel(Long planillaId) throws Exception {
        log.info("Iniciando exportación bancaria Excel para planilla ID: {}", planillaId);
        
        Planillas planilla = planillasRepository.findById(planillaId)
            .orElseThrow(() -> new Exception("Planilla no encontrada con ID: " + planillaId));
        
        List<Remuneraciones> remuneraciones = remuneracionesRepository.findByPlanilla(planilla);
        
        String fileName = "BANCO_" + planilla.getPeriodo() + ".xlsx";
        Path filePath = this.fileStorageLocation.resolve(fileName);
        
        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            XSSFSheet sheet = workbook.createSheet("Telecredito");
            
            // Encabezado
            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("DNI");
            header.createCell(1).setCellValue("Nombre");
            header.createCell(2).setCellValue("Puesto");
            header.createCell(3).setCellValue("Monto a Pagar");
            header.createCell(4).setCellValue("Periodo");
            
            int rowNum = 1;
            for (Remuneraciones rem : remuneraciones) {
                Empleados emp = rem.getEmpleado();
                Row row = sheet.createRow(rowNum++);
                
                row.createCell(0).setCellValue(nvl(emp.getDni()));
                row.createCell(1).setCellValue(nvl(emp.getNombre()));
                row.createCell(2).setCellValue(nvl(emp.getPuesto()));
                row.createCell(3).setCellValue(nvl(rem.getSueldoNeto()).doubleValue());
                row.createCell(4).setCellValue(formatPeriodo(planilla.getPeriodo()));
            }
            
            // Auto-ajustar columnas
            for (int i = 0; i < 5; i++) {
                sheet.autoSizeColumn(i);
            }
            
            try (FileOutputStream outputStream = new FileOutputStream(filePath.toFile())) {
                workbook.write(outputStream);
            }
            
            log.info("Archivo Excel de telecredito bancario generado exitosamente: {}", fileName);
        } catch (IOException e) {
            log.error("Error generando archivo Excel bancario", e);
            throw new Exception("Error al generar archivo Excel bancario: " + e.getMessage(), e);
        }
        
        return cargarArchivoComoRecurso(fileName);
    }

    /**
     * Genera boletas de pago en PDF
     */
    public Resource generarBoletasPDF(Long planillaId) throws Exception {
        log.info("Iniciando generación de boletas PDF para planilla ID: {}", planillaId);
        
        Planillas planilla = planillasRepository.findById(planillaId)
            .orElseThrow(() -> new Exception("Planilla no encontrada con ID: " + planillaId));
        
        List<Remuneraciones> remuneraciones = remuneracionesRepository.findByPlanilla(planilla);
        
        if (remuneraciones.isEmpty()) {
            throw new Exception("No hay remuneraciones para esta planilla.");
        }
        
        String fileName = "BOLETAS_" + planilla.getPeriodo() + ".pdf";
        Path filePath = this.fileStorageLocation.resolve(fileName);
        
        PdfFont font = PdfFontFactory.createFont(StandardFonts.HELVETICA);
        PdfFont boldFont = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
        
        try (PdfWriter writer = new PdfWriter(filePath.toString());
             PdfDocument pdf = new PdfDocument(writer);
             Document document = new Document(pdf, PageSize.A4)) {
            
            for (int i = 0; i < remuneraciones.size(); i++) {
                Remuneraciones rem = remuneraciones.get(i);
                Empleados emp = rem.getEmpleado();
                
                if (i > 0) {
                    document.add(new com.itextpdf.layout.element.AreaBreak());
                }
                
                // Título
                Paragraph titulo = new Paragraph("BOLETA DE PAGO")
                    .setFont(boldFont)
                    .setFontSize(16)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setBold();
                document.add(titulo);
                
                // Periodo
                Paragraph periodo = new Paragraph("Periodo: " + formatPeriodo(planilla.getPeriodo()))
                    .setFont(font)
                    .setFontSize(12)
                    .setTextAlignment(TextAlignment.CENTER);
                document.add(periodo);
                
                document.add(new Paragraph("\n"));
                
                // Datos del empleado
                Table tableDatos = new Table(UnitValue.createPercentArray(new float[]{30, 70}))
                    .useAllAvailableWidth();
                
                tableDatos.addCell(new Cell().add(new Paragraph("DNI:").setFont(boldFont)));
                tableDatos.addCell(new Cell().add(new Paragraph(nvl(emp.getDni())).setFont(font)));
                
                tableDatos.addCell(new Cell().add(new Paragraph("Nombre:").setFont(boldFont)));
                tableDatos.addCell(new Cell().add(new Paragraph(nvl(emp.getNombre())).setFont(font)));
                
                tableDatos.addCell(new Cell().add(new Paragraph("Puesto:").setFont(boldFont)));
                tableDatos.addCell(new Cell().add(new Paragraph(nvl(emp.getPuesto())).setFont(font)));
                
                document.add(tableDatos);
                document.add(new Paragraph("\n"));
                
                // Obtener novedades del periodo
                List<Asistencias> asistencias = asistenciasRepository.findByEmpleadoIdAndPeriodo(
                    emp.getId(), 
                    planilla.getPeriodo()
                );
                
                // Tabla de conceptos
                Table tableConceptos = new Table(UnitValue.createPercentArray(new float[]{70, 30}))
                    .useAllAvailableWidth();
                
                // Encabezado
                tableConceptos.addHeaderCell(new Cell().add(new Paragraph("Concepto").setFont(boldFont)));
                tableConceptos.addHeaderCell(new Cell().add(new Paragraph("Monto").setFont(boldFont)));
                
                // Sueldo Base
                tableConceptos.addCell(new Cell().add(new Paragraph("Sueldo Base").setFont(font)));
                tableConceptos.addCell(new Cell().add(new Paragraph("S/ " + df.format(nvl(emp.getSueldoBase()))).setFont(font)));
                
                // SECCIÓN DE NOVEDADES
                if (!asistencias.isEmpty()) {
                    // Título de novedades
                    tableConceptos.addCell(new Cell(1, 2)
                        .add(new Paragraph("NOVEDADES DEL PERIODO").setFont(boldFont).setFontSize(10).setItalic())
                        .setBackgroundColor(new DeviceRgb(240, 240, 240)));
                    
                    BigDecimal sueldoBase = emp.getSueldoBase();
                    BigDecimal tarifaHora = sueldoBase.divide(new BigDecimal("160"), 2, RoundingMode.HALF_UP);
                    BigDecimal tasaHoraExtra = new BigDecimal("1.25");
                    
                    for (Asistencias asist : asistencias) {
                        // Horas extra
                        if (asist.getHorasExtra() != null && asist.getHorasExtra().compareTo(BigDecimal.ZERO) > 0) {
                            BigDecimal montoHorasExtra = tarifaHora.multiply(tasaHoraExtra).multiply(asist.getHorasExtra());
                            tableConceptos.addCell(new Cell().add(new Paragraph("  + Horas extras (" + asist.getHorasExtra() + "h)").setFont(font).setFontColor(new DeviceRgb(16, 185, 129))));
                            tableConceptos.addCell(new Cell().add(new Paragraph("S/ " + df.format(montoHorasExtra)).setFont(font).setFontColor(new DeviceRgb(16, 185, 129))));
                        }
                        
                        // Tardanzas
                        if (asist.getTardanza() != null && asist.getTardanza().compareTo(BigDecimal.ZERO) > 0) {
                            BigDecimal montoTardanza = tarifaHora.multiply(asist.getTardanza());
                            tableConceptos.addCell(new Cell().add(new Paragraph("  - Tardanzas (" + asist.getTardanza() + "h)").setFont(font).setFontColor(new DeviceRgb(239, 68, 68))));
                            tableConceptos.addCell(new Cell().add(new Paragraph("S/ " + df.format(montoTardanza)).setFont(font).setFontColor(new DeviceRgb(239, 68, 68))));
                        }
                        
                        // Ausencias
                        if (asist.getAusencia() != null && asist.getAusencia()) {
                            BigDecimal montoAusencia = tarifaHora.multiply(new BigDecimal("8"));
                            tableConceptos.addCell(new Cell().add(new Paragraph("  - Ausencia (1 día)").setFont(font).setFontColor(new DeviceRgb(239, 68, 68))));
                            tableConceptos.addCell(new Cell().add(new Paragraph("S/ " + df.format(montoAusencia)).setFont(font).setFontColor(new DeviceRgb(239, 68, 68))));
                        }
                    }
                    
                    // Línea separadora
                    tableConceptos.addCell(new Cell(1, 2).add(new Paragraph(" ").setFontSize(2)));
                }
                
                // Subtotal (Sueldo Bruto)
                tableConceptos.addCell(new Cell().add(new Paragraph("Subtotal Bruto").setFont(boldFont)));
                tableConceptos.addCell(new Cell().add(new Paragraph("S/ " + df.format(nvl(rem.getSueldoBruto()))).setFont(boldFont)));
                
                // Descuentos AFP/ONP (13%)
                tableConceptos.addCell(new Cell().add(new Paragraph("Descuentos AFP/ONP (13%)").setFont(font)));
                tableConceptos.addCell(new Cell().add(new Paragraph("S/ " + df.format(nvl(rem.getDescuentos()))).setFont(font).setFontColor(new DeviceRgb(239, 68, 68))));
                
                // Aportes Empleador EsSalud (9%)
                tableConceptos.addCell(new Cell().add(new Paragraph("Aportes Empleador (9%)").setFont(font).setItalic()));
                tableConceptos.addCell(new Cell().add(new Paragraph("S/ " + df.format(nvl(rem.getAportes()))).setFont(font).setItalic().setFontColor(new DeviceRgb(107, 114, 128))));
                
                // Línea total
                tableConceptos.addCell(new Cell(1, 2).add(new Paragraph(" ").setFontSize(2))
                    .setBorderTop(new SolidBorder(2)));
                
                // Neto a pagar
                tableConceptos.addCell(new Cell().add(new Paragraph("NETO A PAGAR").setFont(boldFont).setBold().setFontSize(12)));
                tableConceptos.addCell(new Cell().add(new Paragraph("S/ " + df.format(nvl(rem.getSueldoNeto()))).setFont(boldFont).setBold().setFontSize(12).setFontColor(new DeviceRgb(5, 150, 105))));
                
                document.add(tableConceptos);
                
                // Pie de página
                document.add(new Paragraph("\n\n"));
                document.add(new Paragraph("Generado el: " + java.time.LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")))
                    .setFont(font)
                    .setFontSize(8)
                    .setTextAlignment(TextAlignment.RIGHT));
            }
            
            log.info("Archivo PDF de boletas generado exitosamente: {}", fileName);
        } catch (IOException e) {
            log.error("Error generando PDF de boletas", e);
            throw new Exception("Error al generar PDF de boletas: " + e.getMessage(), e);
        }
        
        return cargarArchivoComoRecurso(fileName);
    }

    /**
     * Carga un archivo como Resource para descarga
     */
    private Resource cargarArchivoComoRecurso(String fileName) throws Exception {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                log.info("Archivo encontrado y listo para descargar: {}", filePath);
                return resource;
            } else {
                log.error("Archivo no encontrado o no legible en la ruta: {}", filePath);
                throw new Exception("Archivo no encontrado en el sistema: " + fileName);
            }
        } catch (MalformedURLException ex) {
            log.error("Error al construir URI para el archivo: {}", fileName, ex);
            throw new Exception("Error al construir la ruta del archivo: " + fileName, ex);
        }
    }

    /**
     * Formatea el periodo de YYYYMM a MM/YYYY
     */
    private String formatPeriodo(String periodo) {
        if (periodo == null || periodo.length() != 6) {
            return periodo;
        }
        String year = periodo.substring(0, 4);
        String month = periodo.substring(4, 6);
        return month + "/" + year;
    }

    /**
     * Devuelve BigDecimal.ZERO si el valor es null
     */
    private BigDecimal nvl(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }

    /**
     * Devuelve string vacío si el valor es null
     */
    private String nvl(String value) {
        return value == null ? "" : value;
    }
}
