DROP DATABASE IF EXISTS sisac;
CREATE DATABASE sisac CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE sisac;

-- contribuyentes
CREATE TABLE contribuyentes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ruc VARCHAR(11) NOT NULL UNIQUE,
  razon_social VARCHAR(255) NOT NULL,
  regimen VARCHAR(100) NOT NULL,
  domicilio VARCHAR(255),
  representante_legal VARCHAR(255),
  cuenta_bancaria VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- parametros_tributarios (versionado)
CREATE TABLE parametros_tributarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  contribuyente_id INT NOT NULL,
  version INT NOT NULL DEFAULT 1,
  tasa_igv DECIMAL(5,2) NOT NULL,
  reglas_redondeo VARCHAR(50),
  formato_exportacion VARCHAR(50),
  vigente_desde DATE,
  vigente_hasta DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_param_contrib FOREIGN KEY (contribuyente_id) REFERENCES contribuyentes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- catalogo_productos
CREATE TABLE catalogo_productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  contribuyente_id INT NOT NULL,
  codigo VARCHAR(50) NOT NULL,
  descripcion VARCHAR(255) NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  afectacion_igv VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_prod_contrib FOREIGN KEY (contribuyente_id) REFERENCES contribuyentes(id) ON DELETE CASCADE,
  UNIQUE KEY uq_contrib_codigo (contribuyente_id, codigo)
) ENGINE=InnoDB;

-- clientes
CREATE TABLE clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ruc_dni VARCHAR(15),
  nombre VARCHAR(255) NOT NULL,
  direccion VARCHAR(255),
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- comprobantes (CPE)
CREATE TABLE comprobantes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  contribuyente_id INT NOT NULL,
  cliente_id INT NOT NULL,
  tipo VARCHAR(20),
  serie VARCHAR(10),
  correlativo INT,
  fecha_emision DATE,
  subtotal DECIMAL(12,2),
  igv DECIMAL(12,2),
  total DECIMAL(12,2),
  xml_path VARCHAR(255),
  pdf_path VARCHAR(255),
  estado VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_comp_contrib FOREIGN KEY (contribuyente_id) REFERENCES contribuyentes(id) ON DELETE RESTRICT,
  CONSTRAINT fk_comp_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE RESTRICT,
  INDEX idx_comprobante_fecha (fecha_emision)
) ENGINE=InnoDB;

-- comprobante_detalles
CREATE TABLE comprobante_detalles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  comprobante_id INT NOT NULL,
  producto_id INT,
  cantidad DECIMAL(10,2) NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  afectacion_igv VARCHAR(50),
  subtotal DECIMAL(12,2),
  igv DECIMAL(12,2),
  total DECIMAL(12,2),
  CONSTRAINT fk_det_comp FOREIGN KEY (comprobante_id) REFERENCES comprobantes(id) ON DELETE CASCADE,
  CONSTRAINT fk_det_prod FOREIGN KEY (producto_id) REFERENCES catalogo_productos(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- registro_ventas
CREATE TABLE registro_ventas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  comprobante_id INT NOT NULL UNIQUE,
  fecha DATE,
  monto_total DECIMAL(12,2),
  igv DECIMAL(12,2),
  estado VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_regv_comp FOREIGN KEY (comprobante_id) REFERENCES comprobantes(id) ON DELETE RESTRICT,
  INDEX idx_regv_fecha (fecha)
) ENGINE=InnoDB;

-- proveedores
CREATE TABLE proveedores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ruc VARCHAR(11),
  razon_social VARCHAR(255),
  direccion VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- registro_compras
CREATE TABLE registro_compras (
  id INT AUTO_INCREMENT PRIMARY KEY,
  proveedor_id INT NOT NULL,
  contribuyente_id INT NOT NULL,
  numero_factura VARCHAR(50),
  fecha_emision DATE,
  monto_total DECIMAL(12,2),
  igv DECIMAL(12,2),
  xml_path VARCHAR(255),
  pdf_path VARCHAR(255),
  validado TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_compra_prov FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE RESTRICT,
  CONSTRAINT fk_compra_contrib FOREIGN KEY (contribuyente_id) REFERENCES contribuyentes(id) ON DELETE RESTRICT,
  INDEX idx_compra_fecha (fecha_emision)
) ENGINE=InnoDB;

-- declaraciones
CREATE TABLE declaraciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  contribuyente_id INT NOT NULL,
  periodo VARCHAR(6),
  igv_debito DECIMAL(12,2),
  igv_credito DECIMAL(12,2),
  igv_neto DECIMAL(12,2),
  renta_pago_cuenta DECIMAL(12,2),
  form_621_pdf VARCHAR(255),
  resumen_igv_pdf VARCHAR(255),
  libro_ventas_xlsx VARCHAR(255),
  libro_compras_xlsx VARCHAR(255),
  paquete_zip VARCHAR(255),
  estado VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_decl_contrib FOREIGN KEY (contribuyente_id) REFERENCES contribuyentes(id) ON DELETE RESTRICT,
  UNIQUE KEY uq_decl_periodo (contribuyente_id, periodo)
) ENGINE=InnoDB;

