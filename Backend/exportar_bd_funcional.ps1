# Script para exportar la base de datos SISAC-ERP
# Dispositivo funcional

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$dbName = "sisac_db"
$dbUser = "root"
$dbPassword = "admin"
$mysqlDumpPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe"
$outputFile = "sisac_db_completo_$timestamp.sql"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "EXPORTAR BASE DE DATOS SISAC-ERP" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Base de datos: $dbName" -ForegroundColor Yellow
Write-Host "Archivo de salida: $outputFile" -ForegroundColor Yellow
Write-Host ""
Write-Host "Exportando..." -ForegroundColor Green

# Ejecutar mysqldump
& $mysqlDumpPath -u $dbUser "-p$dbPassword" --databases $dbName --add-drop-table --routines --triggers --events --single-transaction --set-gtid-purged=OFF > $outputFile

if ($LASTEXITCODE -eq 0) {
    $fileSize = (Get-Item $outputFile).Length / 1MB
    Write-Host ""
    Write-Host "EXPORTACION EXITOSA!" -ForegroundColor Green
    Write-Host "Archivo: $outputFile" -ForegroundColor Cyan
    Write-Host "Tamano: $([math]::Round($fileSize, 2)) MB" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "SIGUIENTE PASO:" -ForegroundColor Yellow
    Write-Host "1. Copia este archivo al otro dispositivo" -ForegroundColor White
    Write-Host "2. En el otro dispositivo, importa con:" -ForegroundColor White
    Write-Host "   mysql -u root -p < $outputFile" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "ERROR en la exportacion" -ForegroundColor Red
    Write-Host "Verifica que MySQL este corriendo y las credenciales sean correctas" -ForegroundColor Yellow
}
