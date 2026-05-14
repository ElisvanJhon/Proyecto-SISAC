#!/bin/bash

# =====================================================
# MASTER SECURITY TESTING SCRIPT
# Sistema Integrado de Pruebas de Seguridad
# =====================================================

REPORT_BASE="./reports"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
SUMMARY_REPORT="$REPORT_BASE/security-summary_$TIMESTAMP.txt"

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
cat << "EOF"
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║     SISAC ERP - SECURITY TESTING SUITE               ║
║     Comprehensive Penetration Testing                ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

mkdir -p "$REPORT_BASE"

# Verificar que el servidor esté corriendo
echo -e "${YELLOW}Verificando que el servidor esté activo...${NC}"
if ! curl -s http://localhost:8082/actuator/health > /dev/null 2>&1; then
    echo -e "${RED}ERROR: El servidor no está corriendo en localhost:8082${NC}"
    echo "Iniciar con: cd .. && mvn spring-boot:run"
    exit 1
fi
echo -e "${GREEN}✓ Servidor activo${NC}\n"

# Función para ejecutar test con manejo de errores
run_test() {
    local test_name=$1
    local script_path=$2
    local duration=0
    
    echo -e "\n${BLUE}═══════════════════════════════════════${NC}"
    echo -e "${BLUE}  Ejecutando: $test_name${NC}"
    echo -e "${BLUE}═══════════════════════════════════════${NC}"
    
    start_time=$(date +%s)
    
    if bash "$script_path"; then
        end_time=$(date +%s)
        duration=$((end_time - start_time))
        echo -e "${GREEN}✓ $test_name completado en ${duration}s${NC}" | tee -a "$SUMMARY_REPORT"
        return 0
    else
        end_time=$(date +%s)
        duration=$((end_time - start_time))
        echo -e "${RED}✗ $test_name falló después de ${duration}s${NC}" | tee -a "$SUMMARY_REPORT"
        return 1
    fi
}

# Inicializar reporte
{
    echo "=========================================="
    echo "SISAC ERP - Security Testing Summary"
    echo "Fecha: $(date '+%Y-%m-%d %H:%M:%S')"
    echo "=========================================="
    echo ""
} > "$SUMMARY_REPORT"

# Array de tests
declare -A tests=(
    ["1. Port & Service Scan"]="./nmap-scan.sh"
    ["2. Web Vulnerability Scan"]="./nikto-scan.sh"
    ["3. OWASP ZAP Analysis"]="./owasp-zap.sh"
    ["4. Endpoint Fuzzing"]="./ffuf-fuzzing.sh"
    ["5. Dependency Vulnerabilities"]="./snyk-test.sh"
)

# Menú de selección
echo -e "${YELLOW}Selecciona el modo de ejecución:${NC}"
echo "1. Ejecutar todos los tests (Full Suite)"
echo "2. Ejecutar tests individuales"
echo "3. Ejecutar tests rápidos (nmap + nikto)"
echo "4. Ejecutar tests avanzados (ZAP + fuzzing + snyk)"
echo -n "Opción [1-4]: "
read -r option

case $option in
    1)
        echo -e "\n${GREEN}Modo: Full Suite${NC}\n"
        for test_name in "${!tests[@]}"; do
            run_test "$test_name" "${tests[$test_name]}"
        done
        ;;
    2)
        echo -e "\n${YELLOW}Tests disponibles:${NC}"
        i=1
        test_array=()
        for test_name in "${!tests[@]}"; do
            echo "$i. $test_name"
            test_array+=("$test_name")
            ((i++))
        done
        echo -n "Selecciona test [1-${#tests[@]}]: "
        read -r test_num
        if [ "$test_num" -ge 1 ] && [ "$test_num" -le "${#tests[@]}" ]; then
            selected_test="${test_array[$((test_num-1))]}"
            run_test "$selected_test" "${tests[$selected_test]}"
        else
            echo -e "${RED}Opción inválida${NC}"
            exit 1
        fi
        ;;
    3)
        echo -e "\n${GREEN}Modo: Tests Rápidos${NC}\n"
        run_test "1. Port & Service Scan" "./nmap-scan.sh"
        run_test "2. Web Vulnerability Scan" "./nikto-scan.sh"
        ;;
    4)
        echo -e "\n${GREEN}Modo: Tests Avanzados${NC}\n"
        run_test "3. OWASP ZAP Analysis" "./owasp-zap.sh"
        run_test "4. Endpoint Fuzzing" "./ffuf-fuzzing.sh"
        run_test "5. Dependency Vulnerabilities" "./snyk-test.sh"
        ;;
    *)
        echo -e "${RED}Opción inválida${NC}"
        exit 1
        ;;
