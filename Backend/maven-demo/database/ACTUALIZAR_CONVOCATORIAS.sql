-- ========================================================
-- SCRIPT PARA ACTUALIZAR TABLAS DE MÓDULO CONVOCATORIAS
-- ========================================================
-- Ejecuta este script en tu base de datos sisac_db
-- ========================================================

USE sisac_db;

-- ========================================================
-- 1. ELIMINAR TABLAS ANTIGUAS (si existen)
-- ========================================================

DROP TABLE IF EXISTS `entrevistas`;
DROP TABLE IF EXISTS `postulaciones`;
DROP TABLE IF EXISTS `candidatos`;
DROP TABLE IF EXISTS `convocatoria`;

-- ========================================================
-- 2. CREAR TABLA: convocatoria
-- ========================================================

CREATE TABLE `convocatoria` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `titulo` VARCHAR(200) NOT NULL,
  `fecha_publicacion` DATE NOT NULL,
  `descripcion` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ========================================================
-- 3. CREAR TABLA: candidato
-- ========================================================

CREATE TABLE `candidato` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `nombres_apellidos` VARCHAR(200) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `telefono` VARCHAR(20),
  `cv_adjunto` VARCHAR(500),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ========================================================
-- 4. CREAR TABLA: postulacion
-- ========================================================

CREATE TABLE `postulacion` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `convocatoria_id` VARCHAR(50) NOT NULL,
  `candidato_id` VARCHAR(50) NOT NULL,
  `fecha_evaluacion` DATE NOT NULL,
  `estado` VARCHAR(50) NOT NULL DEFAULT 'En Proceso',
  `observaciones` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`convocatoria_id`) REFERENCES `convocatoria`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`candidato_id`) REFERENCES `candidato`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ========================================================
-- 5. CREAR TABLA: entrevistas
-- ========================================================

CREATE TABLE `entrevistas` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `convocatoria_id` VARCHAR(50) NOT NULL,
  `candidato_id` VARCHAR(50) NOT NULL,
  `nombre_evaluador` VARCHAR(100) NOT NULL,
  `resultado` VARCHAR(200) NOT NULL,
  `fecha_evaluacion` DATE NOT NULL,
  `observaciones` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`convocatoria_id`) REFERENCES `convocatoria`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`candidato_id`) REFERENCES `candidato`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ========================================================
-- 6. DATOS DE PRUEBA (OPCIONAL)
-- ========================================================

-- Convocatorias de ejemplo
INSERT INTO `convocatoria` (`id`, `titulo`, `fecha_publicacion`, `descripcion`) VALUES
('CONV-2025-001', 'Desarrollador Backend Java', '2025-01-15', 'Se busca desarrollador con experiencia en Spring Boot y microservicios'),
('CONV-2025-002', 'Analista de Sistemas', '2025-01-20', 'Analista con conocimientos en levantamiento de requerimientos y UML');

-- Candidatos de ejemplo
INSERT INTO `candidato` (`id`, `nombres_apellidos`, `email`, `telefono`, `cv_adjunto`) VALUES
('CAND-001', 'Juan Carlos Pérez López', 'juan.perez@email.com', '987654321', 'https://drive.google.com/cv-juan-perez'),
('CAND-002', 'María Fernanda García Torres', 'maria.garcia@email.com', '987654322', 'https://drive.google.com/cv-maria-garcia'),
('CAND-003', 'Luis Alberto Rodríguez Sánchez', 'luis.rodriguez@email.com', '987654323', 'https://drive.google.com/cv-luis-rodriguez');

-- Postulaciones de ejemplo
INSERT INTO `postulacion` (`id`, `convocatoria_id`, `candidato_id`, `fecha_evaluacion`, `estado`, `observaciones`) VALUES
('POST-001', 'CONV-2025-001', 'CAND-001', '2025-01-16', 'En Proceso', 'Candidato con buen perfil técnico'),
('POST-002', 'CONV-2025-001', 'CAND-002', '2025-01-17', 'Aceptado', 'Excelente experiencia en Spring Boot'),
('POST-003', 'CONV-2025-002', 'CAND-003', '2025-01-21', 'En Proceso', 'Pendiente de entrevista');

-- Entrevistas de ejemplo
INSERT INTO `entrevistas` (`id`, `convocatoria_id`, `candidato_id`, `nombre_evaluador`, `resultado`, `fecha_evaluacion`, `observaciones`) VALUES
('ENT-001', 'CONV-2025-001', 'CAND-002', 'Carlos Mendoza', 'Aprobado - Excelente conocimiento técnico', '2025-01-18', 'Candidato demuestra sólidos conocimientos en Java y Spring Boot'),
('ENT-002', 'CONV-2025-002', 'CAND-003', 'Ana Flores', 'En evaluación', '2025-01-22', 'Entrevista pendiente de segunda ronda');

-- ========================================================
-- SCRIPT COMPLETADO
-- ========================================================
-- Verifica que las tablas se crearon correctamente:
-- SHOW TABLES LIKE '%convocator%';
-- SHOW TABLES LIKE '%candidat%';
-- SHOW TABLES LIKE '%postulac%';
-- SHOW TABLES LIKE '%entrevist%';
-- ========================================================
