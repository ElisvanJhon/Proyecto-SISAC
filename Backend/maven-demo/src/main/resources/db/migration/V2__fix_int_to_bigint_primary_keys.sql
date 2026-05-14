-- Fix: Cambiar todas las Primary Keys de INT a BIGINT para coincidir con Long en Java

-- Primero eliminar todas las Foreign Keys que dependen de las columnas que vamos a modificar
ALTER TABLE asistencias DROP FOREIGN KEY fk_asist_emp;
ALTER TABLE boletas_pago DROP FOREIGN KEY fk_boleta_emp;
ALTER TABLE boletas_pago DROP FOREIGN KEY fk_boleta_pago;
ALTER TABLE calendario_obligaciones DROP FOREIGN KEY fk_cal_contrib;
ALTER TABLE catalogo_productos DROP FOREIGN KEY fk_prod_contrib;
ALTER TABLE comprobantes DROP FOREIGN KEY fk_comp_contrib;
ALTER TABLE comprobantes DROP FOREIGN KEY fk_comp_cliente;
ALTER TABLE comprobante_detalles DROP FOREIGN KEY fk_det_comp;
ALTER TABLE comprobante_detalles DROP FOREIGN KEY fk_det_prod;
ALTER TABLE cvs DROP FOREIGN KEY fk_cv_post;
ALTER TABLE declaraciones DROP FOREIGN KEY fk_decl_contrib;
ALTER TABLE entrevistas DROP FOREIGN KEY fk_entre_post;
ALTER TABLE parametros_tributarios DROP FOREIGN KEY fk_param_contrib;
ALTER TABLE registro_compras DROP FOREIGN KEY fk_compra_contrib;
ALTER TABLE registro_compras DROP FOREIGN KEY fk_compra_prov;
ALTER TABLE registro_ventas DROP FOREIGN KEY fk_regv_comp;
ALTER TABLE remuneraciones DROP FOREIGN KEY fk_rem_emp;
ALTER TABLE remuneraciones DROP FOREIGN KEY fk_rem_plan;
ALTER TABLE reportes DROP FOREIGN KEY fk_rep_contrib;

-- Modificar tipos de datos de INT a BIGINT

-- Tablas principales
ALTER TABLE asistencias MODIFY idAsistencia BIGINT NOT NULL AUTO_INCREMENT;
ALTER TABLE asistencias MODIFY idEmpleado BIGINT NOT NULL;

ALTER TABLE auditoria MODIFY id BIGINT NOT NULL AUTO_INCREMENT;

ALTER TABLE boletas_pago MODIFY idBoleta BIGINT NOT NULL AUTO_INCREMENT;
ALTER TABLE boletas_pago MODIFY idEmpleado BIGINT;
ALTER TABLE boletas_pago MODIFY idPago BIGINT;

ALTER TABLE calendario_obligaciones MODIFY id BIGINT NOT NULL AUTO_INCREMENT;
ALTER TABLE calendario_obligaciones MODIFY contribuyente_id BIGINT NOT NULL;

ALTER TABLE catalogo_productos MODIFY id BIGINT NOT NULL AUTO_INCREMENT;
ALTER TABLE catalogo_productos MODIFY contribuyente_id BIGINT NOT NULL;

ALTER TABLE clientes MODIFY id BIGINT NOT NULL AUTO_INCREMENT;

ALTER TABLE comprobantes MODIFY id BIGINT NOT NULL AUTO_INCREMENT;
ALTER TABLE comprobantes MODIFY contribuyente_id BIGINT NOT NULL;
ALTER TABLE comprobantes MODIFY cliente_id BIGINT NOT NULL;

ALTER TABLE comprobante_detalles MODIFY id BIGINT NOT NULL AUTO_INCREMENT;
ALTER TABLE comprobante_detalles MODIFY comprobante_id BIGINT NOT NULL;
ALTER TABLE comprobante_detalles MODIFY producto_id BIGINT;

ALTER TABLE contribuyentes MODIFY id BIGINT NOT NULL AUTO_INCREMENT;

ALTER TABLE convocatorias MODIFY idConvocatoria BIGINT NOT NULL AUTO_INCREMENT;

ALTER TABLE cvs MODIFY idCV BIGINT NOT NULL AUTO_INCREMENT;
ALTER TABLE cvs MODIFY idPostulante BIGINT;

ALTER TABLE declaraciones MODIFY id BIGINT NOT NULL AUTO_INCREMENT;
ALTER TABLE declaraciones MODIFY contribuyente_id BIGINT NOT NULL;

ALTER TABLE empleados MODIFY idEmpleado BIGINT NOT NULL AUTO_INCREMENT;

ALTER TABLE entrevistas MODIFY idEntrevista BIGINT NOT NULL AUTO_INCREMENT;
ALTER TABLE entrevistas MODIFY idPostulante BIGINT;

ALTER TABLE notificaciones MODIFY idNotificacion BIGINT NOT NULL AUTO_INCREMENT;

ALTER TABLE pagos MODIFY idPago BIGINT NOT NULL AUTO_INCREMENT;

ALTER TABLE parametros_tributarios MODIFY id BIGINT NOT NULL AUTO_INCREMENT;
ALTER TABLE parametros_tributarios MODIFY contribuyente_id BIGINT NOT NULL;

