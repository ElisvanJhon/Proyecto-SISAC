-- V4: Completar conversión de columnas camelCase a snake_case en módulo de planilla

-- 1. Tabla planillas - convertir columnas camelCase y FKs
ALTER TABLE planillas CHANGE COLUMN totalBruto total_bruto DECIMAL(12,2);
ALTER TABLE planillas CHANGE COLUMN totalNeto total_neto DECIMAL(12,2);
ALTER TABLE planillas CHANGE COLUMN idPresupuesto presupuesto_id BIGINT DEFAULT NULL;
ALTER TABLE planillas CHANGE COLUMN idPago pago_id BIGINT DEFAULT NULL;
ALTER TABLE planillas CHANGE COLUMN createdAt created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Agregar Foreign Keys a planillas
ALTER TABLE planillas ADD CONSTRAINT fk_plan_pres FOREIGN KEY (presupuesto_id) REFERENCES presupuesto_planilla(id);
ALTER TABLE planillas ADD CONSTRAINT fk_plan_pago FOREIGN KEY (pago_id) REFERENCES pagos(id);

-- 2. Tabla remuneraciones - convertir columnas camelCase
ALTER TABLE remuneraciones CHANGE COLUMN sueldoBruto sueldo_bruto DECIMAL(12,2);
ALTER TABLE remuneraciones CHANGE COLUMN sueldoNeto sueldo_neto DECIMAL(12,2);
ALTER TABLE remuneraciones CHANGE COLUMN createdAt created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Agregar Foreign Key faltante en remuneraciones hacia empleados
ALTER TABLE remuneraciones ADD CONSTRAINT fk_rem_emp FOREIGN KEY (empleado_id) REFERENCES empleados(id);

-- 3. Agregar Foreign Keys en boletas_pago
ALTER TABLE boletas_pago ADD CONSTRAINT fk_bol_emp FOREIGN KEY (empleado_id) REFERENCES empleados(id);
ALTER TABLE boletas_pago ADD CONSTRAINT fk_bol_pago FOREIGN KEY (pago_id) REFERENCES pagos(id);
