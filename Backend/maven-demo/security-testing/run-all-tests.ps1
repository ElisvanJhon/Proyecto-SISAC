# =====================================================
# MASTER SECURITY TESTING SCRIPT - POWERSHELL
# Sistema Integrado de Pruebas de Seguridad (Windows)
# =====================================================

$REPORT_BASE = ".\reports"
$TIMESTAMP = Get-Date -Format "yyyyMMdd_HHmmss"
$SUMMARY_REPORT = "$REPORT_BASE\security-summary_$TIMESTAMP.txt"

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                       ║" -ForegroundColor Cyan
Write-Host "║     SISAC ERP - SECURITY TESTING SUITE               ║" -ForegroundColor Cyan
Write-Host "║     Comprehensive Penetration Testing                ║" -ForegroundColor Cyan
Write-Host "║                                                       ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Crear directorio de reportes
New-Item -ItemType Directory -Force -Path $REPORT_BASE | Out-Null

# Verificar servidor
Write-Host "Verificando servidor..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8082/actuator/health" -UseBasicParsing -TimeoutSec 5
    Write-Host "✓ Servidor activo" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Servidor no está corriendo en localhost:8082" -ForegroundColor Red
    Write-Host "Iniciar con: cd .. ; mvn spring-boot:run" -ForegroundColor Yellow
    exit 1
}

# Inicializar reporte
@"
==========================================
SISAC ERP - Security Testing Summary
Fecha: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
==========================================

"@ | Out-File -FilePath $SUMMARY_REPORT -Encoding UTF8

# Función para ejecutar test
function Run-SecurityTest {
    param(
        [string]$TestName,
        [scriptblock]$TestScript
    )
    
    Write-Host ""
    Write-Host "═══════════════════════════════════════" -ForegroundColor Blue
    Write-Host "  Ejecutando: $TestName" -ForegroundColor Blue
    Write-Host "═══════════════════════════════════════" -ForegroundColor Blue
    
    $startTime = Get-Date
    
    try {
        & $TestScript
        $duration = (Get-Date) - $startTime
        $message = "✓ $TestName completado en $($duration.TotalSeconds.ToString('F2'))s"
        Write-Host $message -ForegroundColor Green
        Add-Content -Path $SUMMARY_REPORT -Value $message
        return $true
    } catch {
        $duration = (Get-Date) - $startTime
        $message = "✗ $TestName falló después de $($duration.TotalSeconds.ToString('F2'))s"
        Write-Host $message -ForegroundColor Red
        Write-Host "Error: $_" -ForegroundColor Red
        Add-Content -Path $SUMMARY_REPORT -Value $message
        return $false
    }
}

