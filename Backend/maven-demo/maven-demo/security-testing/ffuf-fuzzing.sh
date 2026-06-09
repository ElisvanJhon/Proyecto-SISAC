#!/bin/bash

# =====================================================
# Script de Fuzzing de Endpoints - FFUF
# =====================================================
# Propósito: Descubrir endpoints ocultos, parámetros
# vulnerables y rutas no documentadas
# =====================================================

TARGET_URL="http://localhost:8082"
REPORT_DIR="./reports/ffuf"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
WORDLIST_DIR="./wordlists"

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}=================================================${NC}"
echo -e "${GREEN}  FFUF Web Fuzzing Scanner${NC}"
echo -e "${GREEN}=================================================${NC}"

# Verificar ffuf
if ! command -v ffuf &> /dev/null; then
    echo -e "${RED}ERROR: ffuf no está instalado${NC}"
    echo "Instalar: go install github.com/ffuf/ffuf@latest"
    exit 1
fi

mkdir -p "$REPORT_DIR"
mkdir -p "$WORDLIST_DIR"

# Descargar wordlists si no existen
if [ ! -f "$WORDLIST_DIR/common.txt" ]; then
    echo -e "${YELLOW}Descargando wordlists...${NC}"
    curl -s https://raw.githubusercontent.com/danielmiessler/SecLists/master/Discovery/Web-Content/common.txt \
        -o "$WORDLIST_DIR/common.txt"
    curl -s https://raw.githubusercontent.com/danielmiessler/SecLists/master/Discovery/Web-Content/api/api-endpoints.txt \
        -o "$WORDLIST_DIR/api-endpoints.txt"
fi

echo -e "\n${YELLOW}[1/5] Fuzzing de directorios comunes...${NC}"
ffuf -w "$WORDLIST_DIR/common.txt" \
    -u "$TARGET_URL/FUZZ" \
    -mc 200,204,301,302,307,401,403 \
    -o "$REPORT_DIR/directories_$TIMESTAMP.json" \
    -of json \
    -t 40

echo -e "\n${YELLOW}[2/5] Fuzzing de endpoints API...${NC}"
ffuf -w "$WORDLIST_DIR/api-endpoints.txt" \
    -u "$TARGET_URL/api/FUZZ" \
    -mc 200,204,401,403 \
    -o "$REPORT_DIR/api-endpoints_$TIMESTAMP.json" \
    -of json \
    -t 40

echo -e "\n${YELLOW}[3/5] Fuzzing de parámetros GET...${NC}"
# Lista de parámetros comunes
PARAMS="id,user,username,email,token,key,password,search,query,page,limit,offset"
IFS=',' read -ra PARAM_ARRAY <<< "$PARAMS"

for param in "${PARAM_ARRAY[@]}"; do
    ffuf -w "$WORDLIST_DIR/common.txt" \
        -u "$TARGET_URL/api/configuracion?$param=FUZZ" \
        -mc 200,500 \
        -o "$REPORT_DIR/param-${param}_$TIMESTAMP.json" \
        -of json \
        -t 20 \
        -s  # Silent mode para no saturar output
done

echo -e "\n${YELLOW}[4/5] Fuzzing de métodos HTTP...${NC}"
METHODS=("GET" "POST" "PUT" "DELETE" "PATCH" "OPTIONS" "HEAD")
for method in "${METHODS[@]}"; do
    ffuf -w "$WORDLIST_DIR/api-endpoints.txt" \
        -u "$TARGET_URL/api/FUZZ" \
        -X "$method" \
        -mc 200,204,405 \
        -o "$REPORT_DIR/methods-${method}_$TIMESTAMP.json" \
        -of json \
        -t 20 \
        -s
done

echo -e "\n${YELLOW}[5/5] Fuzzing de headers personalizados...${NC}"
ffuf -w "$WORDLIST_DIR/common.txt" \
    -u "$TARGET_URL/api/configuracion" \
    -H "X-Custom-Header: FUZZ" \
    -mc 200,500 \
    -o "$REPORT_DIR/custom-headers_$TIMESTAMP.json" \
    -of json \
    -t 20

echo -e "\n${GREEN}=================================================${NC}"
echo -e "${GREEN}  Análisis de Resultados${NC}"
echo -e "${GREEN}=================================================${NC}"

# Contar hallazgos
echo -e "\n${YELLOW}Directorios/archivos encontrados:${NC}"
if [ -f "$REPORT_DIR/directories_$TIMESTAMP.json" ]; then
    jq '.results | length' "$REPORT_DIR/directories_$TIMESTAMP.json" 2>/dev/null || echo "Ver archivo JSON"
fi

echo -e "\n${YELLOW}Endpoints API descubiertos:${NC}"
if [ -f "$REPORT_DIR/api-endpoints_$TIMESTAMP.json" ]; then
    jq '.results | length' "$REPORT_DIR/api-endpoints_$TIMESTAMP.json" 2>/dev/null || echo "Ver archivo JSON"
fi

echo -e "\n${RED}Hallazgos de seguridad importantes:${NC}"
echo "1. Endpoints sin autenticación (200/204 sin token)"
echo "2. Métodos HTTP no esperados permitidos"
echo "3. Parámetros que causan errores 500"
echo "4. Rutas administrativas expuestas"

echo -e "\n${GREEN}Reportes JSON guardados en: $REPORT_DIR${NC}"
echo -e "${YELLOW}Usar 'jq' para analizar: jq '.results[]' archivo.json${NC}"

# Endpoints críticos a verificar manualmente
echo -e "\n${YELLOW}Verificar manualmente:${NC}"
echo "- /actuator/* (Spring Boot Actuator)"
echo "- /swagger-ui.html (Documentación)"
echo "- /api-docs (OpenAPI)"
echo "- /admin/* (Paneles administrativos)"
echo "- /debug/* (Información de debug)"

echo -e "\n${GREEN}✓ Fuzzing completado${NC}"
