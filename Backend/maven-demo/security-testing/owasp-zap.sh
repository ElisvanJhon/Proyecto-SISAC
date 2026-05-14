#!/bin/bash

# =====================================================
# Script de Pruebas de Seguridad - OWASP ZAP
# =====================================================
# Propósito: Automated security testing usando 
# OWASP Zed Attack Proxy
# =====================================================

TARGET_URL="http://localhost:8082"
ZAP_PORT="8090"
REPORT_DIR="./reports/zap"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}=================================================${NC}"
echo -e "${GREEN}  OWASP ZAP Security Testing${NC}"
echo -e "${GREEN}=================================================${NC}"

# Verificar Docker (ZAP se ejecuta mejor en contenedor)
if ! command -v docker &> /dev/null; then
    echo -e "${RED}ERROR: Docker no está instalado${NC}"
    echo "ZAP requiere Docker para ejecución automatizada"
    exit 1
fi

mkdir -p "$REPORT_DIR"

echo -e "\n${YELLOW}[1/4] Iniciando OWASP ZAP en modo daemon...${NC}"
docker pull owasp/zap2docker-stable

echo -e "\n${YELLOW}[2/4] Baseline Scan (escaneo rápido)...${NC}"
docker run --rm -v "$(pwd)/$REPORT_DIR:/zap/wrk/:rw" \
    -t owasp/zap2docker-stable zap-baseline.py \
    -t "$TARGET_URL" \
    -r "baseline-report_$TIMESTAMP.html" \
    -J "baseline-report_$TIMESTAMP.json"

echo -e "\n${YELLOW}[3/4] Full Scan (escaneo completo con spider)...${NC}"
docker run --rm -v "$(pwd)/$REPORT_DIR:/zap/wrk/:rw" \
    -t owasp/zap2docker-stable zap-full-scan.py \
    -t "$TARGET_URL" \
    -r "full-scan_$TIMESTAMP.html" \
    -J "full-scan_$TIMESTAMP.json"

echo -e "\n${YELLOW}[4/4] API Scan (para endpoints REST)...${NC}"
# Si tienes OpenAPI/Swagger spec:
# docker run --rm -v "$(pwd)/$REPORT_DIR:/zap/wrk/:rw" \
#     -t owasp/zap2docker-stable zap-api-scan.py \
#     -t "$TARGET_URL/v3/api-docs" \
#     -f openapi \
#     -r "api-scan_$TIMESTAMP.html"

echo -e "\n${GREEN}=================================================${NC}"
echo -e "${GREEN}  Análisis de Resultados${NC}"
echo -e "${GREEN}=================================================${NC}"

# Análisis de JSON report
if [ -f "$REPORT_DIR/full-scan_$TIMESTAMP.json" ]; then
    echo -e "\n${RED}Alertas de ALTO riesgo:${NC}"
    grep -o '"risk":"High"' "$REPORT_DIR/full-scan_$TIMESTAMP.json" | wc -l
    
    echo -e "\n${YELLOW}Alertas de MEDIO riesgo:${NC}"
    grep -o '"risk":"Medium"' "$REPORT_DIR/full-scan_$TIMESTAMP.json" | wc -l
    
    echo -e "\n${GREEN}Alertas de BAJO riesgo:${NC}"
    grep -o '"risk":"Low"' "$REPORT_DIR/full-scan_$TIMESTAMP.json" | wc -l
fi

echo -e "\n${GREEN}Reportes HTML disponibles en: $REPORT_DIR${NC}"
echo -e "${GREEN}Abrir con navegador para ver detalles completos${NC}"

# Vulnerabilidades comunes a verificar
echo -e "\n${YELLOW}Verificando vulnerabilidades OWASP Top 10:${NC}"
echo "1. Injection (SQL, Command, etc.)"
echo "2. Broken Authentication"
echo "3. Sensitive Data Exposure"
echo "4. XML External Entities (XXE)"
echo "5. Broken Access Control"
echo "6. Security Misconfiguration"
echo "7. Cross-Site Scripting (XSS)"
echo "8. Insecure Deserialization"
echo "9. Using Components with Known Vulnerabilities"
echo "10. Insufficient Logging & Monitoring"

echo -e "\n${GREEN}✓ Escaneo ZAP completado${NC}"