-- calendario_obligaciones
CREATE TABLE calendario_obligaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  contribuyente_id INT NOT NULL,
  tipo_obligacion VARCHAR(100),
  fecha_vencimiento DATE NOT NULL,
  periodo VARCHAR(6),
  notificado TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_cal_contrib FOREIGN KEY (contribuyente_id) REFERENCES contribuyentes(id) ON DELETE CASCADE,
  INDEX idx_cal_venc (fecha_vencimiento)
) ENGINE=InnoDB;

-- reportes
CREATE TABLE reportes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  contribuyente_id INT NOT NULL,
  tipo VARCHAR(100),
  periodo VARCHAR(6),
  formato VARCHAR(10),
  path VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_rep_contrib FOREIGN KEY (contribuyente_id) REFERENCES contribuyentes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- auditoria
CREATE TABLE auditoria (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario VARCHAR(100),
  entidad VARCHAR(100),
  accion VARCHAR(50),
  valores_antes TEXT,
  valores_despues TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_aud_fecha (created_at)
) ENGINE=InnoDB;

-- ======= Módulo planillas (simplificado) =======
CREATE TABLE empleados (
  idEmpleado INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255),
  dni VARCHAR(15),
  puesto VARCHAR(100),
  sueldoBase DECIMAL(12,2),
  estado VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE asistencias (
  idAsistencia INT AUTO_INCREMENT PRIMARY KEY,
  idEmpleado INT NOT NULL,
  fecha DATE,
  horasTrabajadas DECIMAL(5,2),
  horasExtra DECIMAL(5,2),
  tardanza DECIMAL(5,2),
  ausencia TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_asist_emp FOREIGN KEY (idEmpleado) REFERENCES empleados(idEmpleado) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE planillas (
  idPlanilla INT AUTO_INCREMENT PRIMARY KEY,
  periodo VARCHAR(6),
  estado VARCHAR(50),
  totalBruto DECIMAL(12,2),
  totalNeto DECIMAL(12,2),
  idPresupuesto INT,
  idPago INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE remuneraciones (
  idRemuneracion INT AUTO_INCREMENT PRIMARY KEY,
  idEmpleado INT NOT NULL,
  idPlanilla INT NOT NULL,
  sueldoBruto DECIMAL(12,2),
  descuentos DECIMAL(12,2),
  aportes DECIMAL(12,2),
  sueldoNeto DECIMAL(12,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_rem_emp FOREIGN KEY (idEmpleado) REFERENCES empleados(idEmpleado) ON DELETE CASCADE,
  CONSTRAINT fk_rem_plan FOREIGN KEY (idPlanilla) REFERENCES planillas(idPlanilla) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE presupuesto_planilla (
  idPresupuesto INT AUTO_INCREMENT PRIMARY KEY,
  periodo VARCHAR(6),
  montoTotal DECIMAL(12,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE reportes_oficiales (
  idReporte INT AUTO_INCREMENT PRIMARY KEY,
  tipo VARCHAR(100),
  fechaEmision DATE,
  idPlantilla INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE pagos (
  idPago INT AUTO_INCREMENT PRIMARY KEY,
  fechaPago DATE,
  monto DECIMAL(12,2),
  estado VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE boletas_pago (
  idBoleta INT AUTO_INCREMENT PRIMARY KEY,
  idEmpleado INT,
  idPago INT,
  periodo VARCHAR(6),
  sueldoNeto DECIMAL(12,2),
  formato VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_boleta_emp FOREIGN KEY (idEmpleado) REFERENCES empleados(idEmpleado) ON DELETE SET NULL,
  CONSTRAINT fk_boleta_pago FOREIGN KEY (idPago) REFERENCES pagos(idPago) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ======= Módulo RRHH / Convocatorias (simplificado) =======
CREATE TABLE convocatorias (
  idConvocatoria INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255),
  descripcion TEXT,
  fechaPublicacion DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE postulantes (
  idPostulante INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255),
  dni VARCHAR(15),
  correo VARCHAR(100),
  telefono VARCHAR(50),
  estado VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE cvs (
  idCV INT AUTO_INCREMENT PRIMARY KEY,
  idPostulante INT,
  fechaRecepcion DATE,
  aceptado TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_cv_post FOREIGN KEY (idPostulante) REFERENCES postulantes(idPostulante) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE entrevistas (
  idEntrevista INT AUTO_INCREMENT PRIMARY KEY,
  idPostulante INT,
  fecha DATE,
  hora TIME,
  realiza VARCHAR(255),
  resultado VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_entre_post FOREIGN KEY (idPostulante) REFERENCES postulantes(idPostulante) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE notificaciones (
  idNotificacion INT AUTO_INCREMENT PRIMARY KEY,
  mensaje TEXT,
  fechaEnvio TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
