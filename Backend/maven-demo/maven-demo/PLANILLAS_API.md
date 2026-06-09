# Módulo de Pago de Planillas - API REST

## Descripción General
Este módulo gestiona todo el ciclo de vida de la planilla de pagos de empleados, desde el registro de asistencias hasta la generación de boletas de pago.

---

## 📋 Endpoints Disponibles

### 1. **EMPLEADOS** (`/api/empleados`)

#### Listar empleados
```http
GET /api/empleados
GET /api/empleados?estado=ACTIVO
```

**Respuesta exitosa (200):**
```json
[
  {
    "id": 1,
    "nombre": "Juan Pérez García",
    "dni": "12345678",
    "puesto": "Desarrollador",
    "sueldoBase": 3500.00,
    "estado": "ACTIVO"
  }
]
```

#### Obtener empleado por ID
```http
GET /api/empleados/{id}
```

#### Crear empleado
```http
POST /api/empleados
Content-Type: application/json

{
  "nombre": "María López",
  "dni": "87654321",
  "puesto": "Contador",
  "sueldoBase": 4000.00,
  "estado": "ACTIVO"
}
```

#### Actualizar empleado
```http
PUT /api/empleados/{id}
Content-Type: application/json

{
  "nombre": "María López Torres",
  "dni": "87654321",
  "puesto": "Contador Senior",
  "sueldoBase": 4500.00,
  "estado": "ACTIVO"
}
```

#### Cambiar estado de empleado
```http
PATCH /api/empleados/{id}/estado
Content-Type: application/json

{
  "estado": "INACTIVO"
}
```

#### Eliminar empleado
```http
DELETE /api/empleados/{id}
```

---

### 2. **ASISTENCIAS** (`/api/asistencias`)

#### Listar asistencias
```http
GET /api/asistencias
GET /api/asistencias?periodo=202412
GET /api/asistencias?empleadoId=1
GET /api/asistencias?empleadoId=1&periodo=202412
```

**Respuesta exitosa (200):**
```json
[
  {
    "id": 1,
    "empleadoId": 1,
    "empleadoNombre": "Juan Pérez García",
    "fecha": "2024-12-01",
    "horasTrabajadas": 8.00,
    "horasExtra": 2.00,
    "tardanza": 0.25,
    "ausencia": false
  }
]
```

#### Obtener resumen de asistencias
```http
GET /api/asistencias/resumen?empleadoId=1&periodo=202412
```

**Respuesta:**
```json
{
  "totalHorasTrabajadas": 160.00,
  "totalHorasExtra": 10.00,
  "totalTardanzas": 1.50,
  "totalAusencias": 2
}
```

#### Registrar asistencia
```http
POST /api/asistencias
Content-Type: application/json

{
  "empleadoId": 1,
  "fecha": "2024-12-01",
  "horasTrabajadas": 8.00,
  "horasExtra": 2.00,
  "tardanza": 0.00,
  "ausencia": false
}
```

#### Actualizar asistencia
```http
PUT /api/asistencias/{id}
Content-Type: application/json

{
  "empleadoId": 1,
  "fecha": "2024-12-01",
  "horasTrabajadas": 8.00,
  "horasExtra": 3.00,
  "tardanza": 0.50,
  "ausencia": false
}
```

#### Eliminar asistencia
```http
DELETE /api/asistencias/{id}
```

---

### 3. **PRESUPUESTOS** (`/api/presupuestos`)

#### Listar presupuestos
```http
GET /api/presupuestos
```

**Respuesta exitosa (200):**
```json
[
  {
    "id": 1,
    "periodo": "202412",
    "montoTotal": 50000.00
  }
]
```

#### Obtener presupuesto por ID
```http
GET /api/presupuestos/{id}
```

#### Obtener presupuesto por periodo
```http
GET /api/presupuestos/periodo/202412
```

#### Crear presupuesto
```http
POST /api/presupuestos
Content-Type: application/json

{
  "periodo": "202412",
  "montoTotal": 50000.00
}
```

#### Actualizar presupuesto
```http
PUT /api/presupuestos/{id}
Content-Type: application/json

{
  "periodo": "202412",
  "montoTotal": 55000.00
}
```

#### Eliminar presupuesto
```http
DELETE /api/presupuestos/{id}
```

---

### 4. **PLANILLAS** (`/api/planillas`)

#### Listar planillas
```http
GET /api/planillas
```

**Respuesta exitosa (200):**
```json
[
  {
    "id": 1,
    "periodo": "202412",
    "estado": "APROBADA",
    "totalBruto": 48500.00,
    "totalNeto": 42195.00,
    "presupuestoId": 1,
    "pagoId": null,
    "remuneraciones": null
  }
]
```

#### Obtener planilla por ID (con remuneraciones)
```http
GET /api/planillas/{id}
```

