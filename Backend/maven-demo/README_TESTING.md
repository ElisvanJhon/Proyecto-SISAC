# 🧪 Guía de Testing - SISAC ERP

> **Documentación completa para ejecutar y mantener las pruebas del sistema**

---

## 📑 Índice

1. [Inicio Rápido](#inicio-rápido)
2. [Tipos de Pruebas](#tipos-de-pruebas)
3. [Ejecución de Tests](#ejecución-de-tests)
4. [Tests de Seguridad](#tests-de-seguridad)
5. [Cobertura de Código](#cobertura-de-código)
6. [CI/CD Integration](#cicd-integration)
7. [Troubleshooting](#troubleshooting)
8. [Mejores Prácticas](#mejores-prácticas)

---

## 🚀 Inicio Rápido

### Prerrequisitos

```bash
# Verificar versiones
java -version      # Java 21+
mvn -version       # Maven 3.9+
docker --version   # Docker 24+ (para TestContainers)
```

### Instalación de Dependencias

```bash
# Clonar repositorio
git clone <repository-url>
cd SISAC-ERP/backend/maven-demo

# Instalar dependencias
mvn clean install -DskipTests

# Verificar configuración
mvn dependency:tree
```

### Primer Test

```bash
# Ejecutar tests unitarios
mvn test

# Ver reporte de cobertura
# Abrir: target/site/jacoco/index.html
```

---

## 🧩 Tipos de Pruebas

### 1️⃣ Pruebas Unitarias (Unit Tests)

**Propósito:** Verificar la lógica de negocio de manera aislada

**Framework:** JUnit 5 + Mockito

**Estructura de Test:**
```java
@ExtendWith(MockitoExtension.class)
class ConfiguracionServiceTest {
    
    @Mock
    private ConfiguracionRepository repository;
    
    @InjectMocks
    private ConfiguracionService service;
    
    @Test
    @DisplayName("Validar RUC de 11 dígitos")
    void testValidarRUC_Correcto() {
        // Arrange
        String ruc = "20123456789";
        
        // Act
        boolean resultado = service.validarRUC(ruc);
        
        // Assert
        assertTrue(resultado);
    }
}
```

**Tests Implementados:**
- ✅ `ConfiguracionServiceTest.java` (10 tests)
- ✅ `JwtUtilTest.java` (11 tests)
- ⏳ `UsuarioServiceTest.java` (pendiente)
- ⏳ `PayrollServiceTest.java` (pendiente)

**Ejecución:**
```bash
# Todos los tests unitarios
mvn test

# Test específico
mvn test -Dtest=ConfiguracionServiceTest

# Test específico con método
mvn test -Dtest=ConfiguracionServiceTest#testValidarRUC_Correcto
```

---

### 2️⃣ Pruebas de Integración (Integration Tests)

**Propósito:** Verificar la interacción entre componentes (Controller → Service → Repository)

**Framework:** Spring Boot Test + MockMvc

**Estructura de Test:**
```java
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerIT {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    void testLogin_CredencialesValidas() throws Exception {
        String loginRequest = """
            {
                "username": "admin",
                "password": "admin123"
            }
        """;
        
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginRequest))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").exists())
            .andExpect(jsonPath("$.username").value("admin"));
    }
}
```

**Tests Implementados:**
- ⏳ `AuthControllerIT.java` (pendiente)
- ⏳ `ConfiguracionControllerIT.java` (pendiente)
- ⏳ `OperacionDiariaControllerIT.java` (pendiente)

**Ejecución:**
```bash
# Tests de integración
mvn verify -Pintegration-tests

# Con base de datos H2
mvn verify -Dspring.profiles.active=test
```

---

### 3️⃣ Pruebas de Sistema (End-to-End Tests)

**Propósito:** Validar workflows completos con base de datos real

**Framework:** TestContainers + REST Assured

**Estructura de Test:**
```java
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@Testcontainers
class TributacionEndToEndTest {
    
    @Container
    static MySQLContainer<?> mysql = new MySQLContainer<>("mysql:8.4.6")
        .withDatabaseName("sisac_test")
        .withUsername("test")
        .withPassword("test");
    
    @LocalServerPort
    private int port;
    
    @Test
    void testFlujoCombpletoDeclaracionTributaria() {
        // 1. Login
        String token = given()
            .contentType(ContentType.JSON)
            .body(loginRequest)
        .when()
            .post("http://localhost:" + port + "/api/auth/login")
        .then()
            .statusCode(200)
            .extract().path("token");
        
        // 2. Crear configuración
        // 3. Registrar operación
        // 4. Generar declaración
        // 5. Validar datos
    }
}
```

**Ejecución:**
```bash
# Tests E2E con TestContainers
mvn verify -Pe2e-tests

# Requiere Docker corriendo
docker ps
```

---

### 4️⃣ Pruebas de Seguridad (Security Tests)

**Propósito:** Validar protección contra vulnerabilidades OWASP Top 10

#### A. Tests Automatizados (Java)

**Archivos Implementados:**
- ✅ `SQLInjectionPreventionTest.java` - Anti SQL Injection
- ✅ `AuthorizationSecurityTest.java` - Control de acceso RBAC

**Ejemplo:**
```java
@ParameterizedTest
@ValueSource(strings = {
    "' OR '1'='1",
    "'; DROP TABLE usuarios; --",
    "1' UNION SELECT NULL, NULL--"
})
void testSQLInjectionPrevention(String maliciousInput) {
    assertDoesNotThrow(() -> {
        service.buscarPorRUC(maliciousInput);
    });
    
    // Verificar que usa PreparedStatement
    verify(repository, never()).ejecutarQueryDirecta(anyString());
}
```

**Ejecución:**
```bash
# Tests de seguridad
mvn test -Dtest=**/*SecurityTest
```

#### B. Análisis Estático (SAST)

**Herramientas Configuradas:**
- ✅ **SpotBugs + FindSecBugs:** Vulnerabilidades en código
- ✅ **PMD:** Patrones inseguros
- ✅ **OWASP Dependency Check:** CVEs en dependencias

**Ejecución:**
```bash
# Análisis completo
mvn verify -Psecurity-analysis

# Solo Dependency Check
mvn dependency-check:check

# Ver reporte
# target/dependency-check-report.html
```

**Configuración en pom.xml:**
```xml
<plugin>
    <groupId>org.owasp</groupId>
    <artifactId>dependency-check-maven</artifactId>
    <configuration>
        <failBuildOnCVSS>7</failBuildOnCVSS>
        <skipTestScope>false</skipTestScope>
    </configuration>
</plugin>
```

#### C. Pentesting Externo (DAST)

**Scripts Disponibles:**

1. **NMAP - Port Scanning**
```bash
cd security-testing
bash nmap-scan.sh
# Ver reporte: reports/nmap/
```

2. **Nikto - Web Vulnerability Scanner**
```bash
bash nikto-scan.sh
# Ver reporte: reports/nikto/
```

3. **OWASP ZAP - Automated Security Testing**
```bash
bash owasp-zap.sh
# Requiere Docker
# Ver reporte HTML: reports/zap/
```

4. **FFUF - Endpoint Fuzzing**
```bash
bash ffuf-fuzzing.sh
# Ver reportes JSON: reports/ffuf/
```

5. **Snyk - Dependency Vulnerabilities**
```bash
bash snyk-test.sh
# Requiere: npm install -g snyk && snyk auth
# Ver reporte HTML: reports/snyk/
```

**Ejecutar Todos los Tests de Seguridad:**

**Linux/Mac:**
```bash
cd security-testing
chmod +x *.sh
bash run-all-tests.sh
```

**Windows:**
```powershell
cd security-testing
powershell -ExecutionPolicy Bypass -File run-all-tests.ps1
```

**Menú Interactivo:**
```
Selecciona el modo de ejecución:
1. Ejecutar todos los tests (Full Suite)
2. Ejecutar tests individuales
3. Ejecutar tests rápidos (nmap + nikto)
4. Ejecutar tests avanzados (ZAP + fuzzing + snyk)
```

---

### 5️⃣ Pruebas de Rendimiento (Performance Tests)

**Herramienta:** Apache JMeter

**Escenarios Configurados:**

| Escenario | Usuarios | Duración | Objetivo |
|-----------|----------|----------|----------|
| Smoke Test | 1 | 1 min | Verificar funcionamiento básico |
| Load Test | 50 | 30 min | Carga normal esperada |
| Stress Test | 100 | 10 min | Identificar límites |
| Spike Test | 200 | 5 min | Picos de tráfico |

**Ejecución:**

**Modo GUI (Desarrollo):**
```bash
jmeter -t security-testing/jmeter-load-test.jmx
```

**Modo No-GUI (CI/CD):**
```bash
jmeter -n -t security-testing/jmeter-load-test.jmx \
    -l results/results.jtl \
    -e -o results/dashboard \
    -Jusers=50 \
    -Jramp=30 \
    -Jport=8082
```

**Ver Dashboard:**
```bash
# Abrir: results/dashboard/index.html
open results/dashboard/index.html  # Mac
start results/dashboard/index.html # Windows
```

**Métricas Analizadas:**
- ⏱️ **Response Time:** P50, P95, P99, Max
- 📊 **Throughput:** Requests/second
- ❌ **Error Rate:** % de errores
- 📈 **Concurrent Users:** Usuarios simultáneos
- 💾 **Server Metrics:** CPU, RAM, DB connections

---

## 📊 Cobertura de Código

### Herramienta: JaCoCo

**Configuración en pom.xml:**
```xml
<plugin>
    <groupId>org.jacoco</groupId>
    <artifactId>jacoco-maven-plugin</artifactId>
    <version>0.8.11</version>
    <configuration>
        <rules>
            <rule>
                <element>BUNDLE</element>
                <limits>
                    <limit>
                        <counter>LINE</counter>
                        <value>COVEREDRATIO</value>
                        <minimum>0.50</minimum>
                    </limit>
                </limits>
            </rule>
        </rules>
    </configuration>
</plugin>
```

**Generar Reporte:**
```bash
# Ejecutar tests con cobertura
mvn clean verify

# Ver reporte HTML
# target/site/jacoco/index.html
```

**Interpretación del Reporte:**

| Métrica | Descripción | Objetivo |
|---------|-------------|----------|
| **Line Coverage** | % de líneas ejecutadas | >50% |
| **Branch Coverage** | % de ramas lógicas cubiertas | >40% |
| **Complexity** | Complejidad ciclomática cubierta | Bajo |
| **Method Coverage** | % de métodos ejecutados | >50% |

**Exclusiones de Cobertura:**
```xml
<configuration>
    <excludes>
        <exclude>**/config/**</exclude>
        <exclude>**/dto/**</exclude>
        <exclude>**/entity/**</exclude>
        <exclude>**/*Application.class</exclude>
    </excludes>
</configuration>
```

**Umbral de Fallo:**
```bash
# Build falla si cobertura < 50%
mvn verify
# [INFO] BUILD FAILURE
# [ERROR] Rule violated: lines covered ratio is 0.48 < 0.50
```

---

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: CI - Tests & Security

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mysql:
        image: mysql:8.4.6
        env:
          MYSQL_ROOT_PASSWORD: admin
          MYSQL_DATABASE: sisac_test
        ports:
          - 3306:3306
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up JDK 21
      uses: actions/setup-java@v3
      with:
        java-version: '21'
        distribution: 'temurin'
    
    - name: Cache Maven packages
      uses: actions/cache@v3
      with:
        path: ~/.m2
        key: ${{ runner.os }}-m2-${{ hashFiles('**/pom.xml') }}
    
    - name: Run Unit Tests
      run: mvn test
    
    - name: Run Integration Tests
      run: mvn verify -Pintegration-tests
    
    - name: Security Analysis
      run: mvn verify -Psecurity-analysis
    
    - name: OWASP Dependency Check
      run: mvn dependency-check:check
    
    - name: Generate Coverage Report
      run: mvn jacoco:report
    
    - name: Upload Coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        files: ./target/site/jacoco/jacoco.xml
    
    - name: Archive Test Reports
      if: always()
      uses: actions/upload-artifact@v3
      with:
        name: test-reports
        path: |
          target/surefire-reports
          target/failsafe-reports
          target/site/jacoco
          target/dependency-check-report.html
```

### Maven Profiles

**Test Profile:**
```xml
<profile>
    <id>test</id>
    <properties>
        <spring.profiles.active>test</spring.profiles.active>
    </properties>
</profile>
```

**Security Profile:**
```xml
<profile>
    <id>security-analysis</id>
    <build>
        <plugins>
            <plugin>
                <groupId>com.github.spotbugs</groupId>
                <artifactId>spotbugs-maven-plugin</artifactId>
                <executions>
                    <execution>
                        <phase>verify</phase>
                        <goals>
                            <goal>check</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</profile>
```

**Uso:**
```bash
mvn verify -Psecurity-analysis
```

---

## 🐛 Troubleshooting

### Problema: Tests Fallan con "Connection Refused"

**Causa:** Base de datos MySQL no está corriendo

**Solución:**
```bash
# Verificar MySQL
docker ps | grep mysql

# Iniciar MySQL con Docker
docker run -d --name mysql-test \
    -e MYSQL_ROOT_PASSWORD=admin \
    -e MYSQL_DATABASE=sisac_db \
    -p 3306:3306 \
    mysql:8.4.6

# O usar H2 en tests
mvn test -Dspring.profiles.active=test
```

---

### Problema: TestContainers Falla

**Causa:** Docker no está corriendo o no tiene permisos

**Solución:**
```bash
# Verificar Docker
docker info

# Linux: Agregar usuario a grupo docker
sudo usermod -aG docker $USER
newgrp docker

# Mac/Windows: Verificar Docker Desktop
```

---

### Problema: OWASP Dependency Check Muy Lento

**Causa:** Primera ejecución descarga NVD database (varios GB)

**Solución:**
```bash
# Cachear database localmente
mvn dependency-check:update-only

# Configurar proxy si es necesario
mvn dependency-check:check \
    -DproxyHost=proxy.company.com \
    -DproxyPort=8080
```

---

### Problema: Snyk Auth Falla

**Causa:** No autenticado en Snyk

**Solución:**
```bash
# Instalar Snyk CLI
npm install -g snyk

# Autenticar (abre navegador)
snyk auth

# Verificar
snyk test --all-projects
```

---

### Problema: JMeter No Encuentra Java

**Causa:** JAVA_HOME no configurado

**Solución:**
```bash
# Linux/Mac
export JAVA_HOME=/path/to/java21
export PATH=$JAVA_HOME/bin:$PATH

# Windows
set JAVA_HOME=C:\Program Files\Java\jdk-21
set PATH=%JAVA_HOME%\bin;%PATH%

# Verificar
echo $JAVA_HOME
java -version
```

---

### Problema: Cobertura Baja en Entidades

**Causa:** Entities y DTOs sin tests (correctos, no necesitan)

**Solución:**
```xml
<!-- Excluir de cobertura -->
<configuration>
    <excludes>
        <exclude>**/entity/**</exclude>
        <exclude>**/dto/**</exclude>
    </excludes>
</configuration>
```

---

## ✅ Mejores Prácticas

### 1. Nomenclatura de Tests

```java
// ❌ Malo
@Test
void test1() { ... }

// ✅ Bueno
@Test
@DisplayName("Validar RUC debe retornar true para RUC válido de 11 dígitos")
void testValidarRUC_ConRUCValidoDe11Digitos_DebeRetornarTrue() {
    // Given-When-Then
}
```

### 2. Estructura Given-When-Then

```java
@Test
void testCalcularIGV() {
    // Given (Arrange)
    BigDecimal monto = new BigDecimal("1000.00");
    BigDecimal tasaIGV = new BigDecimal("0.18");
    
    // When (Act)
    BigDecimal resultado = service.calcularIGV(monto, tasaIGV);
    
    // Then (Assert)
    assertThat(resultado)
        .isEqualByComparingTo(new BigDecimal("180.00"));
}
```

### 3. Tests Independientes

```java
// ❌ Malo - Tests dependientes
@Test
void test1() {
    service.crear(entity);
    globalId = entity.getId();
}

@Test
void test2() {
    service.actualizar(globalId); // Depende de test1
}

// ✅ Bueno - Tests independientes
@BeforeEach
void setUp() {
    entity = crearEntityDePrueba();
    service.crear(entity);
}

@Test
void testActualizar() {
    service.actualizar(entity.getId());
    // Verificaciones
}
```

### 4. Mocks vs Stubs

```java
// Mock - Verificar interacciones
@Test
void testGuardar() {
    service.guardar(entity);
    verify(repository, times(1)).save(entity);
}

// Stub - Simular respuestas
@Test
void testBuscar() {
    when(repository.findById(1L))
        .thenReturn(Optional.of(entity));
    
    Entity resultado = service.buscar(1L);
    assertNotNull(resultado);
}
```

### 5. Assertions Significativas

```java
// ❌ Malo
assertTrue(resultado != null);
assertEquals(true, resultado.isActivo());

// ✅ Bueno
assertNotNull(resultado);
assertTrue(resultado.isActivo());

// ✅ Mejor con AssertJ
assertThat(resultado)
    .isNotNull()
    .extracting("activo")
    .isEqualTo(true);
```

### 6. Tests Parametrizados

```java
@ParameterizedTest
@CsvSource({
    "20123456789, true",
    "12345678901, true",
    "123, false",
    "20123456ABC, false"
})
void testValidarRUC(String ruc, boolean esperado) {
    assertEquals(esperado, service.validarRUC(ruc));
}
```

### 7. Manejo de Excepciones

```java
// ❌ Malo
@Test
void testException() {
    try {
        service.metodoQueFalla();
        fail("Debería lanzar excepción");
    } catch (Exception e) {
        // OK
    }
}

// ✅ Bueno
@Test
void testException() {
    assertThrows(BusinessException.class, () -> {
        service.metodoQueFalla();
    });
}

// ✅ Mejor - Verificar mensaje
@Test
void testException() {
    BusinessException ex = assertThrows(
        BusinessException.class,
        () -> service.metodoQueFalla()
    );
    
    assertThat(ex.getMessage())
        .contains("RUC inválido");
}
```

### 8. Cleanup de Recursos

```java
@TestInstance(Lifecycle.PER_CLASS)
class DatabaseTest {
    
    private DataSource dataSource;
    
    @BeforeAll
    void initDatabase() {
        dataSource = crearDataSource();
    }
    
    @AfterEach
    void cleanupData() {
        jdbcTemplate.execute("DELETE FROM test_table");
    }
    
    @AfterAll
    void closeDatabase() {
        dataSource.close();
    }
}
```

---

## 📚 Referencias

- **JUnit 5:** https://junit.org/junit5/docs/current/user-guide/
- **Mockito:** https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html
- **Spring Boot Testing:** https://docs.spring.io/spring-boot/reference/testing/index.html
- **TestContainers:** https://www.testcontainers.org/
- **REST Assured:** https://rest-assured.io/
- **JaCoCo:** https://www.jacoco.org/jacoco/trunk/doc/
- **OWASP Testing Guide:** https://owasp.org/www-project-web-security-testing-guide/
- **JMeter:** https://jmeter.apache.org/usermanual/index.html

---

## 📞 Soporte

**Contacto del Equipo QA:**
- Email: qa-team@sisac-erp.com
- Slack: #qa-testing
- Wiki: https://wiki.sisac-erp.com/testing

**Reportar Issues:**
```bash
# GitHub Issues
https://github.com/sisac-erp/backend/issues

# Template de Bug
- Severidad: [Critical/Major/Minor]
- Pasos para reproducir:
- Resultado esperado:
- Resultado actual:
- Logs adjuntos:
```

---

*Última actualización: 2024 | Versión 1.0*
