-- SISAC-ERP Initial Database Schema
-- Version: 1.0
-- Description: Creates all 28 tables with relationships and initial data

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- Tabla de roles para el sistema de autenticación
-- --------------------------------------------------------

CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Tabla de usuarios administrativos
-- --------------------------------------------------------

CREATE TABLE `usuarios_admin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL UNIQUE,
  `password_hash` varchar(255) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `rol_id` int(11) NOT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_rol` (`rol_id`),
  CONSTRAINT `fk_usuarios_admin_rol` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Estructura de tabla para la tabla `asistencias`
-- --------------------------------------------------------

CREATE TABLE `asistencias` (
  `idAsistencia` int(11) NOT NULL,
  `idEmpleado` int(11) NOT NULL,
  `fecha` date DEFAULT NULL,
  `horasTrabajadas` decimal(5,2) DEFAULT NULL,
  `horasExtra` decimal(5,2) DEFAULT NULL,
  `tardanza` decimal(5,2) DEFAULT NULL,
  `ausencia` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Estructura de tabla para la tabla `auditoria`
-- --------------------------------------------------------

CREATE TABLE `auditoria` (
  `id` int(11) NOT NULL,
  `usuario` varchar(100) DEFAULT NULL,
  `entidad` varchar(100) DEFAULT NULL,
  `accion` varchar(50) DEFAULT NULL,
  `valores_antes` text DEFAULT NULL,
  `valores_despues` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Estructura de tabla para la tabla `boletas_pago`
-- --------------------------------------------------------

CREATE TABLE `boletas_pago` (
  `idBoleta` int(11) NOT NULL,
  `idEmpleado` int(11) DEFAULT NULL,
  `idPago` int(11) DEFAULT NULL,
  `periodo` varchar(6) DEFAULT NULL,
  `sueldoNeto` decimal(12,2) DEFAULT NULL,
  `formato` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Estructura de tabla para la tabla `calendario_obligaciones`
-- --------------------------------------------------------

CREATE TABLE `calendario_obligaciones` (
  `id` int(11) NOT NULL,
  `contribuyente_id` int(11) NOT NULL,
  `tipo_obligacion` varchar(100) DEFAULT NULL,
  `fecha_vencimiento` date NOT NULL,
  `periodo` varchar(6) DEFAULT NULL,
  `notificado` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Estructura de tabla para la tabla `catalogo_productos`
-- --------------------------------------------------------

CREATE TABLE `catalogo_productos` (
  `id` int(11) NOT NULL,
  `contribuyente_id` int(11) NOT NULL,
  `codigo` varchar(50) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `afectacion_igv` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Estructura de tabla para la tabla `clientes`
-- --------------------------------------------------------

CREATE TABLE `clientes` (
  `id` int(11) NOT NULL,
  `ruc_dni` varchar(15) DEFAULT NULL,
  `nombre` varchar(255) NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Estructura de tabla para la tabla `comprobantes`
-- --------------------------------------------------------

CREATE TABLE `comprobantes` (
  `id` int(11) NOT NULL,
  `contribuyente_id` int(11) NOT NULL,
  `cliente_id` int(11) NOT NULL,
  `tipo` varchar(20) DEFAULT NULL,
  `serie` varchar(10) DEFAULT NULL,
  `correlativo` int(11) DEFAULT NULL,
  `fecha_emision` date DEFAULT NULL,
  `subtotal` decimal(12,2) DEFAULT NULL,
  `igv` decimal(12,2) DEFAULT NULL,
  `total` decimal(12,2) DEFAULT NULL,
  `xml_path` varchar(255) DEFAULT NULL,
  `pdf_path` varchar(255) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Estructura de tabla para la tabla `comprobante_detalles`
-- --------------------------------------------------------

CREATE TABLE `comprobante_detalles` (
  `id` int(11) NOT NULL,
  `comprobante_id` int(11) NOT NULL,
  `producto_id` int(11) DEFAULT NULL,
  `cantidad` decimal(10,2) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `afectacion_igv` varchar(50) DEFAULT NULL,
  `subtotal` decimal(12,2) DEFAULT NULL,
  `igv` decimal(12,2) DEFAULT NULL,
  `total` decimal(12,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Estructura de tabla para la tabla `contribuyentes`
-- --------------------------------------------------------

CREATE TABLE `contribuyentes` (
  `id` int(11) NOT NULL,
  `ruc` varchar(11) NOT NULL,
  `razon_social` varchar(255) NOT NULL,
  `regimen` varchar(100) NOT NULL,
  `domicilio` varchar(255) DEFAULT NULL,
  `representante_legal` varchar(255) DEFAULT NULL,
  `cuenta_bancaria` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Estructura de tabla para la tabla `convocatorias`
-- --------------------------------------------------------

CREATE TABLE `convocatorias` (
  `idConvocatoria` int(11) NOT NULL,
  `titulo` varchar(255) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `fechaPublicacion` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Estructura de tabla para la tabla `cvs`
-- --------------------------------------------------------

CREATE TABLE `cvs` (
  `idCV` int(11) NOT NULL,
  `idPostulante` int(11) DEFAULT NULL,
  `fechaRecepcion` date DEFAULT NULL,
  `aceptado` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Estructura de tabla para la tabla `declaraciones`
-- --------------------------------------------------------

CREATE TABLE `declaraciones` (
  `id` int(11) NOT NULL,
  `contribuyente_id` int(11) NOT NULL,
  `periodo` varchar(6) DEFAULT NULL,
  `igv_debito` decimal(12,2) DEFAULT NULL,
  `igv_credito` decimal(12,2) DEFAULT NULL,
  `igv_neto` decimal(12,2) DEFAULT NULL,
  `renta_pago_cuenta` decimal(12,2) DEFAULT NULL,
  `form_621_pdf` varchar(255) DEFAULT NULL,
  `resumen_igv_pdf` varchar(255) DEFAULT NULL,
  `libro_ventas_xlsx` varchar(255) DEFAULT NULL,
  `libro_compras_xlsx` varchar(255) DEFAULT NULL,
  `paquete_zip` varchar(255) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Estructura de tabla para la tabla `empleados`
-- --------------------------------------------------------

CREATE TABLE `empleados` (
  `idEmpleado` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `dni` varchar(15) DEFAULT NULL,
  `puesto` varchar(100) DEFAULT NULL,
  `sueldoBase` decimal(12,2) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Estructura de tabla para la tabla `entrevistas`
-- --------------------------------------------------------

CREATE TABLE `entrevistas` (
  `idEntrevista` int(11) NOT NULL,
  `idPostulante` int(11) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `realiza` varchar(255) DEFAULT NULL,
  `resultado` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Estructura de tabla para la tabla `notificaciones`
-- --------------------------------------------------------

CREATE TABLE `notificaciones` (
  `idNotificacion` int(11) NOT NULL,
  `mensaje` text DEFAULT NULL,
  `fechaEnvio` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Estructura de tabla para la tabla `pagos`
-- --------------------------------------------------------

CREATE TABLE `pagos` (
  `idPago` int(11) NOT NULL,
  `fechaPago` date DEFAULT NULL,
  `monto` decimal(12,2) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Estructura de tabla para la tabla `parametros_tributarios`
-- --------------------------------------------------------

CREATE TABLE `parametros_tributarios` (
  `id` int(11) NOT NULL,
  `contribuyente_id` int(11) NOT NULL,
  `version` int(11) NOT NULL DEFAULT 1,
  `tasa_igv` decimal(5,2) NOT NULL,
  `reglas_redondeo` varchar(50) DEFAULT NULL,
  `formato_exportacion` varchar(50) DEFAULT NULL,
  `vigente_desde` date DEFAULT NULL,
  `vigente_hasta` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Estructura de tabla para la tabla `planillas`
-- --------------------------------------------------------

CREATE TABLE `planillas` (
  `idPlanilla` int(11) NOT NULL,
  `periodo` varchar(6) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  `totalBruto` decimal(12,2) DEFAULT NULL,
  `totalNeto` decimal(12,2) DEFAULT NULL,
  `idPresupuesto` int(11) DEFAULT NULL,
  `idPago` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Estructura de tabla para la tabla `postulantes`
-- --------------------------------------------------------

CREATE TABLE `postulantes` (
  `idPostulante` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `dni` varchar(15) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Estructura de tabla para la tabla `presupuesto_planilla`
-- --------------------------------------------------------

CREATE TABLE `presupuesto_planilla` (
  `idPresupuesto` int(11) NOT NULL,
  `periodo` varchar(6) DEFAULT NULL,
  `montoTotal` decimal(12,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Estructura de tabla para la tabla `proveedores`
-- --------------------------------------------------------

CREATE TABLE `proveedores` (
  `id` int(11) NOT NULL,
  `ruc` varchar(11) DEFAULT NULL,
  `razon_social` varchar(255) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Estructura de tabla para la tabla `registro_compras`
-- --------------------------------------------------------

CREATE TABLE `registro_compras` (
  `id` int(11) NOT NULL,
  `proveedor_id` int(11) NOT NULL,
  `contribuyente_id` int(11) NOT NULL,
  `numero_factura` varchar(50) DEFAULT NULL,
  `fecha_emision` date DEFAULT NULL,
  `monto_total` decimal(12,2) DEFAULT NULL,
  `igv` decimal(12,2) DEFAULT NULL,
  `xml_path` varchar(255) DEFAULT NULL,
  `pdf_path` varchar(255) DEFAULT NULL,
  `validado` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Estructura de tabla para la tabla `registro_ventas`
-- --------------------------------------------------------

CREATE TABLE `registro_ventas` (
  `id` int(11) NOT NULL,
  `comprobante_id` int(11) NOT NULL,
  `fecha` date DEFAULT NULL,
  `monto_total` decimal(12,2) DEFAULT NULL,
  `igv` decimal(12,2) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Estructura de tabla para la tabla `remuneraciones`
-- --------------------------------------------------------

CREATE TABLE `remuneraciones` (
  `idRemuneracion` int(11) NOT NULL,
  `idEmpleado` int(11) NOT NULL,
  `idPlanilla` int(11) NOT NULL,
  `sueldoBruto` decimal(12,2) DEFAULT NULL,
  `descuentos` decimal(12,2) DEFAULT NULL,
  `aportes` decimal(12,2) DEFAULT NULL,
  `sueldoNeto` decimal(12,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Estructura de tabla para la tabla `reportes`
-- --------------------------------------------------------

CREATE TABLE `reportes` (
  `id` int(11) NOT NULL,
  `contribuyente_id` int(11) NOT NULL,
  `tipo` varchar(100) DEFAULT NULL,
  `periodo` varchar(6) DEFAULT NULL,
  `formato` varchar(10) DEFAULT NULL,
  `path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Estructura de tabla para la tabla `reportes_oficiales`
-- --------------------------------------------------------

CREATE TABLE `reportes_oficiales` (
  `idReporte` int(11) NOT NULL,
  `tipo` varchar(100) DEFAULT NULL,
  `fechaEmision` date DEFAULT NULL,
  `idPlantilla` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Índices para tablas
-- --------------------------------------------------------

ALTER TABLE `asistencias`
  ADD PRIMARY KEY (`idAsistencia`),
  ADD KEY `fk_asist_emp` (`idEmpleado`);

ALTER TABLE `auditoria`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_aud_fecha` (`created_at`);

ALTER TABLE `boletas_pago`
  ADD PRIMARY KEY (`idBoleta`),
  ADD KEY `fk_boleta_emp` (`idEmpleado`),
  ADD KEY `fk_boleta_pago` (`idPago`);

ALTER TABLE `calendario_obligaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_cal_contrib` (`contribuyente_id`),
  ADD KEY `idx_cal_venc` (`fecha_vencimiento`);

ALTER TABLE `catalogo_productos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_contrib_codigo` (`contribuyente_id`,`codigo`);

ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `comprobantes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_comp_contrib` (`contribuyente_id`),
  ADD KEY `fk_comp_cliente` (`cliente_id`),
  ADD KEY `idx_comprobante_fecha` (`fecha_emision`);

ALTER TABLE `comprobante_detalles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_det_comp` (`comprobante_id`),
  ADD KEY `fk_det_prod` (`producto_id`);

ALTER TABLE `contribuyentes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ruc` (`ruc`);

ALTER TABLE `convocatorias`
  ADD PRIMARY KEY (`idConvocatoria`);

ALTER TABLE `cvs`
  ADD PRIMARY KEY (`idCV`),
  ADD KEY `fk_cv_post` (`idPostulante`);

ALTER TABLE `declaraciones`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_decl_periodo` (`contribuyente_id`,`periodo`);

ALTER TABLE `empleados`
  ADD PRIMARY KEY (`idEmpleado`);

ALTER TABLE `entrevistas`
  ADD PRIMARY KEY (`idEntrevista`),
  ADD KEY `fk_entre_post` (`idPostulante`);

ALTER TABLE `notificaciones`
  ADD PRIMARY KEY (`idNotificacion`);

ALTER TABLE `pagos`
  ADD PRIMARY KEY (`idPago`);

ALTER TABLE `parametros_tributarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_param_contrib` (`contribuyente_id`);

ALTER TABLE `planillas`
  ADD PRIMARY KEY (`idPlanilla`);

ALTER TABLE `postulantes`
  ADD PRIMARY KEY (`idPostulante`);

ALTER TABLE `presupuesto_planilla`
  ADD PRIMARY KEY (`idPresupuesto`);

ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `registro_compras`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_compra_prov` (`proveedor_id`),
  ADD KEY `fk_compra_contrib` (`contribuyente_id`),
  ADD KEY `idx_compra_fecha` (`fecha_emision`);

ALTER TABLE `registro_ventas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `comprobante_id` (`comprobante_id`),
  ADD KEY `idx_regv_fecha` (`fecha`);

ALTER TABLE `remuneraciones`
  ADD PRIMARY KEY (`idRemuneracion`),
  ADD KEY `fk_rem_emp` (`idEmpleado`),
  ADD KEY `fk_rem_plan` (`idPlanilla`);

ALTER TABLE `reportes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_rep_contrib` (`contribuyente_id`);

ALTER TABLE `reportes_oficiales`
  ADD PRIMARY KEY (`idReporte`);

-- --------------------------------------------------------
-- AUTO_INCREMENT de las tablas
-- --------------------------------------------------------

ALTER TABLE `asistencias`
  MODIFY `idAsistencia` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `auditoria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `boletas_pago`
  MODIFY `idBoleta` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `calendario_obligaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `catalogo_productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `clientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `comprobantes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `comprobante_detalles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `contribuyentes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `convocatorias`
  MODIFY `idConvocatoria` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `cvs`
  MODIFY `idCV` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `declaraciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `empleados`
  MODIFY `idEmpleado` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `entrevistas`
  MODIFY `idEntrevista` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `notificaciones`
  MODIFY `idNotificacion` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `pagos`
  MODIFY `idPago` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `parametros_tributarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `planillas`
  MODIFY `idPlanilla` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `postulantes`
  MODIFY `idPostulante` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `presupuesto_planilla`
  MODIFY `idPresupuesto` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `proveedores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `registro_compras`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `registro_ventas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `remuneraciones`
  MODIFY `idRemuneracion` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `reportes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `reportes_oficiales`
  MODIFY `idReporte` int(11) NOT NULL AUTO_INCREMENT;

-- --------------------------------------------------------
-- Restricciones para tablas (Foreign Keys)
-- --------------------------------------------------------

ALTER TABLE `asistencias`
  ADD CONSTRAINT `fk_asist_emp` FOREIGN KEY (`idEmpleado`) REFERENCES `empleados` (`idEmpleado`) ON DELETE CASCADE;

ALTER TABLE `boletas_pago`
  ADD CONSTRAINT `fk_boleta_emp` FOREIGN KEY (`idEmpleado`) REFERENCES `empleados` (`idEmpleado`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_boleta_pago` FOREIGN KEY (`idPago`) REFERENCES `pagos` (`idPago`) ON DELETE SET NULL;

ALTER TABLE `calendario_obligaciones`
  ADD CONSTRAINT `fk_cal_contrib` FOREIGN KEY (`contribuyente_id`) REFERENCES `contribuyentes` (`id`) ON DELETE CASCADE;

ALTER TABLE `catalogo_productos`
  ADD CONSTRAINT `fk_prod_contrib` FOREIGN KEY (`contribuyente_id`) REFERENCES `contribuyentes` (`id`) ON DELETE CASCADE;

ALTER TABLE `comprobantes`
  ADD CONSTRAINT `fk_comp_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`),
  ADD CONSTRAINT `fk_comp_contrib` FOREIGN KEY (`contribuyente_id`) REFERENCES `contribuyentes` (`id`);

ALTER TABLE `comprobante_detalles`
  ADD CONSTRAINT `fk_det_comp` FOREIGN KEY (`comprobante_id`) REFERENCES `comprobantes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_det_prod` FOREIGN KEY (`producto_id`) REFERENCES `catalogo_productos` (`id`) ON DELETE SET NULL;

ALTER TABLE `cvs`
  ADD CONSTRAINT `fk_cv_post` FOREIGN KEY (`idPostulante`) REFERENCES `postulantes` (`idPostulante`) ON DELETE CASCADE;

ALTER TABLE `declaraciones`
  ADD CONSTRAINT `fk_decl_contrib` FOREIGN KEY (`contribuyente_id`) REFERENCES `contribuyentes` (`id`);

ALTER TABLE `entrevistas`
  ADD CONSTRAINT `fk_entre_post` FOREIGN KEY (`idPostulante`) REFERENCES `postulantes` (`idPostulante`) ON DELETE CASCADE;

ALTER TABLE `parametros_tributarios`
  ADD CONSTRAINT `fk_param_contrib` FOREIGN KEY (`contribuyente_id`) REFERENCES `contribuyentes` (`id`) ON DELETE CASCADE;

ALTER TABLE `registro_compras`
  ADD CONSTRAINT `fk_compra_contrib` FOREIGN KEY (`contribuyente_id`) REFERENCES `contribuyentes` (`id`),
  ADD CONSTRAINT `fk_compra_prov` FOREIGN KEY (`proveedor_id`) REFERENCES `proveedores` (`id`);

ALTER TABLE `registro_ventas`
  ADD CONSTRAINT `fk_regv_comp` FOREIGN KEY (`comprobante_id`) REFERENCES `comprobantes` (`id`);

ALTER TABLE `remuneraciones`
  ADD CONSTRAINT `fk_rem_emp` FOREIGN KEY (`idEmpleado`) REFERENCES `empleados` (`idEmpleado`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_rem_plan` FOREIGN KEY (`idPlanilla`) REFERENCES `planillas` (`idPlanilla`) ON DELETE CASCADE;

ALTER TABLE `reportes`
  ADD CONSTRAINT `fk_rep_contrib` FOREIGN KEY (`contribuyente_id`) REFERENCES `contribuyentes` (`id`) ON DELETE CASCADE;

-- --------------------------------------------------------
-- Datos iniciales para autenticación
-- --------------------------------------------------------

-- Insertar roles del sistema
INSERT INTO roles (nombre, descripcion) VALUES 
('ADMIN_TRIBUTARIO', 'Administrador de Gestión Tributaria'),
('GESTOR_PLANILLA', 'Gestor de Pago de Planilla'), 
('GESTOR_CONTRATACION', 'Gestor de Contratación de Personal');

-- Insertar usuarios de prueba (contraseña: admin123)
INSERT INTO usuarios_admin (email, password_hash, nombre, apellido, rol_id) VALUES
('tributario@sisac.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lbCOIQce8QdHdEixC', 'Carlos', 'Tributario', 1),
('planilla@sisac.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lbCOIQce8QdHdEixC', 'María', 'Planilla', 2),
('contratacion@sisac.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lbCOIQce8QdHdEixC', 'Juan', 'Contratación', 3);