**Respuesta:**
```json
{
  "id": 1,
  "periodo": "202412",
  "estado": "APROBADA",
  "totalBruto": 48500.00,
  "totalNeto": 42195.00,
  "presupuestoId": 1,
  "pagoId": null,
  "remuneraciones": [
    {
      "id": 1,
      "empleadoId": 1,
      "empleadoNombre": "Juan Pérez García",
      "empleadoDni": "12345678",
      "planillaId": 1,
      "sueldoBruto": 3750.00,
      "descuentos": 487.50,
      "aportes": 337.50,
      "sueldoNeto": 3262.50
    }
  ]
}
```

#### Obtener planilla por periodo
```http
GET /api/planillas/periodo/202412
```

#### Crear planilla
```http
POST /api/planillas
Content-Type: application/json

{
  "periodo": "202412",
  "presupuestoId": 1
}
```

**Respuesta (201):** Planilla creada con estado "BORRADOR"

#### Calcular remuneraciones de planilla
```http
POST /api/planillas/{id}/calcular
```

**Descripción:** Calcula automáticamente las remuneraciones de todos los empleados activos basándose en:
- Sueldo base del empleado
- Asistencias del periodo (horas extra, tardanzas, ausencias)
- Descuentos (ONP 13%)
- Aportes del empleador (EsSalud 9%)

**Fórmulas aplicadas:**
```
Tarifa por hora = Sueldo base / 160 horas

Pago horas extra = Tarifa hora × 1.25 × Total horas extra

Descuento tardanzas = Tarifa hora × Total horas de tardanza

Descuento ausencias = Tarifa hora × 8 × Total días ausentes

Sueldo bruto = Sueldo base + Pago horas extra - Descuentos tardanzas - Descuentos ausencias

Descuento ONP = Sueldo bruto × 13%

Aporte EsSalud = Sueldo bruto × 9%

Sueldo neto = Sueldo bruto - Descuento ONP
```

#### Aprobar planilla
```http
PUT /api/planillas/{id}/aprobar
```

**Descripción:** Cambia el estado de "BORRADOR" a "APROBADA". Valida que:
- Existan remuneraciones calculadas
- El total no exceda el presupuesto

#### Vincular pago a planilla
```http
PUT /api/planillas/{id}/vincular-pago
Content-Type: application/json

{
  "pagoId": 1
}
```

**Descripción:** Vincula un pago registrado a la planilla y cambia el estado a "PAGADA"

#### Eliminar planilla
```http
DELETE /api/planillas/{id}
```

**Nota:** Solo se pueden eliminar planillas en estado "BORRADOR"

---

### 5. **PAGOS** (`/api/pagos`)

#### Listar pagos
```http
GET /api/pagos
GET /api/pagos?estado=PENDIENTE
```

**Respuesta exitosa (200):**
```json
[
  {
    "id": 1,
    "fechaPago": "2024-12-30",
    "monto": 42195.00,
    "estado": "PENDIENTE"
  }
]
```

#### Obtener pago por ID
```http
GET /api/pagos/{id}
```

#### Crear pago
```http
POST /api/pagos
Content-Type: application/json

{
  "fechaPago": "2024-12-30",
  "monto": 42195.00,
  "estado": "PENDIENTE"
}
```

#### Completar pago
```http
PUT /api/pagos/{id}/completar
```

**Descripción:** Cambia el estado del pago a "COMPLETADO"

#### Actualizar pago
```http
PUT /api/pagos/{id}
Content-Type: application/json

{
  "fechaPago": "2024-12-31",
  "monto": 42195.00,
  "estado": "PENDIENTE"
}
```

**Nota:** No se pueden modificar pagos completados

#### Eliminar pago
```http
DELETE /api/pagos/{id}
```

**Nota:** No se pueden eliminar pagos completados

---

### 6. **BOLETAS DE PAGO** (`/api/boletas`)

#### Listar boletas
```http
GET /api/boletas
GET /api/boletas?pagoId=1
GET /api/boletas?empleadoId=1
```

**Respuesta exitosa (200):**
```json
[
  {
    "id": 1,
    "empleadoId": 1,
    "empleadoNombre": "Juan Pérez García",
    "empleadoDni": "12345678",
    "pagoId": 1,
    "periodo": "202412",
    "sueldoNeto": 3262.50,
    "formato": "PDF",
    "detalleRemuneracion": null
  }
]
```

#### Obtener boleta por ID (con detalle)
```http
GET /api/boletas/{id}
```

**Respuesta:**
```json
{
  "id": 1,
  "empleadoId": 1,
  "empleadoNombre": "Juan Pérez García",
  "empleadoDni": "12345678",
  "pagoId": 1,
  "periodo": "202412",
  "sueldoNeto": 3262.50,
  "formato": "PDF",
  "detalleRemuneracion": {
    "id": 1,
    "empleadoId": 1,
    "empleadoNombre": "Juan Pérez García",
    "empleadoDni": "12345678",
    "planillaId": 1,
    "sueldoBruto": 3750.00,
    "descuentos": 487.50,
    "aportes": 337.50,
    "sueldoNeto": 3262.50
  }
}
```

#### Generar boletas por planilla
```http
POST /api/boletas/generar/{planillaId}
```

**Descripción:** Genera automáticamente boletas de pago para todos los empleados de una planilla en estado "PAGADA"

