#!/bin/bash

# =====================================================
# Script de Escaneo de Puertos y Servicios - NMAP
# =====================================================
# Propósito: Identificar puertos abiertos, servicios 
# y versiones expuestas en el backend
# =====================================================

TARGET_HOST="localhost"
TARGET_PORT="8082"
REPORT_DIR="./reports/nmap"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=================================================${NC}"
echo -e "${GREEN}  NMAP Security Scan - SISAC ERP Backend${NC}"
echo -e "${GREEN}=================================================${NC}"

# Verificar si nmap está instalado
if ! command -v nmap &> /dev/null; then
    echo -e "${RED}ERROR: nmap no está instalado${NC}"
    echo "Instalar con: sudo apt-get install nmap (Linux) o brew install nmap (Mac)"
    exit 1
fi

# Crear directorio de reportes
mkdir -p "$REPORT_DIR"

echo -e "\n${YELLOW}[1/5] Escaneo rápido de puertos...${NC}"
nmap -T4 -F "$TARGET_HOST" -oN "$REPORT_DIR/quick-scan_$TIMESTAMP.txt"

echo -e "\n${YELLOW}[2/5] Escaneo completo con detección de servicios...${NC}"
nmap -sV -p "$TARGET_PORT" "$TARGET_HOST" -oN "$REPORT_DIR/service-scan_$TIMESTAMP.txt"

echo -e "\n${YELLOW}[3/5] Escaneo de todos los puertos...${NC}"
nmap -p- "$TARGET_HOST" -oN "$REPORT_DIR/all-ports_$TIMESTAMP.txt"

echo -e "\n${YELLOW}[4/5] Detección de OS y scripts de vulnerabilidades...${NC}"
nmap -A -p "$TARGET_PORT" "$TARGET_HOST" -oN "$REPORT_DIR/aggressive-scan_$TIMESTAMP.txt"

echo -e "\n${YELLOW}[5/5] Scripts de seguridad HTTP...${NC}"
nmap -p "$TARGET_PORT" --script http-enum,http-headers,http-methods,http-csrf "$TARGET_HOST" \
    -oN "$REPORT_DIR/http-scripts_$TIMESTAMP.txt"

# Resumen de hallazgos
echo -e "\n${GREEN}=================================================${NC}"
echo -e "${GREEN}  Resumen de Escaneo${NC}"
echo -e "${GREEN}=================================================${NC}"

echo -e "\n${YELLOW}Puertos abiertos encontrados:${NC}"
grep "open" "$REPORT_DIR/service-scan_$TIMESTAMP.txt" | grep -v "#"

echo -e "\n${YELLOW}Servicios detectados:${NC}"
grep "Service Info" "$REPORT_DIR/service-scan_$TIMESTAMP.txt"

echo -e "\n${GREEN}Reportes guardados en: $REPORT_DIR${NC}"
echo -e "${GREEN}Timestamp: $TIMESTAMP${NC}"

# Verificaciones de seguridad
echo -e "\n${YELLOW}Verificaciones de seguridad:${NC}"

if grep -q "22/tcp.*open" "$REPORT_DIR/all-ports_$TIMESTAMP.txt"; then
    echo -e "${RED}⚠️  Puerto SSH (22) abierto - considerar firewall${NC}"
fi

if grep -q "3306/tcp.*open" "$REPORT_DIR/all-ports_$TIMESTAMP.txt"; then
    echo -e "${RED}⚠️  Puerto MySQL (3306) abierto - NO debería estar expuesto${NC}"
fi

if grep -q "8080/tcp.*open\|8081/tcp.*open" "$REPORT_DIR/all-ports_$TIMESTAMP.txt"; then
    echo -e "${YELLOW}ℹ️  Puertos de desarrollo detectados${NC}"
fi

echo -e "\n${GREEN}✓ Escaneo completado${NC}"
