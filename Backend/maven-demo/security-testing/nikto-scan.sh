#!/bin/bash

# =====================================================
# Script de Escaneo de Vulnerabilidades Web - NIKTO
# =====================================================
# Propósito: Identificar vulnerabilidades conocidas,
# configuraciones inseguras y problemas de seguridad web
# =====================================================

TARGET_HOST="localhost"
TARGET_PORT="8082"
REPORT_DIR="./reports/nikto"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}=================================================${NC}"
echo -e "${GREEN}  NIKTO Web Vulnerability Scanner${NC}"
echo -e "${GREEN}=================================================${NC}"

# Verificar nikto
if ! command -v nikto &> /dev/null; then
    echo -e "${RED}ERROR: nikto no está instalado${NC}"
    echo "Instalar con: sudo apt-get install nikto (Linux)"
    exit 1
fi

mkdir -p "$REPORT_DIR"

echo -e "\n${YELLOW}[1/3] Escaneo básico de vulnerabilidades...${NC}"
nikto -host "http://$TARGET_HOST:$TARGET_PORT" \
    -output "$REPORT_DIR/basic-scan_$TIMESTAMP.txt" \
    -Format txt

echo -e "\n${YELLOW}[2/3] Escaneo con autenticación (si aplicable)...${NC}"
# Si tienes credenciales de prueba, descomenta y configura:
# nikto -host "http://$TARGET_HOST:$TARGET_PORT" \
#     -id "usuario:password" \
#     -output "$REPORT_DIR/authenticated-scan_$TIMESTAMP.txt"

echo -e "\n${YELLOW}[3/3] Escaneo de SSL/TLS (si HTTPS)...${NC}"
# Para entorno de producción con HTTPS:
# nikto -host "https://$TARGET_HOST:8443" \
#     -ssl \
#     -output "$REPORT_DIR/ssl-scan_$TIMESTAMP.txt"

echo -e "\n${GREEN}=================================================${NC}"
echo -e "${GREEN}  Análisis de Resultados${NC}"
echo -e "${GREEN}=================================================${NC}"

# Análisis de hallazgos críticos
echo -e "\n${RED}Vulnerabilidades CRÍTICAS encontradas:${NC}"
grep -i "OSVDB\|CVE" "$REPORT_DIR/basic-scan_$TIMESTAMP.txt" | head -10

echo -e "\n${YELLOW}Headers de seguridad faltantes:${NC}"
grep -i "x-frame-options\|x-content-type\|strict-transport" "$REPORT_DIR/basic-scan_$TIMESTAMP.txt"

echo -e "\n${YELLOW}Métodos HTTP permitidos:${NC}"
grep -i "allowed http methods" "$REPORT_DIR/basic-scan_$TIMESTAMP.txt"

echo -e "\n${GREEN}Reporte completo: $REPORT_DIR/basic-scan_$TIMESTAMP.txt${NC}"

# Verificaciones específicas para Spring Boot
echo -e "\n${YELLOW}Verificaciones específicas Spring Boot:${NC}"

if grep -q "/actuator" "$REPORT_DIR/basic-scan_$TIMESTAMP.txt"; then
    echo -e "${RED}⚠️  Endpoints Actuator expuestos - asegurar con autenticación${NC}"
fi

if grep -q "/swagger\|/api-docs" "$REPORT_DIR/basic-scan_$TIMESTAMP.txt"; then
    echo -e "${YELLOW}ℹ️  Documentación API accesible - considerar proteger en producción${NC}"
fi

echo -e "\n${GREEN}✓ Escaneo completado${NC}"
