import React from 'react';
import '../styles/MastersConfigPage.css';

const MastersConfigPage = () => {
  return (
    <div className="masters-config-page">
      <div className="page-header">
        <h1>📊 Configuración de Maestros y Fórmulas</h1>
        <p className="subtitle">Información sobre los datos maestros y cálculos del sistema de planillas</p>
      </div>

      {/* Datos Maestros */}
      <div className="config-section">
        <h2>👥 Datos Maestros de Empleados</h2>
        <div className="info-card">
          <h3>Campos Almacenados</h3>
          <ul className="field-list">
            <li><strong>ID:</strong> Identificador único generado automáticamente</li>
            <li><strong>Nombre Completo:</strong> Nombre y apellidos del empleado</li>
            <li><strong>DNI:</strong> Documento Nacional de Identidad (8 dígitos, único)</li>
            <li><strong>Puesto:</strong> Cargo o posición del empleado</li>
            <li><strong>Sueldo Base:</strong> Remuneración mensual base antes de descuentos</li>
            <li><strong>Estado:</strong> ACTIVO, INACTIVO o ELIMINADO</li>
            <li><strong>Fecha de Creación:</strong> Registro automático de alta en el sistema</li>
          </ul>
          <div className="note-box">
            <strong>⚠️ Nota importante:</strong> Solo empleados con estado ACTIVO son incluidos en el cálculo de planillas.
          </div>
        </div>
      </div>

      {/* Datos de Planilla */}
      <div className="config-section">
        <h2>📋 Datos Maestros de Planillas</h2>
        <div className="info-card">
          <h3>Campos Almacenados</h3>
          <ul className="field-list">
            <li><strong>ID:</strong> Identificador único de la planilla</li>
            <li><strong>Periodo:</strong> Formato YYYYMM (ej: 202512 = Diciembre 2025)</li>
            <li><strong>Estado:</strong> BORRADOR → CALCULADO → APROBADO</li>
            <li><strong>Total Bruto:</strong> Suma de todos los sueldos brutos</li>
            <li><strong>Total Neto:</strong> Suma de todos los sueldos netos</li>
            <li><strong>Fecha de Creación:</strong> Registro automático</li>
          </ul>
          <div className="note-box">
            <strong>📌 Flujo de Estados:</strong>
            <ol>
              <li>BORRADOR: Planilla creada, pendiente de cálculo</li>
              <li>CALCULADO: Remuneraciones calculadas, lista para revisión</li>
              <li>APROBADO: Planilla finalizada y bloqueada</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Fórmulas de Cálculo */}
      <div className="config-section">
        <h2>🧮 Fórmulas de Cálculo de Planilla</h2>
        
        <div className="formula-card">
          <h3>1. Sueldo Bruto</h3>
          <div className="formula-box">
            <code>Sueldo Bruto = Sueldo Base del Empleado</code>
          </div>
          <p className="formula-desc">El sueldo bruto es el monto base antes de cualquier descuento o aporte.</p>
        </div>

        <div className="formula-card">
          <h3>2. Descuentos del Empleado</h3>
          <div className="formula-box">
            <code>Descuentos = Sueldo Bruto × 13%</code>
          </div>
          <p className="formula-desc">Incluye AFP/ONP (pensiones) del empleado. Porcentaje aplicado: 13%</p>
          <div className="example-box">
            <strong>Ejemplo:</strong> Si Sueldo Bruto = S/ 5,000.00<br/>
            Descuentos = 5,000 × 0.13 = <strong>S/ 650.00</strong>
          </div>
        </div>

        <div className="formula-card">
          <h3>3. Aportes del Empleador</h3>
          <div className="formula-box">
            <code>Aportes = Sueldo Bruto × 9%</code>
          </div>
          <p className="formula-desc">Contribuciones del empleador a EsSalud. Porcentaje aplicado: 9%</p>
          <div className="example-box">
            <strong>Ejemplo:</strong> Si Sueldo Bruto = S/ 5,000.00<br/>
            Aportes = 5,000 × 0.09 = <strong>S/ 450.00</strong>
          </div>
        </div>

        <div className="formula-card highlight">
          <h3>4. Sueldo Neto (A Pagar)</h3>
          <div className="formula-box">
            <code>Sueldo Neto = Sueldo Bruto - Descuentos</code>
          </div>
          <p className="formula-desc">Es el monto que efectivamente recibe el empleado después de descuentos.</p>
          <div className="example-box">
            <strong>Ejemplo Completo:</strong><br/>
            • Sueldo Bruto: S/ 5,000.00<br/>
            • Descuentos (13%): S/ 650.00<br/>
            • Sueldo Neto: 5,000 - 650 = <strong>S/ 4,350.00</strong>
          </div>
        </div>

        <div className="formula-card">
          <h3>5. Totales de Planilla</h3>
          <div className="formula-box">
            <code>Total Bruto = Σ (Sueldo Bruto de cada empleado)</code><br/>
            <code>Total Neto = Σ (Sueldo Neto de cada empleado)</code>
          </div>
          <p className="formula-desc">La suma de todos los empleados activos incluidos en la planilla.</p>
        </div>
      </div>

      {/* Parámetros del Sistema */}
      <div className="config-section">
        <h2>⚙️ Parámetros Actuales del Sistema</h2>
        <div className="params-grid">
          <div className="param-card">
            <div className="param-icon">📊</div>
            <div className="param-info">
              <h4>Descuento AFP/ONP</h4>
              <p className="param-value">13%</p>
              <p className="param-desc">Aplicado sobre sueldo bruto</p>
            </div>
          </div>
          
          <div className="param-card">
            <div className="param-icon">🏥</div>
            <div className="param-info">
              <h4>Aporte EsSalud</h4>
              <p className="param-value">9%</p>
              <p className="param-desc">Asumido por el empleador</p>
            </div>
          </div>
          
          <div className="param-card">
            <div className="param-icon">💰</div>
            <div className="param-info">
              <h4>Sueldo Mínimo</h4>
              <p className="param-value">S/ 1,025.00</p>
              <p className="param-desc">RMV vigente 2025</p>
            </div>
          </div>
          
          <div className="param-card">
            <div className="param-icon">🔢</div>
            <div className="param-info">
              <h4>Redondeo</h4>
              <p className="param-value">2 decimales</p>
              <p className="param-desc">Todos los montos en soles</p>
            </div>
          </div>
        </div>
      </div>

      {/* Validaciones */}
      <div className="config-section">
        <h2>✅ Validaciones del Sistema</h2>
        <div className="validation-grid">
          <div className="validation-item">
            <span className="check-icon">✓</span>
            <div>
              <strong>DNI único:</strong> No se permite duplicar DNI entre empleados
            </div>
          </div>
          <div className="validation-item">
            <span className="check-icon">✓</span>
            <div>
              <strong>Periodo único:</strong> Solo una planilla por periodo (YYYYMM)
            </div>
          </div>
          <div className="validation-item">
            <span className="check-icon">✓</span>
            <div>
              <strong>Sueldo base positivo:</strong> Debe ser mayor a cero
            </div>
          </div>
          <div className="validation-item">
            <span className="check-icon">✓</span>
            <div>
              <strong>Solo empleados activos:</strong> Estado debe ser ACTIVO para incluir en planilla
            </div>
          </div>
          <div className="validation-item">
            <span className="check-icon">✓</span>
            <div>
              <strong>Cálculo en BORRADOR:</strong> Solo se puede calcular planillas en estado BORRADOR
            </div>
          </div>
          <div className="validation-item">
            <span className="check-icon">✓</span>
            <div>
              <strong>Aprobación en CALCULADO:</strong> Solo se puede aprobar planillas CALCULADAS
            </div>
          </div>
        </div>
      </div>

      {/* Notas Finales */}
      <div className="config-section">
        <div className="info-banner">
          <h3>📝 Notas Importantes</h3>
          <ul>
            <li>Los porcentajes de descuentos y aportes son valores fijos configurados en el backend</li>
            <li>Una vez APROBADA, una planilla no puede ser modificada ni recalculada</li>
            <li>Los empleados con estado ELIMINADO permanecen en planillas históricas pero no se incluyen en nuevas planillas</li>
            <li>El periodo debe ser único - no se pueden crear dos planillas para el mismo mes/año</li>
            <li>Todos los cálculos se realizan con precisión de 2 decimales</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MastersConfigPage;