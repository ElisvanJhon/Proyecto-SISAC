package com.example.demo;

import com.example.demo.util.JwtUtil;
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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.platform.engine.discovery.DiscoverySelectors.selectClass;

@SpringBootTest
@ActiveProfiles("test")
@DisplayName("Tests de Configuración de Seguridad")
public class SecurityConfigurationTest {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // --- MÉTODO MAIN PARA EJECUTAR COMO JAVA APPLICATION ---
    public static void main(String[] args) {
        System.out.println("=================================================");
        System.out.println("🚀 EJECUTANDO: SecurityConfigurationTest");
        System.out.println("=================================================");

        LauncherDiscoveryRequest request = LauncherDiscoveryRequestBuilder.request()
                .selectors(selectClass(SecurityConfigurationTest.class))
                .build();
        Launcher launcher = LauncherFactory.create();
        SummaryGeneratingListener listener = new SummaryGeneratingListener();
        launcher.registerTestExecutionListeners(listener);
        launcher.execute(request);

        TestExecutionSummary summary = listener.getSummary();
        System.out.println("\n--- RESULTADOS ---");
        System.out.println("Tests encontrados: " + summary.getTestsFoundCount());
        System.out.println("Tests exitosos:    " + summary.getTestsSucceededCount());

        if (summary.getTestsFailedCount() > 0) {
            System.err.println("❌ ERROR EN SEGURIDAD");
        } else {
            System.out.println("✅ COMPONENTES DE SEGURIDAD OK");
        }
        System.out.println("=================================================");
    }
    // -------------------------------------------------------

    @Test
    @DisplayName("JwtUtil debe estar configurado correctamente")
    void jwtUtilShouldBeConfigured() {
        assertThat(jwtUtil).isNotNull();
        System.out.println("   -> [OK] JwtUtil inyectado.");
    }

    @Test
    @DisplayName("PasswordEncoder debe estar configurado")
    void passwordEncoderShouldBeConfigured() {
        assertThat(passwordEncoder).isNotNull();
        System.out.println("   -> [OK] PasswordEncoder inyectado.");
    }

    @Test
    @DisplayName("PasswordEncoder debe codificar y validar contraseñas")
    void passwordEncoderTest() {
        String rawPassword = "TestPassword123!";
        String encodedPassword = passwordEncoder.encode(rawPassword);
        
        assertThat(encodedPassword).isNotEqualTo(rawPassword);
        boolean matches = passwordEncoder.matches(rawPassword, encodedPassword);
        
        assertThat(matches).isTrue();
        System.out.println("   -> [OK] BCrypt funciona correctamente (Encode/Match).");
    }
}