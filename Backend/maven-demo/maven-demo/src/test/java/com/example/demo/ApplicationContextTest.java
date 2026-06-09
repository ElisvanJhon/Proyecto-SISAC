package com.example.demo;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.platform.launcher.Launcher;
import org.junit.platform.launcher.LauncherDiscoveryRequest;
import org.junit.platform.launcher.core.LauncherDiscoveryRequestBuilder;
import org.junit.platform.launcher.core.LauncherFactory;
import org.junit.platform.launcher.listeners.SummaryGeneratingListener;
import org.junit.platform.launcher.listeners.TestExecutionSummary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.platform.engine.discovery.DiscoverySelectors.selectClass;

@SpringBootTest
@ActiveProfiles("test")
@DisplayName("Tests de Contexto de Aplicación")
public class ApplicationContextTest {

    @Autowired
    private ApplicationContext applicationContext;
    
    
    
    public static void main(String[] args) {
        System.out.println("=================================================");
        System.out.println("🚀 EJECUTANDO: ApplicationContextTest");
        System.out.println("=================================================");

        LauncherDiscoveryRequest request = LauncherDiscoveryRequestBuilder.request()
                .selectors(selectClass(ApplicationContextTest.class))
                .build();
        Launcher launcher = LauncherFactory.create();
        SummaryGeneratingListener listener = new SummaryGeneratingListener();
        launcher.registerTestExecutionListeners(listener);
        launcher.execute(request);

        TestExecutionSummary summary = listener.getSummary();
        System.out.println("\n--- RESULTADOS ---");
        System.out.println("Tests encontrados: " + summary.getTestsFoundCount());
        System.out.println("Tests exitosos:    " + summary.getTestsSucceededCount());
        System.out.println("Tests fallidos:    " + summary.getTestsFailedCount());

        if (summary.getTestsFailedCount() > 0) {
            System.err.println("❌ ALGUNOS TESTS FALLARON");
            summary.getFailures().forEach(failure -> System.err.println("   -> " + failure.getException()));
        } else {
            System.out.println("✅ TODOS LOS TESTS PASARON CORRECTAMENTE");
        }
        System.out.println("=================================================");
    }
    // -------------------------------------------------------

    @Test
    @DisplayName("El contexto de Spring Boot debe cargar exitosamente")
    void contextLoads() {
        assertThat(applicationContext).isNotNull();
        System.out.println("   -> [OK] Contexto cargado.");
    }

    @Test
    @DisplayName("Debe tener configuración de seguridad")
    void shouldHaveSecurityConfiguration() {
        assertThat(applicationContext.containsBean("securityConfig")).isTrue();
        System.out.println("   -> [OK] Bean 'securityConfig' encontrado.");
    }

    @Test
    @DisplayName("Debe tener JwtUtil bean configurado")
    void shouldHaveJwtUtilBean() {
        assertThat(applicationContext.containsBean("jwtUtil")).isTrue();
        System.out.println("   -> [OK] Bean 'jwtUtil' encontrado.");
    }

    @Test
    @DisplayName("Debe tener DataSource configurado")
    void shouldHaveDataSource() {
        assertThat(applicationContext.containsBean("dataSource")).isTrue();
        System.out.println("   -> [OK] Bean 'dataSource' encontrado.");
    }
    
    
    
    
    
    
    
    
    
    
}