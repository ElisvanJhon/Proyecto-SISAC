-- Script para recrear usuarios con contraseñas correctas
-- Primero eliminar usuarios existentes
DELETE FROM usuarios_admin;

-- Insertar roles si no existen
INSERT IGNORE INTO roles (id, nombre, descripcion) VALUES
(1, 'ADMIN_TRIBUTARIO', 'Administrador de Gestión Tributaria'),
(2, 'GESTOR_PLANILLA', 'Gestor de Pago de Planilla'),
(3, 'GESTOR_CONTRATACION', 'Gestor de Contratación de Personal');

-- Insertar usuarios con hashes BCrypt para la contraseña 'admin123'
-- Hash generado y verificado: $2a$12$7hXBnlgdti2ARlOpvkMUZeA7GADIK0jGRJ6MDGO.2qq5PxLHhYRH2
INSERT INTO usuarios_admin (email, password_hash, nombre, apellido, rol_id, activo) VALUES
('tributario@sisac.com', '$2a$12$7hXBnlgdti2ARlOpvkMUZeA7GADIK0jGRJ6MDGO.2qq5PxLHhYRH2', 'Carlos', 'Tributario', 1, 1),
('planilla@sisac.com', '$2a$12$7hXBnlgdti2ARlOpvkMUZeA7GADIK0jGRJ6MDGO.2qq5PxLHhYRH2', 'María', 'Planilla', 2, 1),
('contratacion@sisac.com', '$2a$12$7hXBnlgdti2ARlOpvkMUZeA7GADIK0jGRJ6MDGO.2qq5PxLHhYRH2', 'Juan', 'Contratación', 3, 1);

-- Verificar que se insertaron correctamente
SELECT 
    ua.id, 
    ua.email, 
    ua.nombre, 
    ua.apellido, 
    r.nombre, 
    ua.activo,
    ua.created_at
FROM usuarios_admin ua 
JOIN roles r ON ua.rol_id = r.id 
WHERE ua.activo = 1;