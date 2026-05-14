# SISAC-ERP Maven Project

Este es el proyecto SISAC-ERP migrado de Gradle a Maven.

## Requisitos

- Java 21
- Maven 3.8+
- MySQL 8.0+

## Comandos Maven

**Nota:** Este proyecto usa Maven Wrapper, no necesitas instalar Maven.

### Compilar el proyecto
```bash
# Windows
.\mvnw.cmd clean compile

# Linux/Mac
./mvnw clean compile
```

### Ejecutar las pruebas
```bash
# Windows
.\mvnw.cmd test

# Linux/Mac
./mvnw test
```

### Construir el JAR
```bash
# Windows
.\mvnw.cmd clean package

# Linux/Mac
./mvnw clean package
```

### Ejecutar la aplicación
```bash
# Windows
.\mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```

### Instalar dependencias
```bash
# Windows
.\mvnw.cmd clean install

# Linux/Mac
./mvnw clean install
```

## Estructura del proyecto

```
maven-demo/
├── pom.xml
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/example/demo/
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/
│           └── com/example/demo/
└── target/ (generado por Maven)
```

## Configuración

La configuración de la base de datos está en `src/main/resources/application.properties`.

## Migración de Gradle

Este proyecto fue migrado desde Gradle manteniendo:
- Todas las dependencias
- Estructura de paquetes
- Configuración de Spring Boot
- Configuración de seguridad y JWT