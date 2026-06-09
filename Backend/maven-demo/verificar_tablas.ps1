# Verificar tablas existentes en la base de datos local (dispositivo funcional)
# Este script verifica qué tablas existen en tu base de datos actual

param(
    [string]$dbUser = "root",
    [string]$dbPassword = "",
    [string]$dbName = "sisac_db",
    [string]$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
)

Write-Host "=== VERIFICACIÓN DE TABLAS EN BASE DE DATOS FUNCIONAL ===" -ForegroundColor Green
Write-Host ""

# Verificar si mysql.exe existe
if (-not (Test-Path $mysqlPath)) {
    Write-Host "ERROR: No se encuentra mysql.exe en $mysqlPath" -ForegroundColor Red
    Write-Host "Por favor, ajusta la variable `$mysqlPath al inicio de este script" -ForegroundColor Yellow
    exit 1
}

Write-Host "Mostrando todas las tablas en la base de datos '$dbName'..." -ForegroundColor Cyan
Write-Host ""

# Construir comando SQL
$sqlCommand = "SHOW TABLES;"

# Ejecutar comando
if ($dbPassword -eq "") {
    & $mysqlPath -u $dbUser $dbName -e $sqlCommand
} else {
    & $mysqlPath -u $dbUser "-p$dbPassword" $dbName -e $sqlCommand
}

Write-Host ""
Write-Host "=== VERIFICACIÓN ESPECÍFICA DE TABLAS DEL MÓDULO CONVOCATORIAS ===" -ForegroundColor Green
Write-Host ""

$tablasConvocatorias = @("convocatoria", "convocatorias", "entrevistas", "entrevista", "candidatos", "candidato", "postulaciones", "postulacion")

foreach ($tabla in $tablasConvocatorias) {
    $checkQuery = "SELECT COUNT(*) as existe FROM information_schema.tables WHERE table_schema = '$dbName' AND table_name = '$tabla';"
    
    Write-Host "Verificando tabla: $tabla" -ForegroundColor Yellow
    
    if ($dbPassword -eq "") {
        $result = & $mysqlPath -u $dbUser $dbName -e $checkQuery
    } else {
        $result = & $mysqlPath -u $dbUser "-p$dbPassword" $dbName -e $checkQuery
    }
    
    if ($result -match "1") {
        Write-Host "  ✓ Tabla '$tabla' EXISTE" -ForegroundColor Green
        
        # Mostrar estructura de la tabla
        Write-Host "  Estructura de la tabla:" -ForegroundColor Cyan
        $describeQuery = "DESCRIBE $tabla;"
        if ($dbPassword -eq "") {
            & $mysqlPath -u $dbUser $dbName -e $describeQuery
        } else {
            & $mysqlPath -u $dbUser "-p$dbPassword" $dbName -e $describeQuery
        }
        Write-Host ""
    } else {
        Write-Host "  ✗ Tabla '$tabla' NO EXISTE" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== VERIFICACIÓN COMPLETA ===" -ForegroundColor Green
Write-Host "Este informe te ayudará a identificar qué tablas existen en tu base de datos funcional" -ForegroundColor Cyan
Write-Host "y qué estructura tienen las tablas del módulo de convocatorias." -ForegroundColor Cyan
