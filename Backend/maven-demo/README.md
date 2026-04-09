# SISAC-ERP Maven Project

Este es el proyecto SISAC-ERP migrado de Gradle a Maven.

## Requisitos

- Java 21
- Maven 3.8+
- MySQL 8.0+

## Comandos Maven

### Compilar el proyecto
```bash
mvn clean compile
```

### Ejecutar las pruebas
```bash
mvn test
```

### Construir el JAR
```bash
mvn clean package
```

### Ejecutar la aplicación
```bash
mvn spring-boot:run
```

### Instalar dependencias
```bash
mvn clean install
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