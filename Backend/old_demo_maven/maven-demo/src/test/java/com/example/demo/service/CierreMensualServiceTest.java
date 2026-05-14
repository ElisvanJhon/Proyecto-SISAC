package com.example.demo.service;

import com.example.demo.entity.*;
import com.example.demo.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CierreMensualServiceTest {

    @Mock
    private DeclaracionesRepository declaracionesRepository;
    @Mock
    private RegistroVentasRepository registroVentasRepository;
    @Mock
    private RegistroComprasRepository registroComprasRepository;
    @Mock
    private ContribuyentesRepository contribuyentesRepository;
    @Mock
    private AuditoriaService auditoriaService;

    @InjectMocks
    private CierreMensualService cierreMensualService;

    private Contribuyentes contribuyente;
    private RegistroVentas venta1, venta2;
    private RegistroCompras compra1;
    private Declaraciones declaracionGenerada;

    @BeforeEach
    void setUp() {
        // 1. Configurar el Contribuyente
        contribuyente = new Contribuyentes();
        contribuyente.setId(1L);
        contribuyente.setRuc("20123456789");
        contribuyente.setRazonSocial("Empresa de Prueba SAC");

        // 2. Configurar Ventas (IGV Débito)
        venta1 = new RegistroVentas();
        venta1.setIgv(new BigDecimal("18.00"));
        venta1.setMontoTotal(new BigDecimal("118.00"));
        venta2 = new RegistroVentas();
        venta2.setIgv(new BigDecimal("36.00"));
        venta2.setMontoTotal(new BigDecimal("236.00"));

        // 3. Configurar Compras (IGV Crédito)
        compra1 = new RegistroCompras();
        compra1.setIgv(new BigDecimal("10.00"));

        // 4. Configurar la Declaración que se guardará
        declaracionGenerada = new Declaraciones();
        declaracionGenerada.setId(100L);
        declaracionGenerada.setContribuyente(contribuyente);
        declaracionGenerada.setPeriodo("202510");
        declaracionGenerada.setEstado("PENDIENTE_APROBACION");
        // Los valores de IGV serán seteados por el servicio
    }

    @Test
    void testIniciarProcesoCierre_CalculoExitoso() throws Exception {
        // --- ARRANGE (Organizar Mocks) ---
        String periodo = "202510";
        String usuario = "test.user@sisac.com";
        Long contribuyenteId = 1L;

        // Mockear búsquedas
        when(contribuyentesRepository.findById(contribuyenteId)).thenReturn(Optional.of(contribuyente));
        when(declaracionesRepository.findByContribuyenteIdAndPeriodo(contribuyenteId, periodo)).thenReturn(Optional.empty()); // Es una nueva declaración

        // Mockear los datos que se suman
        when(registroVentasRepository.findByContribuyenteIdAndFechaBetween(anyLong(), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(List.of(venta1, venta2));
        when(registroComprasRepository.findByContribuyenteIdAndFechaEmisionBetween(anyLong(), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(List.of(compra1));

        // Mockear el guardado
        when(declaracionesRepository.save(any(Declaraciones.class))).thenAnswer(invocation -> {
            Declaraciones d = invocation.getArgument(0);
            // Simular que la BD asigna los valores calculados al objeto
            declaracionGenerada.setIgvDebito(d.getIgvDebito());
            declaracionGenerada.setIgvCredito(d.getIgvCredito());
            declaracionGenerada.setIgvNeto(d.getIgvNeto());
            declaracionGenerada.setRentaPagoCuenta(d.getRentaPagoCuenta());
            declaracionGenerada.setEstado(d.getEstado());
            // ... (ignorar paths de archivos para este test unitario) ...
            return declaracionGenerada;
        });

        // --- ACT (Ejecutar el método) ---
        Declaraciones resultado = cierreMensualService.iniciarProcesoCierre(contribuyenteId, periodo, usuario);

        // --- ASSERT (Verificar Resultados) ---
        assertNotNull(resultado);
        assertEquals(contribuyenteId, resultado.getContribuyente().getId());
        assertEquals("PENDIENTE_APROBACION", resultado.getEstado());

        // Verificar Cálculos (2 ventas, 1 compra)
        // IGV Débito (Ventas): 18.00 + 36.00 = 54.00
        assertEquals(0, new BigDecimal("54.00").compareTo(resultado.getIgvDebito()));
        // IGV Crédito (Compras): 10.00
        assertEquals(0, new BigDecimal("10.00").compareTo(resultado.getIgvCredito()));
        // IGV Neto (Débito - Crédito): 54.00 - 10.00 = 44.00
        assertEquals(0, new BigDecimal("44.00").compareTo(resultado.getIgvNeto()));
        
        // Verificar Renta (Base Ventas * 0.015)
        // Base Ventas: 118.00 + 236.00 = 354.00
        // Renta: 354.00 * 0.015 = 5.31
        assertEquals(0, new BigDecimal("5.31").compareTo(resultado.getRentaPagoCuenta()));

        // Verificar que se llamó a guardar y auditar
        verify(declaracionesRepository, times(1)).save(any(Declaraciones.class));
        verify(auditoriaService, times(1)).registrar(eq(usuario), eq("Declaraciones"), eq("CALCULO_CIERRE"), any(), any());
    }
}