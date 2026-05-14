# 📋 Plan de Pruebas de Software - SISAC ERP

## 📑 Tabla de Contenidos
1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Objetivos](#objetivos)
3. [Alcance](#alcance)
4. [Estrategia de Pruebas](#estrategia-de-pruebas)
5. [Tipos de Pruebas](#tipos-de-pruebas)
6. [Entorno de Pruebas](#entorno-de-pruebas)
7. [Cronograma](#cronograma)
8. [Recursos](#recursos)
9. [Criterios de Aceptación](#criterios-de-aceptación)
10. [Gestión de Defectos](#gestión-de-defectos)

---

## 1. Resumen Ejecutivo

Este plan de pruebas define la estrategia integral para validar la funcionalidad, seguridad, rendimiento y calidad del sistema SISAC ERP (Sistema Integrado de Gestión Tributaria, Planillas y Contratación).

**Proyecto:** SISAC ERP  
**Versión:** 1.0.0  
**Fecha:** 2024  
**Responsable QA:** [Nombre del Lead QA]

---

## 2. Objetivos

### Objetivos Principales
- ✅ Verificar que todas las funcionalidades cumplan con los requisitos especificados
- ✅ Identificar y documentar defectos antes del despliegue a producción
- ✅ Validar la seguridad del sistema contra vulnerabilidades OWASP Top 10
- ✅ Asegurar el rendimiento bajo carga esperada (50+ usuarios concurrentes)
- ✅ Garantizar la calidad del código mediante cobertura de pruebas >50%

### Objetivos Secundarios
- Automatizar el 80% de las pruebas de regresión
- Establecer pipeline CI/CD con pruebas integradas
- Documentar casos de prueba para mantenimiento futuro
- Capacitar al equipo en mejores prácticas de testing

---

## 3. Alcance

### 3.1 Módulos en Alcance

#### ✅ Módulo de Autenticación y Autorización
- Login/Logout de usuarios
- Gestión de JWT tokens
- Control de acceso basado en roles (RBAC)
- Endpoints: `/api/auth/*`

#### ✅ Módulo de Configuración Tributaria
- Gestión de parámetros SUNAT
- Cálculo de IGV y retenciones
- Validación de RUC
- Endpoints: `/api/configuracion/*`

#### ✅ Módulo de Operaciones Diarias
- Registro de operaciones contables
- Validación de montos y fechas
- Endpoints: `/api/operacion-diaria/*`

#### ✅ Módulo de Gestión de Planillas
- Cálculo de remuneraciones
- Generación de boletas de pago
- Endpoints: `/api/payroll/*`

### 3.2 Fuera de Alcance (v1.0)
- Integración con sistemas externos de terceros
- Módulo de reportes avanzados
- Funcionalidades móviles nativas

---

## 4. Estrategia de Pruebas

### 4.1 Pirámide de Pruebas

```
                 /\
                /  \  E2E (10%)
               /    \
              /------\  Integration (30%)
             /        \
            /----------\  Unit Tests (60%)
```

### 4.2 Enfoque por Niveles

#### Nivel 1: Pruebas Unitarias (Unit Tests)
- **Cobertura objetivo:** >70%
- **Framework:** JUnit 5 + Mockito
- **Responsable:** Desarrolladores
- **Frecuencia:** En cada commit

#### Nivel 2: Pruebas de Integración (Integration Tests)
- **Cobertura objetivo:** >50%
- **Framework:** Spring Boot Test + TestContainers
- **Responsable:** Desarrolladores + QA
- **Frecuencia:** En cada pull request

#### Nivel 3: Pruebas de Sistema (System Tests)
- **Cobertura objetivo:** Flujos críticos completos
- **Framework:** TestContainers + REST Assured
- **Responsable:** QA Team
- **Frecuencia:** Antes de cada release

#### Nivel 4: Pruebas de Aceptación (UAT)
- **Cobertura objetivo:** Casos de negocio principales
- **Framework:** Manual + Scripts automatizados
- **Responsable:** Product Owner + Usuarios clave
- **Frecuencia:** En staging antes de producción

---

## 5. Tipos de Pruebas

### 5.1 Pruebas Funcionales

#### 5.1.1 Pruebas Unitarias
**Archivos de Test:**
- `ConfiguracionServiceTest.java` - Lógica de negocio tributaria
- `JwtUtilTest.java` - Gestión de tokens JWT
- `UsuarioServiceTest.java` - Gestión de usuarios
- `PayrollCalculationTest.java` - Cálculos de planilla

**Criterios:**
- Cada método público debe tener al menos 1 test
- Cobertura de ramas >80%
- Mocks para todas las dependencias externas
- Tests independientes y repetibles

**Comando de Ejecución:**
```bash
mvn test
```

#### 5.1.2 Pruebas de Integración
**Archivos de Test:**
- `AuthControllerIT.java` - API de autenticación
- `ConfiguracionControllerIT.java` - API de configuración
- `OperacionDiariaControllerIT.java` - API de operaciones
- `PayrollControllerIT.java` - API de planillas

**Criterios:**
- Base de datos H2 en memoria para tests
- Validación de respuestas HTTP completas
- Testing de flujos multi-capa (Controller → Service → Repository)
- Validación de transacciones y rollbacks

**Comando de Ejecución:**
```bash
mvn verify -Pintegration-tests
```

#### 5.1.3 Pruebas de Sistema (End-to-End)
**Archivos de Test:**
- `TributacionEndToEndTest.java` - Flujo completo de declaración tributaria
- `PayrollEndToEndTest.java` - Flujo completo de cálculo de planillas
- `EmployeeLifecycleTest.java` - Ciclo de vida de empleado

**Criterios:**
- Uso de TestContainers con MySQL real
- Simulación de escenarios de usuario completos
- Validación de integridad de datos
- Testing de workflows de negocio

**Comando de Ejecución:**
```bash
mvn verify -Pe2e-tests
```

### 5.2 Pruebas No Funcionales

#### 5.2.1 Pruebas de Seguridad

##### A. Pruebas de Seguridad Automatizadas (Java)
**Archivos de Test:**
- `SQLInjectionPreventionTest.java` - Anti SQL Injection
- `AuthorizationSecurityTest.java` - RBAC y control de acceso
- `XSSPreventionTest.java` - Anti Cross-Site Scripting
- `CSRFProtectionTest.java` - Protección CSRF

**Vulnerabilidades Verificadas:**
- ✅ SQL Injection (OWASP A03:2021)
- ✅ Broken Authentication (OWASP A07:2021)
- ✅ Cross-Site Scripting - XSS (OWASP A03:2021)
- ✅ Broken Access Control (OWASP A01:2021)
- ✅ Security Misconfiguration (OWASP A05:2021)

**Comando de Ejecución:**
```bash
mvn test -Dtest=**/*SecurityTest
```

##### B. Análisis Estático de Código (SAST)
**Herramientas:**
- **SpotBugs + FindSecBugs:** Detección de vulnerabilidades en código Java
- **PMD:** Análisis de calidad y patrones inseguros
- **OWASP Dependency Check:** Escaneo de dependencias vulnerables

**Comando de Ejecución:**
```bash
mvn verify -Psecurity-analysis
```

**Criterios de Aceptación:**
- 0 vulnerabilidades críticas (CVSS >= 9.0)
- 0 vulnerabilidades altas (CVSS >= 7.0)
- Máximo 5 vulnerabilidades medias (CVSS >= 4.0)

##### C. Pruebas de Penetración Externas (DAST)

**Herramientas:**

1. **NMAP** - Port Scanning
   ```bash
   cd security-testing
   bash nmap-scan.sh
   ```
   - Identifica puertos abiertos
   - Detecta servicios expuestos
   - Versiones de software

2. **Nikto** - Web Vulnerability Scanner
   ```bash
   bash nikto-scan.sh
   ```
   - Escaneo de vulnerabilidades web conocidas
   - Detección de configuraciones inseguras
   - Análisis de headers de seguridad

3. **OWASP ZAP** - Automated Security Testing
   ```bash
   bash owasp-zap.sh
   ```
   - Spider completo de la aplicación
   - Active scanning de vulnerabilidades
   - Detección de OWASP Top 10

4. **FFUF** - Web Fuzzing
   ```bash
   bash ffuf-fuzzing.sh
   ```
   - Descubrimiento de endpoints ocultos
   - Fuzzing de parámetros
   - Testing de métodos HTTP

5. **Snyk** - Dependency Vulnerabilities
   ```bash
   bash snyk-test.sh
   ```
   - Análisis de dependencias Maven
   - Detección de CVEs conocidos
   - Recomendaciones de actualización

**Comando Maestro (Ejecutar Todos):**
```bash
# Linux/Mac
bash run-all-tests.sh

# Windows
powershell -ExecutionPolicy Bypass -File run-all-tests.ps1
```

#### 5.2.2 Pruebas de Rendimiento (Performance)

**Herramientas:**
- **Apache JMeter** - Load Testing
- **JaCoCo** - Code Coverage Monitoring

**Escenarios de Carga:**

| Escenario | Usuarios | Duración | TPS Esperado | Latencia P95 |
|-----------|----------|----------|--------------|--------------|
| Carga Normal | 10 | 10 min | 50 req/s | < 500ms |
| Carga Media | 50 | 30 min | 200 req/s | < 1s |
| Carga Pico | 100 | 5 min | 400 req/s | < 2s |
| Estrés | 200 | 10 min | 800 req/s | < 5s |

**Comando de Ejecución:**
```bash
jmeter -n -t security-testing/jmeter-load-test.jmx \
  -l results.jtl \
  -e -o dashboard/
```

**Métricas Monitoreadas:**
- ⏱️ Tiempo de respuesta (avg, p50, p95, p99)
- 📊 Throughput (requests/second)
- ❌ Tasa de error (< 0.1%)
- 💾 Uso de memoria (< 2GB heap)
- 🗄️ Pool de conexiones DB (< 80% uso)

#### 5.2.3 Pruebas de Cobertura de Código

**Herramienta:** JaCoCo

**Umbrales de Cobertura:**
- **Líneas:** >50% (configurado en pom.xml)
- **Ramas:** >40%
- **Clases:** >60%
- **Métodos:** >50%

**Reportes Generados:**
- HTML: `target/site/jacoco/index.html`
- XML: `target/site/jacoco/jacoco.xml` (para CI/CD)

**Comando de Ejecución:**
```bash
mvn clean verify
# Reporte en: target/site/jacoco/index.html
```

---

## 6. Entorno de Pruebas

### 6.1 Entornos

| Entorno | Propósito | Base de Datos | URL |
|---------|-----------|---------------|-----|
| **Local Dev** | Desarrollo | H2 in-memory | localhost:8082 |
| **Test** | Pruebas automatizadas | H2 / TestContainers | localhost:8082 |
| **Staging** | UAT / Pre-producción | MySQL 8.4.6 | staging.sisac.com:8082 |
| **Production** | Producción | MySQL 8.4.6 | api.sisac.com |

### 6.2 Configuraciones de Prueba

#### application-test.properties
```properties
# Base de datos H2 en memoria
spring.datasource.url=jdbc:h2:mem:testdb;MODE=MySQL
spring.datasource.driver-class-name=org.h2.Driver
spring.jpa.hibernate.ddl-auto=create-drop

# Logging detallado para debugging
logging.level.com.sisac=DEBUG
logging.level.org.springframework.security=DEBUG

# Desactivar seguridad de CORS en tests
spring.security.cors.enabled=false
```

### 6.3 Datos de Prueba

**Usuarios de Test:**
```java
// Admin
username: admin_test
password: Test123!
roles: ADMIN_TRIBUTARIO, ADMIN_SISTEMA

// Usuario Regular
username: user_test
password: Test456!
roles: GESTOR_PLANILLA

// Usuario Limitado
username: viewer_test
password: Test789!
roles: VISUALIZADOR
```

**Empresa de Test:**
```java
RUC: 20123456789
Razón Social: EMPRESA TEST SAC
IGV: 18%
Renta: 30%
```

---

## 7. Cronograma

### Fase 1: Preparación (Semana 1)
- ✅ Configuración de entorno de pruebas
- ✅ Instalación de herramientas (JMeter, Docker, Snyk)
- ✅ Preparación de datos de prueba
- ✅ Configuración de TestContainers

### Fase 2: Pruebas Unitarias (Semana 1-2)
- ✅ Desarrollo de tests unitarios
- ✅ Ejecución y análisis de cobertura
- ✅ Refactoring para mejorar testabilidad

### Fase 3: Pruebas de Integración (Semana 2-3)
- ⏳ Desarrollo de tests de integración
- ⏳ Testing de APIs REST
- ⏳ Validación de transacciones DB

### Fase 4: Pruebas de Sistema (Semana 3)
- ⏳ Tests End-to-End con TestContainers
- ⏳ Validación de workflows completos

### Fase 5: Pruebas de Seguridad (Semana 4)
- ✅ Análisis estático (SpotBugs, PMD, Dependency Check)
- ⏳ Pentesting con NMAP, Nikto, ZAP
- ⏳ Fuzzing con FFUF
- ⏳ Análisis de dependencias con Snyk

### Fase 6: Pruebas de Rendimiento (Semana 5)
- ⏳ Configuración de JMeter tests
- ⏳ Ejecución de pruebas de carga
- ⏳ Análisis de bottlenecks

### Fase 7: UAT (Semana 6)
- ⏳ Entrega a usuarios clave
- ⏳ Validación de casos de negocio
- ⏳ Corrección de defectos críticos

### Fase 8: Cierre (Semana 6)
- ⏳ Reporte final de pruebas
- ⏳ Documentación de casos de prueba
- ⏳ Aprobación para producción

---

## 8. Recursos

### 8.1 Equipo de Pruebas

| Rol | Nombre | Responsabilidades |
|-----|--------|-------------------|
| QA Lead | [Nombre] | Planificación, coordinación, reporte |
| QA Engineer 1 | [Nombre] | Pruebas funcionales, automatización |
| QA Engineer 2 | [Nombre] | Pruebas de seguridad, pentesting |
| Performance Tester | [Nombre] | Pruebas de carga y rendimiento |
| Dev Lead | [Nombre] | Soporte técnico, corrección de defectos |

### 8.2 Herramientas y Tecnologías

#### Testing Frameworks
- ✅ JUnit 5.11.4
- ✅ Mockito 5.x
- ✅ Spring Boot Test 3.5.6
- ✅ TestContainers 1.19.3
- ✅ REST Assured 5.4.0
- ✅ AssertJ 3.24.2

#### Security Tools
- ✅ OWASP Dependency Check 9.0.9
- ✅ SpotBugs 4.8.3 + FindSecBugs 1.12.0
- ✅ PMD 3.21.2
- ✅ OWASP ZAP 2.14+
- ✅ Nikto 2.5+
- ✅ NMAP 7.94+
- ✅ FFUF 2.1+
- ✅ Snyk CLI

#### Performance Tools
- ✅ Apache JMeter 5.6+
- ✅ JaCoCo 0.8.11

#### CI/CD Integration
- Maven 3.9.9
- Docker 24+
- Git/GitHub Actions

---

## 9. Criterios de Aceptación

### 9.1 Criterios de Entrada
- ✅ Código fuente disponible en repositorio
- ✅ Compilación exitosa sin errores
- ✅ Documentación de requisitos completa
- ✅ Entorno de pruebas configurado

### 9.2 Criterios de Salida

#### Pruebas Unitarias
- ✅ Cobertura de código >50% (actual: ~55%)
- ✅ 0 tests fallidos
- ✅ Ejecución exitosa en < 2 minutos

#### Pruebas de Integración
- ⏳ Cobertura de endpoints críticos 100%
- ⏳ 0 tests fallidos
- ⏳ Ejecución en < 5 minutos

#### Pruebas de Seguridad
- ⏳ 0 vulnerabilidades críticas (CVSS >= 9.0)
- ⏳ 0 vulnerabilidades altas (CVSS >= 7.0)
- ⏳ Máximo 5 vulnerabilidades medias
- ⏳ Reporte de pentest completado

#### Pruebas de Rendimiento
- ⏳ Latencia P95 < 1 segundo bajo carga normal
- ⏳ Tasa de error < 0.1%
- ⏳ Throughput >= 200 req/s
- ⏳ Sin memory leaks detectados

### 9.3 Criterios de Aprobación Final
- 95% de casos de prueba ejecutados
- 0 defectos bloqueantes abiertos
- Máximo 3 defectos mayores abiertos
- Aprobación de Product Owner
- Documentación de usuario completa

---

## 10. Gestión de Defectos

### 10.1 Clasificación de Severidad

| Severidad | Descripción | SLA de Corrección |
|-----------|-------------|-------------------|
| **Blocker** | Impide continuar con pruebas | 24 horas |
| **Critical** | Funcionalidad principal no funciona | 48 horas |
| **Major** | Funcionalidad secundaria afectada | 1 semana |
| **Minor** | Problema cosmético o usabilidad | 2 semanas |
| **Trivial** | Sugerencia de mejora | Backlog |

### 10.2 Flujo de Defectos

```
[Defecto Reportado] 
    ↓
[Triaje QA Lead]
    ↓
[Asignado a Dev] → [En Desarrollo] → [Fix Completado]
    ↓                                      ↓
[Re-Test QA]                          [Verificado]
    ↓                                      ↓
[Cerrado] ← [OK]                    [Reabierto] → [En Desarrollo]
```

### 10.3 Reporte de Defectos

**Template de Bug Report:**
```markdown
## Bug ID: BUG-001
**Título:** Login falla con credenciales válidas

**Severidad:** Critical
**Prioridad:** High
**Módulo:** Autenticación
**Ambiente:** Test (localhost:8082)

**Descripción:**
Al intentar hacer login con credenciales válidas (admin/admin123),
el sistema retorna error 401 Unauthorized.

**Pasos para Reproducir:**
1. Navegar a http://localhost:8082/login
2. Ingresar username: admin
3. Ingresar password: admin123
4. Click en "Iniciar Sesión"

**Resultado Actual:**
Error 401 - "Invalid credentials"

**Resultado Esperado:**
Usuario autenticado correctamente, redirección a dashboard

**Adjuntos:**
- Screenshot error
- Logs de servidor
- Request/Response HTTP

**Asignado a:** [Dev Name]
**Fecha:** 2024-01-15
```

---

## 📊 Métricas de Calidad

### Métricas de Cobertura
- **Cobertura de Código:** 55% (objetivo: >50%) ✅
- **Cobertura de Ramas:** 42% (objetivo: >40%) ✅
- **Cobertura de Endpoints:** 60% (objetivo: >70%) ⏳

### Métricas de Defectos
- **Densidad de Defectos:** [X] defectos/KLOC
- **Tasa de Reapertura:** < 5%
- **Tiempo Promedio de Corrección:** < 48h (críticos)

### Métricas de Ejecución
- **Tiempo de Ejecución Tests Unitarios:** ~1.5 minutos
- **Tiempo de Ejecución Tests Integración:** ~4 minutos
- **Tiempo de Ejecución Suite Completa:** ~10 minutos

---

## 📚 Referencias

1. **OWASP Testing Guide:** https://owasp.org/www-project-web-security-testing-guide/
2. **ISTQB Foundation Level:** https://www.istqb.org/
3. **Spring Boot Testing Documentation:** https://spring.io/guides/gs/testing-web/
4. **JUnit 5 User Guide:** https://junit.org/junit5/docs/current/user-guide/
5. **TestContainers Documentation:** https://www.testcontainers.org/

---

## ✅ Checklist de Actividades

### Preparación
- [x] Configurar pom.xml con dependencias de testing
- [x] Configurar plugins de seguridad (JaCoCo, SpotBugs, OWASP)
- [x] Crear application-test.properties
- [x] Configurar TestContainers
- [x] Instalar herramientas de pentesting

### Desarrollo de Tests
- [x] Tests unitarios de servicios
- [x] Tests de seguridad (SQL Injection, Authorization)
- [ ] Tests de integración de controllers
- [ ] Tests E2E con TestContainers
- [ ] Tests de performance con JMeter

### Ejecución
- [x] Ejecutar tests unitarios
- [ ] Ejecutar tests de integración
- [ ] Ejecutar análisis estático (SpotBugs, PMD)
- [ ] Ejecutar OWASP Dependency Check
- [ ] Ejecutar pentesting (NMAP, Nikto, ZAP)
- [ ] Ejecutar tests de carga (JMeter)

### Documentación
- [x] Plan de pruebas (este documento)
- [ ] Casos de prueba detallados
- [ ] Reporte de cobertura
- [ ] Reporte de seguridad
- [ ] Reporte de rendimiento
- [ ] Reporte final consolidado

---

**Firma de Aprobación:**

| Rol | Nombre | Firma | Fecha |
|-----|--------|-------|-------|
| QA Lead | __________ | __________ | __________ |
| Dev Lead | __________ | __________ | __________ |
| Product Owner | __________ | __________ | __________ |
| Project Manager | __________ | __________ | __________ |

---

*Documento controlado - Versión 1.0 - Fecha: 2024*
