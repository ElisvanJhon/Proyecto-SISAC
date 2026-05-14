-- Script para reparar Flyway y permitir que funcione correctamente
-- Ejecutar este script en MySQL ANTES de reiniciar el backend

USE sisac_db;

-- Eliminar la tabla de historial de Flyway para empezar de cero
DROP TABLE IF EXISTS flyway_schema_history;

-- Flyway la recreará automáticamente al iniciar
-- y ejecutará solo las migraciones necesarias

-- INSTRUCCIONES:
-- 1. Ejecutar este script en MySQL Workbench, phpMyAdmin o línea de comandos:
--    mysql -u root -p sisac_db < flyway_repair.sql
-- 2. Reiniciar el backend: .\mvnw.cmd spring-boot:run
-- 3. Flyway detectará el esquema existente y solo aplicará migraciones faltantes
