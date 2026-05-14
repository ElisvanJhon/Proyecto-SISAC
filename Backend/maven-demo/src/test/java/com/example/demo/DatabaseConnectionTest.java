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
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.platform.engine.discovery.DiscoverySelectors.selectClass;

@SpringBootTest
@ActiveProfiles("test")
@DisplayName("Tests de Conexión a Base de Datos")
public class DatabaseConnectionTest {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // --- MÉTODO MAIN PARA EJECUTAR COMO JAVA APPLICATION ---
    public static void main(String[] args) {
        System.out.println("=================================================");
        System.out.println("🚀 EJECUTANDO: DatabaseConnectionTest");
        System.out.println("=================================================");

        LauncherDiscoveryRequest request = LauncherDiscoveryRequestBuilder.request()
                .selectors(selectClass(DatabaseConnectionTest.class))
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

        if (summary.getTestsFailedCount() == 0) {
            System.out.println("✅ CONEXIÓN A BASE DE DATOS EXITOSA");
        } else {
            System.err.println("❌ ERROR EN CONEXIÓN A BASE DE DATOS");
            summary.getFailures().forEach(f -> System.err.println(f.getException()));
        }
        System.out.println("=================================================");
    }
    // -------------------------------------------------------

    @Test
    @DisplayName("DataSource debe estar configurado")
    void dataSourceShouldBeConfigured() {
        assertThat(dataSource).isNotNull();
        System.out.println("   -> [OK] DataSource inyectado.");
    }

    @Test
    @DisplayName("Debe poder obtener conexión a la base de datos")
    void shouldGetDatabaseConnection() {
        assertDoesNotThrow(() -> {
            try (Connection connection = dataSource.getConnection()) {
                assertThat(connection).isNotNull();
                assertThat(connection.isClosed()).isFalse();
                System.out.println("   -> [OK] Conexión establecida: " + connection.getMetaData().getURL());
            }
        });
    }

    @Test
    @DisplayName("Debe poder ejecutar query SELECT 1")
    void shouldExecuteSimpleQuery() {
        Integer result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
        assertThat(result).isEqualTo(1);
        System.out.println("   -> [OK] Query 'SELECT 1' ejecutada correctamente.");
    }

    @Test
    @DisplayName("Base de datos debe ser H2 en modo test")
    void shouldBeH2Database() throws SQLException {
        try (Connection connection = dataSource.getConnection()) {
            String databaseProductName = connection.getMetaData().getDatabaseProductName();
            assertThat(databaseProductName).isEqualToIgnoringCase("H2");
            System.out.println("   -> [OK] Motor de BD confirmado: " + databaseProductName);
        }
    }
}