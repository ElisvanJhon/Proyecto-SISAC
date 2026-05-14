package com.example.demo.controller;

import com.example.demo.dto.ConfiguracionResponseDTO;
import com.example.demo.dto.ParametrosTributariosDTO;
import com.example.demo.entity.Contribuyentes;
import com.example.demo.entity.ParametrosTributarios;
import com.example.demo.service.ConfiguracionService;
import com.example.demo.service.UserDetailsServiceImpl;
import com.example.demo.util.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ConfiguracionController.class)
class ConfiguracionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper; // Para convertir DTOs a JSON

    // Mockeamos todos los @Autowired del controlador y la seguridad
    @MockBean
    private ConfiguracionService configuracionService;
    @MockBean
    private JwtUtil jwtUtil;
    @MockBean
    private UserDetailsServiceImpl userDetailsService; // Requerido por SecurityConfig

    
    // Test 1: GET /api/tax/config (Protegido por ROL)
    @Test
    @WithMockUser(roles = "ADMIN_TRIBUTARIO") // Simula un usuario logueado con el rol correcto
    void testGetConfiguracion_ConRolValido_DebeRetornarOk() throws Exception {
        // --- ARRANGE ---
        // 1. Preparar la data de respuesta del servicio mockeado
        Contribuyentes c = new Contribuyentes();
        c.setId(1L);
        c.setRuc("20123456789");
        c.setRazonSocial("Empresa Test");

        ParametrosTributarios p = new ParametrosTributarios();
        p.setTasaIgv(new BigDecimal("18.0"));

        ConfiguracionResponseDTO mockResponse = new ConfiguracionResponseDTO();
        mockResponse.setContribuyente(c);
        mockResponse.setParametros(p);
        mockResponse.setCantidadProductos(50L);

        // 2. Simular el comportamiento del servicio
        // El controlador asume ID 1L, así que mockeamos la llamada a getConfiguracion(1L)
        when(configuracionService.getConfiguracion(1L)).thenReturn(mockResponse);
        // El controlador también usa JwtUtil para sacar el ID 1L (basado en el código)
        when(jwtUtil.extractContribuyenteIdFromToken(anyString())).thenReturn(1L);


        // --- ACT & ASSERT ---
        mockMvc.perform(get("/api/tax/config")
                        .header("Authorization", "Bearer faketoken")) // El token es necesario para el método
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.contribuyente.ruc", is("20123456789")))
                .andExpect(jsonPath("$.parametros.tasaIgv", is(18.0)))
                .andExpect(jsonPath("$.cantidadProductos", is(50)));
    }

    // Test 2: GET /api/tax/config (Protegido por ROL - Caso de fallo)
    @Test
    @WithMockUser(roles = "GESTOR_PLANILLA") // Simula un usuario con ROL INCORRECTO
    void testGetConfiguracion_ConRolInvalido_DebeRetornarForbidden() throws Exception {
        
        // --- ACT & ASSERT ---
        // Spring Security (activado por @WebMvcTest) debe bloquear esto
        mockMvc.perform(get("/api/tax/config")
                        .header("Authorization", "Bearer faketoken"))
                .andExpect(status().isForbidden());
    }

    // Test 3: POST /api/tax/config/parametros
    @Test
    @WithMockUser(username = "rafael.ramirez", roles = "ADMIN_TRIBUTARIO")
    void testGuardarParametros_DebeRetornarOk() throws Exception {
        // --- ARRANGE ---
        // 1. El DTO que enviaremos en el POST
        ParametrosTributariosDTO dtoRequest = new ParametrosTributariosDTO();
        dtoRequest.setTasaIgv(new BigDecimal("18.0"));

        // 2. El DTO de respuesta que esperamos del servicio
        ConfiguracionResponseDTO mockResponse = new ConfiguracionResponseDTO();
        ParametrosTributarios p = new ParametrosTributarios();
        p.setTasaIgv(new BigDecimal("18.0"));
        mockResponse.setParametros(p);

        // 3. Mockear el JwtUtil (el controlador lo usa para obtener el 'usuario')
        when(jwtUtil.extractUsername("faketoken")).thenReturn("rafael.ramirez");

        // 4. Mockear el servicio
        when(configuracionService.guardarParametros(anyLong(), any(ParametrosTributariosDTO.class), anyString()))
                .thenReturn(mockResponse);

        // --- ACT & ASSERT ---
        mockMvc.perform(post("/api/tax/config/parametros")
                        .header("Authorization", "Bearer faketoken")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dtoRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.parametros.tasaIgv", is(18.0)));
    }
}