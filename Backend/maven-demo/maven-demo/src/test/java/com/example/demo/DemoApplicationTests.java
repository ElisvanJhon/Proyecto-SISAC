package com.example.demo;

import org.junit.jupiter.api.Test;
import org.junit.platform.launcher.Launcher;
import org.junit.platform.launcher.LauncherDiscoveryRequest;
import org.junit.platform.launcher.core.LauncherDiscoveryRequestBuilder;
import org.junit.platform.launcher.core.LauncherFactory;
import org.junit.platform.launcher.listeners.SummaryGeneratingListener;
import org.junit.platform.launcher.listeners.TestExecutionSummary;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.platform.engine.discovery.DiscoverySelectors.selectClass;

@SpringBootTest
public class DemoApplicationTests {

    // --- MÉTODO MAIN PARA EJECUTAR COMO JAVA APPLICATION ---
    public static void main(String[] args) {
        System.out.println("=================================================");
        System.out.println("🚀 EJECUTANDO: DemoApplicationTests");
        System.out.println("=================================================");

        LauncherDiscoveryRequest request = LauncherDiscoveryRequestBuilder.request()
                .selectors(selectClass(DemoApplicationTests.class))
                .build();
        Launcher launcher = LauncherFactory.create();
        SummaryGeneratingListener listener = new SummaryGeneratingListener();
        launcher.registerTestExecutionListeners(listener);
        launcher.execute(request);

        TestExecutionSummary summary = listener.getSummary();
        
        if (summary.getTestsFailedCount() == 0) {
            System.out.println("✅ LA APLICACIÓN PRINCIPAL ARRANCA CORRECTAMENTE");
        } else {
            System.err.println("❌ LA APLICACIÓN NO PUDO ARRANCAR");
        }
        System.out.println("=================================================");
    }
    // -------------------------------------------------------

    @Test
    void contextLoads() {
        System.out.println("   -> [OK] Spring Context cargado desde DemoApplication.");
    }
}