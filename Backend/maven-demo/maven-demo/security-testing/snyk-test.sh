#!/bin/bash

# =====================================================
# Script de Análisis de Vulnerabilidades - SNYK
# =====================================================
# Propósito: Identificar vulnerabilidades en 
# dependencias Maven y código fuente
# =====================================================

PROJECT_DIR="../"
REPORT_DIR="./reports/snyk"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}=================================================${NC}"
echo -e "${GREEN}  SNYK Security Vulnerability Analysis${NC}"
echo -e "${GREEN}=================================================${NC}"

# Verificar Snyk
if ! command -v snyk &> /dev/null; then
    echo -e "${RED}ERROR: Snyk CLI no está instalado${NC}"
    echo "Instalar con: npm install -g snyk"
    echo "Luego autenticar: snyk auth"
    exit 1
fi

mkdir -p "$REPORT_DIR"

# Verificar autenticación
echo -e "\n${YELLOW}Verificando autenticación Snyk...${NC}"
if ! snyk auth --check &> /dev/null; then
    echo -e "${RED}ERROR: No estás autenticado en Snyk${NC}"
    echo "Ejecuta: snyk auth"
    exit 1
fi

cd "$PROJECT_DIR" || exit

echo -e "\n${YELLOW}[1/5] Análisis de dependencias Maven...${NC}"
snyk test --all-projects \
    --severity-threshold=low \
    --json > "../security-testing/$REPORT_DIR/dependencies_$TIMESTAMP.json"

echo -e "\n${YELLOW}[2/5] Análisis de código fuente (SAST)...${NC}"
snyk code test \
    --severity-threshold=low \
    --json > "../security-testing/$REPORT_DIR/code-analysis_$TIMESTAMP.json"

echo -e "\n${YELLOW}[3/5] Escaneo de contenedores Docker (si aplica)...${NC}"
# Si tienes Dockerfile:
# docker build -t sisac-erp:test .
# snyk container test sisac-erp:test \
#     --json > "../security-testing/$REPORT_DIR/container_$TIMESTAMP.json"

echo -e "\n${YELLOW}[4/5] Análisis de infraestructura como código...${NC}"
# Si usas Kubernetes, Terraform, etc:
# snyk iac test \
#     --json > "../security-testing/$REPORT_DIR/iac_$TIMESTAMP.json"

echo -e "\n${YELLOW}[5/5] Monitoreo continuo de vulnerabilidades...${NC}"
snyk monitor --all-projects

cd - > /dev/null || exit

echo -e "\n${GREEN}=================================================${NC}"
echo -e "${GREEN}  Análisis de Resultados${NC}"
echo -e "${GREEN}=================================================${NC}"

# Análisis de JSON reports
if [ -f "$REPORT_DIR/dependencies_$TIMESTAMP.json" ]; then
    echo -e "\n${RED}Vulnerabilidades CRÍTICAS en dependencias:${NC}"
    jq '[.vulnerabilities[] | select(.severity == "critical")] | length' \
        "$REPORT_DIR/dependencies_$TIMESTAMP.json" 2>/dev/null || echo "0"
    
    echo -e "\n${YELLOW}Vulnerabilidades ALTAS en dependencias:${NC}"
    jq '[.vulnerabilities[] | select(.severity == "high")] | length' \
        "$REPORT_DIR/dependencies_$TIMESTAMP.json" 2>/dev/null || echo "0"
    
    echo -e "\n${GREEN}Vulnerabilidades MEDIAS en dependencias:${NC}"
    jq '[.vulnerabilities[] | select(.severity == "medium")] | length' \
        "$REPORT_DIR/dependencies_$TIMESTAMP.json" 2>/dev/null || echo "0"
fi

if [ -f "$REPORT_DIR/code-analysis_$TIMESTAMP.json" ]; then
    echo -e "\n${RED}Issues CRÍTICOS en código:${NC}"
    jq '[.runs[].results[] | select(.level == "error")] | length' \
        "$REPORT_DIR/code-analysis_$TIMESTAMP.json" 2>/dev/null || echo "0"
    
    echo -e "\n${YELLOW}Warnings en código:${NC}"
    jq '[.runs[].results[] | select(.level == "warning")] | length' \
        "$REPORT_DIR/code-analysis_$TIMESTAMP.json" 2>/dev/null || echo "0"
fi

# Generar reporte HTML consolidado
echo -e "\n${YELLOW}Generando reporte HTML...${NC}"
snyk-to-html -i "$REPORT_DIR/dependencies_$TIMESTAMP.json" \
    -o "$REPORT_DIR/snyk-report_$TIMESTAMP.html" 2>/dev/null || \
    echo "Instalar: npm install -g snyk-to-html"

echo -e "\n${GREEN}Reportes guardados en: $REPORT_DIR${NC}"
echo -e "${GREEN}Reporte HTML: $REPORT_DIR/snyk-report_$TIMESTAMP.html${NC}"

# Recomendaciones
echo -e "\n${YELLOW}Recomendaciones:${NC}"
echo "1. Revisar vulnerabilidades críticas y altas prioritariamente"
echo "2. Actualizar dependencias con 'mvn versions:display-dependency-updates'"
echo "3. Implementar fixes sugeridos por Snyk"
echo "4. Configurar integración CI/CD con Snyk"
echo "5. Monitorear dashboard Snyk: https://app.snyk.io"

# Check for specific vulnerable dependencies
echo -e "\n${RED}Dependencias comúnmente vulnerables:${NC}"
echo "- Spring Framework (verificar CVE-2022-22965 - Spring4Shell)"
echo "- Log4j (verificar CVE-2021-44228 - Log4Shell)"
echo "- Jackson (deserialización insegura)"
echo "- MySQL Connector (SQL injection)"

echo -e "\n${GREEN}✓ Análisis Snyk completado${NC}"