**Respuesta (201):** Array con todas las boletas generadas

#### Crear boleta manual
```http
POST /api/boletas
Content-Type: application/json

{
  "empleadoId": 1,
  "pagoId": 1,
  "periodo": "202412",
  "sueldoNeto": 3262.50,
  "formato": "PDF"
}
```

#### Eliminar boleta
```http
DELETE /api/boletas/{id}
```

---

## 🔄 Flujo de Trabajo Completo

### Paso 1: Configuración inicial
```http
POST /api/empleados
POST /api/presupuestos
```

### Paso 2: Durante el mes (registro diario)
```http
POST /api/asistencias
```

### Paso 3: Fin de mes - Crear planilla
```http
POST /api/planillas
```

### Paso 4: Calcular remuneraciones
```http
POST /api/planillas/{id}/calcular
GET /api/planillas/{id}  # Revisar cálculos
```

### Paso 5: Aprobar planilla
```http
PUT /api/planillas/{id}/aprobar
```

### Paso 6: Registrar pago
```http
POST /api/pagos
PUT /api/planillas/{id}/vincular-pago
```

### Paso 7: Generar boletas
```http
POST /api/boletas/generar/{planillaId}
```

### Paso 8: Completar pago
```http
PUT /api/pagos/{id}/completar
```

---

## 📊 Estados del Sistema

### Estados de Empleado
- `ACTIVO`: Empleado activo en planilla
- `INACTIVO`: Empleado dado de baja
- `LICENCIA`: Empleado con licencia temporal

### Estados de Planilla
- `BORRADOR`: Planilla creada, se pueden modificar cálculos
- `APROBADA`: Planilla aprobada, lista para pago
- `PAGADA`: Planilla con pago vinculado

### Estados de Pago
- `PENDIENTE`: Pago registrado, aún no procesado
- `PROCESADO`: Pago en proceso
- `COMPLETADO`: Pago realizado y cerrado

---

## ⚠️ Validaciones Implementadas

1. **Empleados:**
   - DNI único en el sistema
   - Campos requeridos: nombre, dni, puesto, sueldoBase

2. **Asistencias:**
   - Empleado debe existir
   - Fecha requerida

3. **Presupuestos:**
   - Periodo único (un presupuesto por periodo)
   - Monto mayor a 0

4. **Planillas:**
   - Periodo único (una planilla por periodo)
   - Debe tener presupuesto asociado
   - Solo se calculan remuneraciones en estado BORRADOR
   - Solo se aprueban planillas con remuneraciones
   - El total no debe exceder el presupuesto

5. **Pagos:**
   - No se modifican pagos completados
   - No se eliminan pagos completados

6. **Boletas:**
   - Solo se generan para planillas PAGADAS
   - No se duplican boletas para el mismo empleado/periodo

---

## 🧮 Tasas y Constantes

```java
ONP = 13% del sueldo bruto
EsSalud = 9% del sueldo bruto (aporte empleador)
Horas mensuales = 160 (20 días × 8 horas)
Tasa hora extra = 125% de la tarifa normal
```

---

## 🚀 Ejemplos de Uso

### Ejemplo completo: Procesar planilla de Diciembre 2024

```bash
# 1. Crear presupuesto
curl -X POST http://localhost:8081/api/presupuestos \
  -H "Content-Type: application/json" \
  -d '{"periodo":"202412","montoTotal":50000.00}'

# 2. Crear planilla
curl -X POST http://localhost:8081/api/planillas \
  -H "Content-Type: application/json" \
  -d '{"periodo":"202412","presupuestoId":1}'

# 3. Calcular remuneraciones
curl -X POST http://localhost:8081/api/planillas/1/calcular

# 4. Revisar planilla
curl http://localhost:8081/api/planillas/1

# 5. Aprobar planilla
curl -X PUT http://localhost:8081/api/planillas/1/aprobar

# 6. Crear pago
curl -X POST http://localhost:8081/api/pagos \
  -H "Content-Type: application/json" \
  -d '{"fechaPago":"2024-12-30","monto":42195.00,"estado":"PENDIENTE"}'

# 7. Vincular pago a planilla
curl -X PUT http://localhost:8081/api/planillas/1/vincular-pago \
  -H "Content-Type: application/json" \
  -d '{"pagoId":1}'

# 8. Generar boletas
curl -X POST http://localhost:8081/api/boletas/generar/1

# 9. Completar pago
curl -X PUT http://localhost:8081/api/pagos/1/completar
```

---

## 📝 Notas Técnicas

- **Base URL:** `http://localhost:8081`
- **CORS:** Habilitado para todos los orígenes (*)
- **Base de datos:** MySQL 8.4
- **Formato de periodo:** YYYYMM (ejemplo: 202412 para Diciembre 2024)
- **Precisión decimal:** 2 decimales para montos
- **Formato de fecha:** ISO-8601 (YYYY-MM-DD)

---

## 🛡️ Seguridad

Todos los endpoints están protegidos por Spring Security. Asegúrate de incluir el token de autenticación en el header:

```http
Authorization: Bearer {token}
```
