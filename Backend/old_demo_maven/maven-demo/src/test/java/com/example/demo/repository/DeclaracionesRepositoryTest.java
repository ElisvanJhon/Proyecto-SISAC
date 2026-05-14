package com.example.demo.repository;

import com.example.demo.entity.Contribuyentes;
import com.example.demo.entity.Declaraciones;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class DeclaracionesRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private DeclaracionesRepository declaracionesRepository;

    private Contribuyentes contribuyente1;
    private Contribuyentes contribuyente2;

    @BeforeEach
    void setUp() {
        // Configurar datos de prueba
        contribuyente1 = new Contribuyentes();
        contribuyente1.setRuc("20111111111");
        contribuyente1.setRazonSocial("Empresa 1");
        entityManager.persist(contribuyente1);

        contribuyente2 = new Contribuyentes();
        contribuyente2.setRuc("20222222222");
        contribuyente2.setRazonSocial("Empresa 2");
        entityManager.persist(contribuyente2);

        Declaraciones d1 = new Declaraciones();
        d1.setContribuyente(contribuyente1);
        d1.setPeriodo("202510");
        entityManager.persist(d1);

        Declaraciones d2 = new Declaraciones();
        d2.setContribuyente(contribuyente2);
        d2.setPeriodo("202510");
        entityManager.persist(d2);
        
        entityManager.flush();
    }

    @Test
    void testFindByContribuyenteIdAndPeriodo_DebeEncontrarExistente() {
        // --- ACT ---
        // Buscar la declaración para el Contribuyente 1 en el periodo 202510
        Optional<Declaraciones> resultado = declaracionesRepository.findByContribuyenteIdAndPeriodo(
                contribuyente1.getId(), "202510"
        );

        // --- ASSERT ---
        assertTrue(resultado.isPresent(), "Debería encontrar la declaración");
        assertEquals(contribuyente1.getId(), resultado.get().getContribuyente().getId());
        assertEquals("202510", resultado.get().getPeriodo());
    }

    @Test
    void testFindByContribuyenteIdAndPeriodo_NoDebeEncontrarPeriodoIncorrecto() {
        // --- ACT ---
        // Buscar la declaración para el Contribuyente 1 en un periodo que NO existe
        Optional<Declaraciones> resultado = declaracionesRepository.findByContribuyenteIdAndPeriodo(
                contribuyente1.getId(), "202511" // Periodo incorrecto
        );

        // --- ASSERT ---
        assertFalse(resultado.isPresent(), "No debería encontrar la declaración para el periodo 202511");
    }

    @Test
    void testFindByContribuyenteIdAndPeriodo_NoDebeEncontrarContribuyenteIncorrecto() {
        // --- ACT ---
        // Buscar la declaración para un Contribuyente ID que no existe
        Optional<Declaraciones> resultado = declaracionesRepository.findByContribuyenteIdAndPeriodo(
                999L, "202510" // ID de contribuyente incorrecto
        );

        // --- ASSERT ---
        assertFalse(resultado.isPresent(), "No debería encontrar la declaración para el contribuyente 999L");
    }
}