ALTER TABLE planillas MODIFY idPlanilla BIGINT NOT NULL AUTO_INCREMENT;
ALTER TABLE planillas MODIFY idPresupuesto BIGINT;
ALTER TABLE planillas MODIFY idPago BIGINT;

ALTER TABLE postulantes MODIFY idPostulante BIGINT NOT NULL AUTO_INCREMENT;

ALTER TABLE presupuesto_planilla MODIFY idPresupuesto BIGINT NOT NULL AUTO_INCREMENT;

ALTER TABLE proveedores MODIFY id BIGINT NOT NULL AUTO_INCREMENT;

ALTER TABLE registro_compras MODIFY id BIGINT NOT NULL AUTO_INCREMENT;
ALTER TABLE registro_compras MODIFY proveedor_id BIGINT NOT NULL;
ALTER TABLE registro_compras MODIFY contribuyente_id BIGINT NOT NULL;

ALTER TABLE registro_ventas MODIFY id BIGINT NOT NULL AUTO_INCREMENT;
ALTER TABLE registro_ventas MODIFY comprobante_id BIGINT NOT NULL;

ALTER TABLE remuneraciones MODIFY idRemuneracion BIGINT NOT NULL AUTO_INCREMENT;
ALTER TABLE remuneraciones MODIFY idEmpleado BIGINT NOT NULL;
ALTER TABLE remuneraciones MODIFY idPlanilla BIGINT NOT NULL;

ALTER TABLE reportes MODIFY id BIGINT NOT NULL AUTO_INCREMENT;
ALTER TABLE reportes MODIFY contribuyente_id BIGINT NOT NULL;

ALTER TABLE reportes_oficiales MODIFY idReporte BIGINT NOT NULL AUTO_INCREMENT;
ALTER TABLE reportes_oficiales MODIFY idPlantilla BIGINT;

-- Recrear las Foreign Keys con los nuevos tipos
ALTER TABLE asistencias ADD CONSTRAINT fk_asist_emp FOREIGN KEY (idEmpleado) REFERENCES empleados (idEmpleado) ON DELETE CASCADE;

ALTER TABLE boletas_pago ADD CONSTRAINT fk_boleta_emp FOREIGN KEY (idEmpleado) REFERENCES empleados (idEmpleado) ON DELETE SET NULL;
ALTER TABLE boletas_pago ADD CONSTRAINT fk_boleta_pago FOREIGN KEY (idPago) REFERENCES pagos (idPago) ON DELETE SET NULL;

ALTER TABLE calendario_obligaciones ADD CONSTRAINT fk_cal_contrib FOREIGN KEY (contribuyente_id) REFERENCES contribuyentes (id) ON DELETE CASCADE;

ALTER TABLE catalogo_productos ADD CONSTRAINT fk_prod_contrib FOREIGN KEY (contribuyente_id) REFERENCES contribuyentes (id) ON DELETE CASCADE;

ALTER TABLE comprobantes ADD CONSTRAINT fk_comp_contrib FOREIGN KEY (contribuyente_id) REFERENCES contribuyentes (id);
ALTER TABLE comprobantes ADD CONSTRAINT fk_comp_cliente FOREIGN KEY (cliente_id) REFERENCES clientes (id);

ALTER TABLE comprobante_detalles ADD CONSTRAINT fk_det_comp FOREIGN KEY (comprobante_id) REFERENCES comprobantes (id) ON DELETE CASCADE;
ALTER TABLE comprobante_detalles ADD CONSTRAINT fk_det_prod FOREIGN KEY (producto_id) REFERENCES catalogo_productos (id) ON DELETE SET NULL;

ALTER TABLE cvs ADD CONSTRAINT fk_cv_post FOREIGN KEY (idPostulante) REFERENCES postulantes (idPostulante) ON DELETE CASCADE;

ALTER TABLE declaraciones ADD CONSTRAINT fk_decl_contrib FOREIGN KEY (contribuyente_id) REFERENCES contribuyentes (id);

ALTER TABLE entrevistas ADD CONSTRAINT fk_entre_post FOREIGN KEY (idPostulante) REFERENCES postulantes (idPostulante) ON DELETE CASCADE;

ALTER TABLE parametros_tributarios ADD CONSTRAINT fk_param_contrib FOREIGN KEY (contribuyente_id) REFERENCES contribuyentes (id) ON DELETE CASCADE;

ALTER TABLE registro_compras ADD CONSTRAINT fk_compra_contrib FOREIGN KEY (contribuyente_id) REFERENCES contribuyentes (id);
ALTER TABLE registro_compras ADD CONSTRAINT fk_compra_prov FOREIGN KEY (proveedor_id) REFERENCES proveedores (id);

ALTER TABLE registro_ventas ADD CONSTRAINT fk_regv_comp FOREIGN KEY (comprobante_id) REFERENCES comprobantes (id);

ALTER TABLE remuneraciones ADD CONSTRAINT fk_rem_emp FOREIGN KEY (idEmpleado) REFERENCES empleados (idEmpleado) ON DELETE CASCADE;
ALTER TABLE remuneraciones ADD CONSTRAINT fk_rem_plan FOREIGN KEY (idPlanilla) REFERENCES planillas (idPlanilla) ON DELETE CASCADE;

ALTER TABLE reportes ADD CONSTRAINT fk_rep_contrib FOREIGN KEY (contribuyente_id) REFERENCES contribuyentes (id) ON DELETE CASCADE;
