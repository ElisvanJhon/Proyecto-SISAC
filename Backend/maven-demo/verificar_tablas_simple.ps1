# Script simplificado para verificar tablas
$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
$dbUser = "root"
$dbName = "sisac_db"

Write-Host "=== TABLAS EN LA BASE DE DATOS ===" -ForegroundColor Green
& $mysqlPath -u $dbUser $dbName -e "SHOW TABLES;"

Write-Host "`n=== VERIFICANDO TABLAS ESPECÍFICAS ===" -ForegroundColor Green

$tablas = @("convocatoria", "convocatorias", "entrevistas", "candidatos", "postulaciones")

foreach ($tabla in $tablas) {
    Write-Host "`nVerificando: $tabla" -ForegroundColor Yellow
    $query = "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='$dbName' AND table_name='$tabla';"
    $result = & $mysqlPath -u $dbUser $dbName -e $query
    
    if ($result -match "1") {
        Write-Host "  ✓ EXISTE" -ForegroundColor Green
        Write-Host "  Estructura:" -ForegroundColor Cyan
        & $mysqlPath -u $dbUser $dbName -e "DESCRIBE $tabla;"
    } else {
        Write-Host "  ✗ NO EXISTE" -ForegroundColor Red
    }
}