esac

# Ejecutar JMeter load test si está instalado
if command -v jmeter &> /dev/null; then
    echo -e "\n${YELLOW}¿Ejecutar pruebas de carga con JMeter? (y/n): ${NC}"
    read -r jmeter_option
    if [ "$jmeter_option" = "y" ]; then
        echo -e "\n${BLUE}Ejecutando JMeter Load Test...${NC}"
        jmeter -n -t jmeter-load-test.jmx \
            -l "$REPORT_BASE/jmeter/results_$TIMESTAMP.jtl" \
            -e -o "$REPORT_BASE/jmeter/dashboard_$TIMESTAMP"
        echo -e "${GREEN}✓ Load test completado${NC}" | tee -a "$SUMMARY_REPORT"
    fi
fi

# Resumen final
echo -e "\n${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}  RESUMEN FINAL${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}\n"

cat "$SUMMARY_REPORT"

echo -e "\n${GREEN}Todos los reportes guardados en: $REPORT_BASE${NC}"
echo -e "${YELLOW}Reporte resumen: $SUMMARY_REPORT${NC}"

# Generar índice HTML de reportes
cat > "$REPORT_BASE/index.html" << EOF
<!DOCTYPE html>
<html>
<head>
    <title>SISAC ERP - Security Test Results</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        h1 { color: #2c3e50; }
        .report-section { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .critical { color: #e74c3c; font-weight: bold; }
        .warning { color: #f39c12; }
        .success { color: #27ae60; }
        a { color: #3498db; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <h1>🔒 SISAC ERP - Security Test Results</h1>
    <p>Generated: $(date '+%Y-%m-%d %H:%M:%S')</p>
    
    <div class="report-section">
        <h2>📊 Available Reports</h2>
        <ul>
            <li><a href="nmap/">NMAP Port Scans</a></li>
            <li><a href="nikto/">Nikto Vulnerability Scans</a></li>
            <li><a href="zap/">OWASP ZAP Analysis</a></li>
            <li><a href="ffuf/">FFUF Fuzzing Results</a></li>
            <li><a href="snyk/">Snyk Dependency Analysis</a></li>
            <li><a href="jmeter/">JMeter Load Tests</a></li>
        </ul>
    </div>
    
    <div class="report-section">
        <h2>📝 Summary</h2>
        <pre>$(cat "$SUMMARY_REPORT")</pre>
    </div>
    
    <div class="report-section">
        <h2>🛡️ Security Recommendations</h2>
        <ul>
            <li class="critical">Remediar vulnerabilidades críticas inmediatamente</li>
            <li class="warning">Actualizar dependencias con vulnerabilidades conocidas</li>
            <li>Implementar rate limiting en endpoints públicos</li>
            <li>Habilitar HTTPS en producción</li>
            <li>Configurar headers de seguridad (CSP, HSTS, etc.)</li>
            <li>Revisar políticas de CORS</li>
            <li>Implementar logging de seguridad</li>
        </ul>
    </div>
</body>
</html>
EOF

echo -e "\n${GREEN}✓ Índice HTML generado: $REPORT_BASE/index.html${NC}"
echo -e "${YELLOW}Abrir en navegador para visualización completa${NC}\n"
