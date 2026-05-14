package com.example.demo.service;

import com.example.demo.entity.*;
import com.example.demo.repository.*;

// --- Imports de POI (Excel) ---
// Importamos POI Cell explícitamente si es necesario, o usamos el nombre completo
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
// ------------------------------

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// --- Imports correctos para iText 7 ---
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Cell; // Importamos Cell de iText
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.layout.properties.VerticalAlignment;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.io.font.constants.StandardFonts;
// -----------------------------------

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.DecimalFormat;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class CierreMensualService {

    private static final Logger log = LoggerFactory.getLogger(CierreMensualService.class);

    @Autowired private DeclaracionesRepository declaracionesRepository;
    @Autowired private RegistroVentasRepository registroVentasRepository;
    @Autowired private RegistroComprasRepository registroComprasRepository;
    @Autowired private ContribuyentesRepository contribuyentesRepository;
    @Autowired private AuditoriaService auditoriaService;

    private final Path fileStorageLocation = Paths.get("sisac_storage/declaraciones").toAbsolutePath().normalize();
    private static final DecimalFormat df = new DecimalFormat("#,##0.00");

    public CierreMensualService() {
        try {
            Files.createDirectories(this.fileStorageLocation);
            log.info("Directorio de almacenamiento de declaraciones verificado/creado en: {}", fileStorageLocation);
        } catch (Exception ex) {
            log.error("No se pudo crear el directorio de almacenamiento de archivos.", ex);
            throw new RuntimeException("No se pudo crear el directorio de almacenamiento de archivos.", ex);
        }
    }

    @Transactional
    public Declaraciones iniciarProcesoCierre(Long contribuyenteId, String periodo, String usuario) throws Exception {
        log.info("Iniciando cierre para contribuyente {} y periodo {}", contribuyenteId, periodo);
        if (!periodo.matches("^\\d{6}$")) {
            log.warn("Formato de periodo inválido: {}", periodo);
            throw new Exception("El formato del periodo debe ser YYYYMM");
        }

        Contribuyentes contribuyente = contribuyentesRepository.findById(contribuyenteId)
            .orElseThrow(() -> new Exception("Contribuyente no encontrado con ID: " + contribuyenteId));
        log.debug("Contribuyente encontrado: {}", contribuyente.getRuc());

        Declaraciones declaracion = declaracionesRepository.findByContribuyenteIdAndPeriodo(contribuyenteId, periodo)
            .orElse(new Declaraciones());
        log.debug("Declaración existente encontrada: {}", declaracion.getId() != null);

        declaracion.setContribuyente(contribuyente);
        declaracion.setPeriodo(periodo);
        declaracion.setEstado("PENDIENTE_CALCULO");

        YearMonth ym = YearMonth.parse(periodo, DateTimeFormatter.ofPattern("yyyyMM"));
        LocalDate inicioMes = ym.atDay(1);
        LocalDate finMes = ym.atEndOfMonth();
        log.debug("Extrayendo registros para el periodo {} a {}", inicioMes, finMes);

        List<RegistroVentas> ventas = registroVentasRepository.findByContribuyenteIdAndFechaBetween(contribuyenteId, inicioMes, finMes);
        List<RegistroCompras> compras = registroComprasRepository.findByContribuyenteIdAndFechaEmisionBetween(contribuyenteId, inicioMes, finMes);
        log.info("Registros encontrados - Ventas: {}, Compras: {}", ventas.size(), compras.size());

        BigDecimal igvDebito = ventas.stream().map(RegistroVentas::getIgv).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal igvCredito = compras.stream().map(RegistroCompras::getIgv).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal igvNeto = igvDebito.subtract(igvCredito);

        BigDecimal baseVentasTotal = ventas.stream().map(RegistroVentas::getMontoTotal).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal coeficienteRenta = new BigDecimal("0.015"); // TODO: Obtener de parametros_tributarios o configuración
        BigDecimal renta = baseVentasTotal.multiply(coeficienteRenta).setScale(2, RoundingMode.HALF_UP);

        BigDecimal baseImponibleRenta = BigDecimal.ZERO;
        if (coeficienteRenta.compareTo(BigDecimal.ZERO) != 0) {
            baseImponibleRenta = renta.divide(coeficienteRenta, 2, RoundingMode.HALF_UP);
        } else {
             baseImponibleRenta = baseVentasTotal;
        }
        log.debug("Cálculos: IGV Débito={}, IGV Crédito={}, IGV Neto={}, Renta={}, Base Renta={}", igvDebito, igvCredito, igvNeto, renta, baseImponibleRenta);


        declaracion.setIgvDebito(igvDebito);
        declaracion.setIgvCredito(igvCredito);
        declaracion.setIgvNeto(igvNeto);
        declaracion.setRentaPagoCuenta(renta);

        String baseFileName = "Declaracion_" + periodo + "_" + contribuyente.getRuc();
        String borradorPath = generarBorradorCalculo(baseFileName, ventas, compras, declaracion);
        String form621PdfPath = generarForm621Pdf(baseFileName + "_Form621.pdf", declaracion, baseImponibleRenta);
        String resumenIgvPdfPath = generarResumenIgvPdf(baseFileName + "_ResumenIGV.pdf", declaracion);
        String libroVentasPath = simularCreacionArchivo(baseFileName + "_LibroVentas.xlsx");
        String libroComprasPath = simularCreacionArchivo(baseFileName + "_LibroCompras.xlsx");
        log.info("Archivos generados (o simulados): Borrador={}, Form621={}, Resumen={}, LibroVentas={}, LibroCompras={}", borradorPath, form621PdfPath, resumenIgvPdfPath, libroVentasPath, libroComprasPath);

        declaracion.setForm621Pdf(form621PdfPath);
        declaracion.setResumenIgvPdf(resumenIgvPdfPath);
        declaracion.setLibroVentasXlsx(libroVentasPath);
        declaracion.setLibroComprasXlsx(libroComprasPath);

        String paqueteZipPath = generarPaqueteZip(baseFileName, Map.of(
            "BorradorCalculo.xlsx", borradorPath,
            form621PdfPath, form621PdfPath,
            resumenIgvPdfPath, resumenIgvPdfPath
        ));
        declaracion.setPaqueteZip(paqueteZipPath);
        log.info("Paquete ZIP generado: {}", paqueteZipPath);

        declaracion.setEstado("PENDIENTE_APROBACION");

        Declaraciones savedDeclaracion = declaracionesRepository.save(declaracion);
        auditoriaService.registrar(usuario, "Declaraciones", "CALCULO_CIERRE", null, savedDeclaracion);
        log.info("Declaración ID {} guardada con estado PENDIENTE_APROBACION", savedDeclaracion.getId());

        System.out.println("NOTIFICACION: Declaración " + periodo + " lista para revisión.");

        return savedDeclaracion;
    }

    @Transactional
    public Declaraciones aprobarDeclaracion(Long declaracionId, String usuario, boolean aprobado) throws Exception {
        log.info("Intentando aprobar/rechazar declaración ID {} por usuario {}", declaracionId, usuario);
        Declaraciones declaracion = declaracionesRepository.findById(declaracionId)
            .orElseThrow(() -> new Exception("Declaración no encontrada con ID: " + declaracionId));

        if (!"PENDIENTE_APROBACION".equals(declaracion.getEstado())) {
            log.warn("Intento de aprobar/rechazar declaración ID {} con estado incorrecto: {}", declaracionId, declaracion.getEstado());
            throw new Exception("La declaración no está pendiente de aprobación");
        }

        Declaraciones oldDeclaracion = clonarDeclaracion(declaracion);

        if (aprobado) {
            declaracion.setEstado("APROBADO_LISTO_PRESENTAR");
            auditoriaService.registrar(usuario, "Declaraciones", "APROBADO", oldDeclaracion, declaracion);
            log.info("Declaración ID {} APROBADA por {}", declaracionId, usuario);
            // TODO: Actualizar calendario_obligaciones si aplica
        } else {
            declaracion.setEstado("RECHAZADO_AJUSTES");
            // TODO: Crear lógica para "ListaAjustes"
            auditoriaService.registrar(usuario, "Declaraciones", "RECHAZADO", oldDeclaracion, declaracion);
            log.info("Declaración ID {} RECHAZADA por {}", declaracionId, usuario);
        }

        return declaracionesRepository.save(declaracion);
    }

    // --- Métodos de Archivos ---

    private String generarBorradorCalculo(String baseFileName, List<RegistroVentas> ventas, List<RegistroCompras> compras, Declaraciones d) throws IOException {
        String fileName = baseFileName + "_BorradorCalculo.xlsx";
        Path filePath = this.fileStorageLocation.resolve(fileName);
        log.debug("Generando borrador Excel en: {}", filePath);

        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            XSSFSheet sheet = workbook.createSheet("Resumen");

            Row header = sheet.createRow(0);
            // Usar nombre completo de POI Cell para evitar ambigüedad si es necesario
            org.apache.poi.ss.usermodel.Cell headerCell0 = header.createCell(0);
            headerCell0.setCellValue("Concepto");
            org.apache.poi.ss.usermodel.Cell headerCell1 = header.createCell(1);
            headerCell1.setCellValue("Monto");

            Row r1 = sheet.createRow(1);
            r1.createCell(0).setCellValue("IGV Débito (Ventas)");
            r1.createCell(1).setCellValue(d.getIgvDebito() != null ? d.getIgvDebito().doubleValue() : 0.0);

            Row r2 = sheet.createRow(2);
            r2.createCell(0).setCellValue("IGV Crédito (Compras)");
            r2.createCell(1).setCellValue(d.getIgvCredito() != null ? d.getIgvCredito().doubleValue() : 0.0);

            Row r3 = sheet.createRow(3);
            r3.createCell(0).setCellValue("IGV Neto a Pagar");
            r3.createCell(1).setCellValue(d.getIgvNeto() != null ? d.getIgvNeto().doubleValue() : 0.0);

            Row r4 = sheet.createRow(4);
            r4.createCell(0).setCellValue("Renta Pago a Cuenta");
            r4.createCell(1).setCellValue(d.getRentaPagoCuenta() != null ? d.getRentaPagoCuenta().doubleValue() : 0.0);

            try (FileOutputStream outputStream = new FileOutputStream(filePath.toFile())) {
                workbook.write(outputStream);
            }
            log.debug("Borrador Excel generado exitosamente.");
        } catch (IOException e) {
             log.error("Error generando borrador Excel {}", fileName, e);
             throw e;
        }
        return fileName;
    }

    private String generarForm621Pdf(String fileName, Declaraciones d, BigDecimal baseRentaCalculada) throws IOException {
        Path filePath = this.fileStorageLocation.resolve(fileName);
        log.debug("Generando Form621 PDF en: {}", filePath);
        Contribuyentes c = d.getContribuyente();
        String periodoStr = formatPeriodo(d.getPeriodo());

        PdfFont font = PdfFontFactory.createFont(StandardFonts.HELVETICA);
        PdfFont boldFont = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);

        try (PdfWriter writer = new PdfWriter(filePath.toString());
             PdfDocument pdf = new PdfDocument(writer);
             Document document = new Document(pdf, PageSize.A4)) {

            document.setMargins(30, 30, 30, 30);

            addHeader(document, periodoStr, c.getRuc(), c.getRazonSocial(), "1");

            document.add(new Paragraph("IGV VENTAS - IGV CUENTA PROPIA").setFont(boldFont).setFontSize(10));
            Table ventasTable = new Table(UnitValue.createPercentArray(new float[]{40, 10, 20, 10, 20})).useAllAvailableWidth();
            addCell(ventasTable, "Concepto", boldFont, TextAlignment.LEFT);
            addCell(ventasTable, "Casilla", boldFont, TextAlignment.CENTER);
            addCell(ventasTable, "Base Imponible", boldFont, TextAlignment.RIGHT);
            addCell(ventasTable, "Casilla", boldFont, TextAlignment.CENTER);
            addCell(ventasTable, "Tributo", boldFont, TextAlignment.RIGHT);

            BigDecimal baseVentas = calculateBase(d.getIgvDebito());
            addTableRow(ventasTable, "Ventas Netas Gravadas", "100", baseVentas, "101", d.getIgvDebito(), font);
            addTableRow(ventasTable, "Descuentos Concedidos...", "102", BigDecimal.ZERO, "103", BigDecimal.ZERO, font);
            addTableRow(ventasTable, "Total", "", null, "131", d.getIgvDebito(), boldFont);
            document.add(ventasTable);
            document.add(new Paragraph("\n"));

             document.add(new Paragraph("IGV COMPRAS - IGV CUENTA PROPIA").setFont(boldFont).setFontSize(10));
             Table comprasTable = new Table(UnitValue.createPercentArray(new float[]{40, 10, 20, 10, 20})).useAllAvailableWidth();
             addCell(comprasTable, "Concepto", boldFont, TextAlignment.LEFT);
             addCell(comprasTable, "Casilla", boldFont, TextAlignment.CENTER);
             addCell(comprasTable, "Base Imponible", boldFont, TextAlignment.RIGHT);
             addCell(comprasTable, "Casilla", boldFont, TextAlignment.CENTER);
             addCell(comprasTable, "Tributo", boldFont, TextAlignment.RIGHT);

             BigDecimal baseCompras = calculateBase(d.getIgvCredito());
             addTableRow(comprasTable, "Compras Netas Gravadas (Dest. Ventas Gravadas)", "107", baseCompras, "108", d.getIgvCredito(), font);
             addTableRow(comprasTable, "Total", "", null, "178", d.getIgvCredito(), boldFont);
             document.add(comprasTable);

             document.add(new Paragraph("\n\nPAGOS A CUENTA DE RENTA").setFont(boldFont).setFontSize(10));
             Table rentaTable = new Table(UnitValue.createPercentArray(new float[]{50, 15, 20, 15})).useAllAvailableWidth();
             addCell(rentaTable, "Concepto", boldFont, TextAlignment.LEFT);
             addCell(rentaTable, "Casilla", boldFont, TextAlignment.CENTER);
             addCell(rentaTable, "Monto Base", boldFont, TextAlignment.RIGHT);
             addCell(rentaTable, "Tributo", boldFont, TextAlignment.RIGHT);

             addCell(rentaTable, "Ingreso Neto", font, TextAlignment.LEFT);
             addCell(rentaTable, "301", font, TextAlignment.CENTER);
             addCell(rentaTable, formatDecimal(baseRentaCalculada), font, TextAlignment.RIGHT);
             addCell(rentaTable, "", font, TextAlignment.RIGHT);

             addCell(rentaTable, "Impuesto a la Renta 3ra Cat.", font, TextAlignment.LEFT);
             addCell(rentaTable, "", font, TextAlignment.CENTER);
             addCell(rentaTable, "", font, TextAlignment.RIGHT);
             addCell(rentaTable, "312\n" + formatDecimal(d.getRentaPagoCuenta()), font, TextAlignment.RIGHT);
             document.add(rentaTable);

            document.add(new Paragraph("\n\nDETERMINACION DE LA DEUDA").setFont(boldFont).setFontSize(10));

            Table deudaIgvTable = new Table(UnitValue.createPercentArray(new float[]{60, 15, 25})).useAllAvailableWidth();
            addCell(deudaIgvTable, "IGV", boldFont, TextAlignment.LEFT);
            addCell(deudaIgvTable, "Casilla", boldFont, TextAlignment.CENTER);
            addCell(deudaIgvTable, "Importe", boldFont, TextAlignment.RIGHT);
            addDeudaRow(deudaIgvTable, "IMPUESTO RESULTANTE O SALDO A FAVOR", "140", d.getIgvNeto(), font);
            addDeudaRow(deudaIgvTable, "SALDO A FAVOR DEL PERIODO ANTERIOR", "145", BigDecimal.ZERO, font);
            addDeudaRow(deudaIgvTable, "TRIBUTO A PAGAR O SALDO A FAVOR", "184", d.getIgvNeto(), font);
            addDeudaRow(deudaIgvTable, "PERCEPCIONES DECLARADAS EN EL PERIODO", "171", BigDecimal.ZERO, font);
             addDeudaRow(deudaIgvTable, "SALDO DE PERCEPCIONES NO APLICADAS", "164", BigDecimal.ZERO, font);
             addDeudaRow(deudaIgvTable, "RETENCIONES DECLARADAS EN EL PERIODO", "179", BigDecimal.ZERO, font);
             addDeudaRow(deudaIgvTable, "SALDO DE RETENCIONES NO APLICADAS", "165", BigDecimal.ZERO, font);
             addDeudaRow(deudaIgvTable, "PAGOS PREVIOS", "185", BigDecimal.ZERO, font);
            addDeudaRow(deudaIgvTable, "INTERES MORATORIO", "187", BigDecimal.ZERO, font);
            addDeudaRow(deudaIgvTable, "TOTAL DEUDA TRIBUTARIA", "188", d.getIgvNeto(), boldFont);
            addDeudaRow(deudaIgvTable, "IMPORTE A PAGAR", "189", d.getIgvNeto(), boldFont);
            document.add(deudaIgvTable);
            document.add(new Paragraph("\n"));

            Table deudaRentaTable = new Table(UnitValue.createPercentArray(new float[]{60, 15, 25})).useAllAvailableWidth();
            addCell(deudaRentaTable, "RENTA", boldFont, TextAlignment.LEFT);
            addCell(deudaRentaTable, "Casilla", boldFont, TextAlignment.CENTER);
            addCell(deudaRentaTable, "Importe", boldFont, TextAlignment.RIGHT);
            addDeudaRow(deudaRentaTable, "IMPUESTO RESULTANTE O SALDO A FAVOR", "302", d.getRentaPagoCuenta(), font);
            addDeudaRow(deudaRentaTable, "SALDO A FAVOR DEL PERIODO ANTERIOR", "303", BigDecimal.ZERO, font);
            addDeudaRow(deudaRentaTable, "TRIBUTO A PAGAR O SALDO A FAVOR", "304", d.getRentaPagoCuenta(), font);
            addDeudaRow(deudaRentaTable, "PAGOS PREVIOS", "317", BigDecimal.ZERO, font);
            addDeudaRow(deudaRentaTable, "INTERES MORATORIO", "319", BigDecimal.ZERO, font);
            addDeudaRow(deudaRentaTable, "TOTAL DEUDA TRIBUTARIA", "324", d.getRentaPagoCuenta(), boldFont);
            addDeudaRow(deudaRentaTable, "IMPORTE A PAGAR", "307", d.getRentaPagoCuenta(), boldFont);
            document.add(deudaRentaTable);
             document.add(new Paragraph("\n"));

             BigDecimal totalPagar = zeroIfNull(d.getIgvNeto()).add(zeroIfNull(d.getRentaPagoCuenta()));
             Table pagoTotalTable = new Table(UnitValue.createPercentArray(new float[]{75, 25})).useAllAvailableWidth();
             addCell(pagoTotalTable, "IMPORTE TOTAL A PAGAR:", boldFont, TextAlignment.RIGHT);
             addCell(pagoTotalTable, formatDecimal(totalPagar), boldFont, TextAlignment.RIGHT);
             addCell(pagoTotalTable, "EFECTIVO", font, TextAlignment.LEFT);
             addCell(pagoTotalTable, formatDecimal(totalPagar), font, TextAlignment.RIGHT);
             document.add(pagoTotalTable);

        } catch (IOException e) {
             log.error("Error generando Form621 PDF {}", fileName, e);
             throw e;
        }
        log.debug("Form621 PDF generado exitosamente.");
        return fileName;
    }

     private String generarResumenIgvPdf(String fileName, Declaraciones d) throws IOException {
         Path filePath = this.fileStorageLocation.resolve(fileName);
         log.debug("Generando ResumenIGV PDF en: {}", filePath);
         Contribuyentes c = d.getContribuyente();
         String periodoStr = formatPeriodo(d.getPeriodo());

         PdfFont font = PdfFontFactory.createFont(StandardFonts.HELVETICA);
         PdfFont boldFont = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);

         try (PdfWriter writer = new PdfWriter(filePath.toString());
              PdfDocument pdf = new PdfDocument(writer);
              Document document = new Document(pdf, PageSize.A4)) {

             document.setMargins(50, 50, 50, 50);

             document.add(new Paragraph("RESUMEN DE CÁLCULO IGV").setFont(boldFont).setFontSize(14).setTextAlignment(TextAlignment.CENTER));
             document.add(new Paragraph("Periodo: " + periodoStr).setFont(font).setFontSize(10).setTextAlignment(TextAlignment.CENTER));
             document.add(new Paragraph("Contribuyente: " + c.getRuc() + " - " + c.getRazonSocial()).setFont(font).setFontSize(10).setTextAlignment(TextAlignment.CENTER));
             document.add(new Paragraph("\n\n"));

             Table resumenTable = new Table(UnitValue.createPercentArray(new float[]{70, 30})).useAllAvailableWidth();
             addCell(resumenTable, "Concepto", boldFont, TextAlignment.LEFT);
             addCell(resumenTable, "Monto (S/)", boldFont, TextAlignment.RIGHT);

             addDeudaRow(resumenTable, "(+) IGV Débito Fiscal (Ventas)", null, d.getIgvDebito(), font);
             addDeudaRow(resumenTable, "(-) IGV Crédito Fiscal (Compras)", null, d.getIgvCredito(), font);
             addDeudaRow(resumenTable, "(=) Impuesto Resultante (IGV Neto)", null, d.getIgvNeto(), boldFont);

             document.add(resumenTable);
         } catch (IOException e) {
              log.error("Error generando ResumenIGV PDF {}", fileName, e);
              throw e;
         }
         log.debug("ResumenIGV PDF generado exitosamente.");
         return fileName;
     }

    // --- Helpers iText ---
    private void addHeader(Document document, String periodo, String ruc, String razonSocial, String pageNum) throws IOException {
        PdfFont boldFont = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
        PdfFont font = PdfFontFactory.createFont(StandardFonts.HELVETICA);

        Table headerTable = new Table(UnitValue.createPercentArray(new float[]{30, 40, 30})).useAllAvailableWidth();
        // Usar nombre completo de iText Cell
        headerTable.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph("SUNAT").setFont(boldFont)).setBorder(Border.NO_BORDER));
        headerTable.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph("DECLARACION\nPDT IGV-RENTA MENSUAL").setFont(boldFont).setTextAlignment(TextAlignment.CENTER)).setBorder(Border.NO_BORDER));
        headerTable.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph("Periodo " + periodo + "\nCopia Contribuyente (Pag. " + pageNum + ")").setFont(font).setFontSize(8).setTextAlignment(TextAlignment.RIGHT)).setBorder(Border.NO_BORDER));

        headerTable.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph("RUC\n" + ruc).setFont(font).setFontSize(8)).setBorder(Border.NO_BORDER));
        headerTable.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph("PAGO\n621").setFont(boldFont).setTextAlignment(TextAlignment.CENTER)).setBorder(Border.NO_BORDER));
        headerTable.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph("RAZON SOCIAL\n" + razonSocial).setFont(font).setFontSize(8).setTextAlignment(TextAlignment.RIGHT)).setBorder(Border.NO_BORDER));

        document.add(headerTable);
    }

    private void addCell(Table table, String text, PdfFont font, TextAlignment alignment) {
        Paragraph p = new Paragraph(text != null ? text : "").setFont(font).setFontSize(8);
        // Usar nombre completo de iText Cell
        com.itextpdf.layout.element.Cell cell = new com.itextpdf.layout.element.Cell().add(p).setTextAlignment(alignment).setPadding(2).setVerticalAlignment(VerticalAlignment.MIDDLE);
        table.addCell(cell);
    }

    private void addTableRow(Table table, String concepto, String casillaBase, BigDecimal montoBase, String casillaTributo, BigDecimal montoTributo, PdfFont font) throws IOException{
        addCell(table, concepto, font, TextAlignment.LEFT);
        addCell(table, casillaBase != null ? casillaBase : "", font, TextAlignment.CENTER);
        addCell(table, formatDecimal(montoBase), font, TextAlignment.RIGHT);
        addCell(table, casillaTributo != null ? casillaTributo : "", font, TextAlignment.CENTER);
        addCell(table, formatDecimal(montoTributo), font, TextAlignment.RIGHT);
    }

    private void addDeudaRow(Table table, String concepto, String casilla, BigDecimal importe, PdfFont font) throws IOException {
        addCell(table, concepto, font, TextAlignment.LEFT);
        addCell(table, casilla != null ? casilla : "", font, TextAlignment.CENTER);
        addCell(table, formatDecimal(importe), font, TextAlignment.RIGHT);
    }

    // --- Otros Helpers ---
     private String formatDecimal(BigDecimal value) {
        return df.format(zeroIfNull(value));
    }

     private BigDecimal calculateBase(BigDecimal tributo) {
         BigDecimal safeTributo = zeroIfNull(tributo);
         if (safeTributo.compareTo(BigDecimal.ZERO) == 0) {
             return BigDecimal.ZERO;
         }
         BigDecimal tasa = new BigDecimal("0.18"); // TODO: Obtener de parametros_tributarios
         if (tasa.compareTo(BigDecimal.ZERO) == 0) return BigDecimal.ZERO;
         return safeTributo.divide(tasa, 2, RoundingMode.HALF_UP);
     }

      private String formatPeriodo(String periodoYYYYMM) {
          try {
              YearMonth ym = YearMonth.parse(periodoYYYYMM, DateTimeFormatter.ofPattern("yyyyMM"));
              return ym.format(DateTimeFormatter.ofPattern("MM-yyyy"));
          } catch (Exception e) {
              log.warn("Error formateando periodo {}", periodoYYYYMM, e);
              return periodoYYYYMM;
          }
      }

    private String simularCreacionArchivo(String fileName) throws IOException {
        Path filePath = this.fileStorageLocation.resolve(fileName);
        if (!Files.exists(filePath)) {
             log.debug("Simulando creación de archivo vacío: {}", filePath);
            Files.createFile(filePath);
        }
        return fileName;
    }

    private String generarPaqueteZip(String baseFileName, Map<String, String> archivos) throws IOException {
        String zipFileName = baseFileName + "_PaqueteDeclaracion.zip";
        Path zipFilePath = this.fileStorageLocation.resolve(zipFileName);
        log.debug("Generando paquete ZIP en: {}", zipFilePath);

        try (ZipOutputStream zos = new ZipOutputStream(new FileOutputStream(zipFilePath.toFile()))) {
            for (Map.Entry<String, String> entry : archivos.entrySet()) {
                String entryName = Paths.get(entry.getKey()).getFileName().toString();
                Path filePath = this.fileStorageLocation.resolve(entry.getValue());
                File fileToZip = filePath.toFile();

                if (fileToZip.exists()) {
                    log.debug("Añadiendo archivo {} al ZIP como {}", filePath, entryName);
                    zos.putNextEntry(new ZipEntry(entryName));
                    Files.copy(filePath, zos);
                    zos.closeEntry();
                } else {
                    log.warn("Archivo no encontrado para añadir al ZIP: {}", filePath);
                }
            }
        } catch (IOException e) {
             log.error("Error generando paquete ZIP {}", zipFileName, e);
             throw e;
        }
        log.debug("Paquete ZIP generado exitosamente.");
        return zipFileName;
    }

    public Resource cargarArchivoComoRecurso(Long declaracionId, String tipoArchivo) throws Exception {
        log.debug("Solicitud de descarga para declaración ID {} y tipo {}", declaracionId, tipoArchivo);
        Declaraciones declaracion = declaracionesRepository.findById(declaracionId)
            .orElseThrow(() -> new Exception("Declaración no encontrada con ID: " + declaracionId));

        String fileName = "";
        switch (tipoArchivo) {
            case "borrador":
                String expectedBorradorName = "Declaracion_" + declaracion.getPeriodo() + "_" + declaracion.getContribuyente().getRuc() + "_BorradorCalculo.xlsx";
                fileName = expectedBorradorName;
                break;
            case "form621": fileName = Optional.ofNullable(declaracion.getForm621Pdf()).orElseThrow(() -> new Exception("Ruta del archivo Form621 no encontrada en la declaración")); break;
            case "resumen": fileName = Optional.ofNullable(declaracion.getResumenIgvPdf()).orElseThrow(() -> new Exception("Ruta del archivo Resumen IGV no encontrada en la declaración")); break;
            case "paquete": fileName = Optional.ofNullable(declaracion.getPaqueteZip()).orElseThrow(() -> new Exception("Ruta del archivo Paquete ZIP no encontrada en la declaración")); break;
            default:
                log.warn("Tipo de archivo no válido solicitado: {}", tipoArchivo);
                throw new Exception("Tipo de archivo no válido: " + tipoArchivo);
        }
         log.debug("Nombre de archivo determinado para descarga: {}", fileName);

        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if(resource.exists() && resource.isReadable()) {
                 log.info("Archivo encontrado y listo para descargar: {}", filePath);
                return resource;
            } else {
                 log.error("Archivo no encontrado o no legible en la ruta: {}", filePath);
                throw new Exception("Archivo no encontrado en el sistema: " + fileName);
            }
        } catch (MalformedURLException ex) {
             log.error("Error al construir URI para el archivo: {}", fileName, ex);
            throw new Exception("Error al construir la ruta del archivo: " + fileName, ex);
        } catch (IOException ex) {
            log.error("Error de I/O al acceder al archivo: {}", fileName, ex);
            throw new Exception("Error al leer el archivo: " + fileName, ex);
        }
    }

     private Declaraciones clonarDeclaracion(Declaraciones original) {
        Declaraciones clon = new Declaraciones();
        clon.setId(original.getId());
        clon.setContribuyente(original.getContribuyente());
        clon.setPeriodo(original.getPeriodo());
        clon.setIgvDebito(original.getIgvDebito());
        clon.setIgvCredito(original.getIgvCredito());
        clon.setIgvNeto(original.getIgvNeto());
        clon.setRentaPagoCuenta(original.getRentaPagoCuenta());
        clon.setForm621Pdf(original.getForm621Pdf());
        clon.setResumenIgvPdf(original.getResumenIgvPdf());
        clon.setLibroVentasXlsx(original.getLibroVentasXlsx());
        clon.setLibroComprasXlsx(original.getLibroComprasXlsx());
        clon.setPaqueteZip(original.getPaqueteZip());
        clon.setEstado(original.getEstado());
        clon.setCreatedAt(original.getCreatedAt());
        return clon;
    }

    private BigDecimal zeroIfNull(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }
}