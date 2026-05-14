-- Verificar asistencias (novedades) registradas
SELECT 
    a.idAsistencia,
    e.nombre AS empleado,
    a.fecha,
    DATE_FORMAT(a.fecha, '%Y%m') AS periodo_calculado,
    a.horasExtra,
    a.tardanza,
    a.ausencia
FROM asistencias a
JOIN empleados e ON a.idEmpleado = e.id
ORDER BY a.fecha DESC;

-- Ver empleados activos
SELECT id, nombre, dni, sueldoBase, estado
FROM empleados
WHERE estado = 'ACTIVO';

-- Ver planillas creadas
SELECT id, periodo, estado, totalBruto, totalNeto
FROM planillas
ORDER BY periodo DESC;