# Tests disponibles
$tests = @{
    "1. Port & Service Scan (NMAP)" = {
        if (Get-Command nmap -ErrorAction SilentlyContinue) {
            New-Item -ItemType Directory -Force -Path "$REPORT_BASE\nmap" | Out-Null
            nmap -sV -p 8082 localhost -oN "$REPORT_BASE\nmap\scan_$TIMESTAMP.txt"
        } else {
            Write-Host "NMAP no instalado. Descargar de: https://nmap.org/download.html" -ForegroundColor Yellow
        }
    }
    "2. Web Vulnerability Scan (Nikto)" = {
        if (Get-Command nikto -ErrorAction SilentlyContinue) {
            New-Item -ItemType Directory -Force -Path "$REPORT_BASE\nikto" | Out-Null
            nikto -host "http://localhost:8082" -output "$REPORT_BASE\nikto\scan_$TIMESTAMP.txt"
        } else {
            Write-Host "Nikto no instalado. Usar Docker o WSL" -ForegroundColor Yellow
        }
    }
    "3. OWASP ZAP Analysis" = {
        if (Get-Command docker -ErrorAction SilentlyContinue) {
            New-Item -ItemType Directory -Force -Path "$REPORT_BASE\zap" | Out-Null
            docker pull owasp/zap2docker-stable
            docker run --rm -v "${PWD}\${REPORT_BASE}\zap:/zap/wrk/:rw" `
                -t owasp/zap2docker-stable zap-baseline.py `
                -t "http://host.docker.internal:8082" `
                -r "baseline_$TIMESTAMP.html"
        } else {
            Write-Host "Docker no instalado. Descargar de: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
        }
    }
    "4. Dependency Vulnerabilities (Snyk)" = {
        if (Get-Command snyk -ErrorAction SilentlyContinue) {
            New-Item -ItemType Directory -Force -Path "$REPORT_BASE\snyk" | Out-Null
            Push-Location ..
            snyk test --json | Out-File -FilePath "security-testing\$REPORT_BASE\snyk\dependencies_$TIMESTAMP.json"
            snyk code test --json | Out-File -FilePath "security-testing\$REPORT_BASE\snyk\code_$TIMESTAMP.json"
            Pop-Location
        } else {
            Write-Host "Snyk no instalado. Instalar con: npm install -g snyk" -ForegroundColor Yellow
        }
    }
    "5. OWASP Dependency Check" = {
        Push-Location ..
        mvn org.owasp:dependency-check-maven:check
        Pop-Location
        Write-Host "Ver reporte en: ..\target\dependency-check-report.html" -ForegroundColor Cyan
    }
}

# Menú de selección
Write-Host ""
Write-Host "Selecciona el modo de ejecución:" -ForegroundColor Yellow
Write-Host "1. Ejecutar todos los tests (Full Suite)"
Write-Host "2. Ejecutar tests individuales"
Write-Host "3. Ejecutar tests rápidos (NMAP + OWASP Check)"
Write-Host "4. Ejecutar tests avanzados (ZAP + Snyk)"
$option = Read-Host "Opción [1-4]"

switch ($option) {
    "1" {
        Write-Host "`nModo: Full Suite`n" -ForegroundColor Green
        foreach ($test in $tests.GetEnumerator()) {
            Run-SecurityTest -TestName $test.Key -TestScript $test.Value
        }
    }
    "2" {
        Write-Host "`nTests disponibles:" -ForegroundColor Yellow
        $i = 1
        $testArray = @()
        foreach ($test in $tests.GetEnumerator()) {
            Write-Host "$i. $($test.Key)"
            $testArray += $test
            $i++
        }
        $testNum = Read-Host "Selecciona test [1-$($tests.Count)]"
        if ($testNum -match '^\d+$' -and [int]$testNum -ge 1 -and [int]$testNum -le $tests.Count) {
            $selected = $testArray[[int]$testNum - 1]
            Run-SecurityTest -TestName $selected.Key -TestScript $selected.Value
        } else {
            Write-Host "Opción inválida" -ForegroundColor Red
            exit 1
        }
    }
    "3" {
        Write-Host "`nModo: Tests Rápidos`n" -ForegroundColor Green
        Run-SecurityTest -TestName "1. Port & Service Scan (NMAP)" -TestScript $tests["1. Port & Service Scan (NMAP)"]
        Run-SecurityTest -TestName "5. OWASP Dependency Check" -TestScript $tests["5. OWASP Dependency Check"]
    }
    "4" {
        Write-Host "`nModo: Tests Avanzados`n" -ForegroundColor Green
        Run-SecurityTest -TestName "3. OWASP ZAP Analysis" -TestScript $tests["3. OWASP ZAP Analysis"]
        Run-SecurityTest -TestName "4. Dependency Vulnerabilities (Snyk)" -TestScript $tests["4. Dependency Vulnerabilities (Snyk)"]
    }
    default {
        Write-Host "Opción inválida" -ForegroundColor Red
        exit 1
    }
}

# JMeter test
if (Get-Command jmeter -ErrorAction SilentlyContinue) {
    Write-Host ""
    $jmeterOption = Read-Host "¿Ejecutar pruebas de carga con JMeter? (y/n)"
    if ($jmeterOption -eq "y") {
        Write-Host "`nEjecutando JMeter Load Test..." -ForegroundColor Blue
        New-Item -ItemType Directory -Force -Path "$REPORT_BASE\jmeter" | Out-Null
        jmeter -n -t jmeter-load-test.jmx `
            -l "$REPORT_BASE\jmeter\results_$TIMESTAMP.jtl" `
            -e -o "$REPORT_BASE\jmeter\dashboard_$TIMESTAMP"
        Write-Host "✓ Load test completado" -ForegroundColor Green
    }
}

# Resumen final
Write-Host ""
Write-Host "═══════════════════════════════════════" -ForegroundColor Blue
Write-Host "  RESUMEN FINAL" -ForegroundColor Blue
Write-Host "═══════════════════════════════════════" -ForegroundColor Blue
Write-Host ""

Get-Content $SUMMARY_REPORT

# Generar índice HTML
$htmlContent = @"
<!DOCTYPE html>
<html>
<head>
    <title>SISAC ERP - Security Test Results</title>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        h1 { color: #2c3e50; }
        .report-section { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .critical { color: #e74c3c; font-weight: bold; }
        .warning { color: #f39c12; }
        .success { color: #27ae60; }
        a { color: #3498db; text-decoration: none; }
        a:hover { text-decoration: underline; }
        pre { background: #2c3e50; color: #ecf0f1; padding: 15px; border-radius: 5px; overflow-x: auto; }
    </style>
</head>
<body>
    <h1>🔒 SISAC ERP - Security Test Results</h1>
    <p>Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')</p>
    
    <div class="report-section">
        <h2>📊 Available Reports</h2>
        <ul>
            <li><a href="nmap/">NMAP Port Scans</a></li>
            <li><a href="nikto/">Nikto Vulnerability Scans</a></li>
            <li><a href="zap/">OWASP ZAP Analysis</a></li>
            <li><a href="snyk/">Snyk Dependency Analysis</a></li>
            <li><a href="jmeter/">JMeter Load Tests</a></li>
        </ul>
    </div>
    
    <div class="report-section">
        <h2>📝 Summary</h2>
        <pre>$(Get-Content $SUMMARY_REPORT -Raw -Encoding UTF8)</pre>
    </div>
    
    <div class="report-section">
        <h2>🛡️ Security Recommendations</h2>
        <ul>
            <li class="critical">Remediar vulnerabilidades críticas inmediatamente</li>
            <li class="warning">Actualizar dependencias con vulnerabilidades conocidas</li>
            <li>Implementar rate limiting en endpoints públicos</li>
            <li>Habilitar HTTPS en producción</li>
            <li>Configurar headers de seguridad (CSP, HSTS, X-Frame-Options, etc.)</li>
            <li>Revisar políticas de CORS</li>
            <li>Implementar logging de seguridad y monitoreo</li>
            <li>Configurar WAF (Web Application Firewall)</li>
        </ul>
    </div>
    
    <div class="report-section">
        <h2>🔧 Tools Used</h2>
        <ul>
            <li><strong>NMAP:</strong> Port scanning y service detection</li>
            <li><strong>OWASP ZAP:</strong> Automated security testing</li>
            <li><strong>Snyk:</strong> Dependency vulnerability scanning</li>
            <li><strong>OWASP Dependency Check:</strong> Maven dependency analysis</li>
            <li><strong>JaCoCo:</strong> Code coverage analysis</li>
            <li><strong>SpotBugs + FindSecBugs:</strong> Static code analysis</li>
            <li><strong>JMeter:</strong> Load and performance testing</li>
        </ul>
    </div>
</body>
</html>
"@

$htmlContent | Out-File -FilePath "$REPORT_BASE\index.html" -Encoding UTF8

Write-Host ""
Write-Host "Todos los reportes guardados en: $REPORT_BASE" -ForegroundColor Green
Write-Host "Reporte resumen: $SUMMARY_REPORT" -ForegroundColor Yellow
Write-Host "Índice HTML: $REPORT_BASE\index.html" -ForegroundColor Cyan
Write-Host ""
Write-Host "Abrir reporte HTML:" -ForegroundColor Yellow
Write-Host "  Invoke-Item $REPORT_BASE\index.html" -ForegroundColor Cyan
Write-Host ""
