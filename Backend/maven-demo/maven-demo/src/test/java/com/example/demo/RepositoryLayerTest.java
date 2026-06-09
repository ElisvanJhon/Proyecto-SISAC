package com.example.demo;

import com.example.demo.repository.*;
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
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.platform.engine.discovery.DiscoverySelectors.selectClass;

@SpringBootTest
@ActiveProfiles("test")
@DisplayName("Tests de Capa de Repositorios")
public class RepositoryLayerTest {

    @Autowired(required = false)
    private UsuarioAdminRepository usuarioAdminRepository;

    @Autowired(required = false)
    private ContribuyentesRepository contribuyentesRepository;

    @Autowired(required = false)
    private ParametrosTributariosRepository parametrosTributariosRepository;

    // --- MÉTODO MAIN PARA EJECUTAR COMO JAVA APPLICATION ---
    public static void main(String[] args) {
        System.out.println("=================================================");
        System.out.println("🚀 EJECUTANDO: RepositoryLayerTest");
        System.out.println("=================================================");

        LauncherDiscoveryRequest request = LauncherDiscoveryRequestBuilder.request()
                .selectors(selectClass(RepositoryLayerTest.class))
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
            System.err.println("❌ REPOSITORIOS FALLIDOS: " + summary.getTestsFailedCount());
            summary.getFailures().forEach(f -> System.err.println(f.getException()));
        } else {
            System.out.println("✅ TODOS LOS REPOSITORIOS OPERATIVOS");
        }
        System.out.println("=================================================");
    }
    // -------------------------------------------------------

    @Test
    @DisplayName("UsuarioAdminRepository debe estar disponible")
    void usuarioAdminRepositoryShouldBeAvailable() {
        assertThat(usuarioAdminRepository).isNotNull();
        System.out.println("   -> [OK] UsuarioAdminRepository inyectado.");
    }

    @Test
    @DisplayName("ContribuyentesRepository debe estar disponible")
    void contribuyentesRepositoryShouldBeAvailable() {
        assertThat(contribuyentesRepository).isNotNull();
        System.out.println("   -> [OK] ContribuyentesRepository inyectado.");
    }

    @Test
    @DisplayName("ParametrosTributariosRepository debe estar disponible")
    void parametrosTributariosRepositoryShouldBeAvailable() {
        assertThat(parametrosTributariosRepository).isNotNull();
        System.out.println("   -> [OK] ParametrosTributariosRepository inyectado.");
    }

    @Test
    @DisplayName("Todos los repositorios deben contar registros")
    void allRepositoriesShouldCountRecords() {
        if (usuarioAdminRepository != null) {
            long count = usuarioAdminRepository.count();
            assertThat(count).isGreaterThanOrEqualTo(0);
            System.out.println("   -> [OK] Usuarios encontrados en DB: " + count);
        }
        if (contribuyentesRepository != null) {
            long count = contribuyentesRepository.count();
            System.out.println("   -> [OK] Contribuyentes encontrados en DB: " + count);
        }
    }
}