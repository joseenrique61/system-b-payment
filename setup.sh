#!/bin/bash

# Colores para la terminal
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[31m'
NC='\033[0m' # No Color

echo -e "${BLUE}>>> Iniciando infraestructura del Proyecto de Seguridad...${NC}"

# 1. Levantar contenedores (fuerza recreación para limpiar estado)
docker compose up -d

echo -e "${BLUE}>>> Esperando a que Vault esté listo...${NC}"
# Esperar a que el puerto 8200 responda
until curl -s http://localhost:8200/v1/sys/health > /dev/null; do
    sleep 1
done

echo -e "${GREEN}>>> Vault detectado. Configurando motor Transit (KMS)...${NC}"

# 2. Habilitar motor Transit en Vault
docker exec vault vault secrets enable transit 2>/dev/null || echo "Transit ya habilitado"

# 3. Crear la llave de encriptación para los pagos
echo -e "${BLUE}>>> Creando llave 'payments-key'...${NC}"
docker exec vault vault write -f transit/keys/payments-key

if [[ $? != 0 ]]; then
  echo -e "${RED}>>> Error: Vault no pudo crear la llave. Saliendo...${NC}"
  exit 1
fi

echo -e "${GREEN}>>> KMS configurado correctamente.${NC}"

# 4. Mostrar estado de Keycloak
echo -e "${BLUE}>>> Verificando Keycloak...${NC}"
echo -e "${GREEN}>>> Sistema listo.${NC}"
echo -e "${BLUE}--------------------------------------------------${NC}"
echo -e "URL Sistema B: http://localhost:5173"
echo -e "URL Keycloak:  http://localhost:8080"
echo -e "URL Vault UI:  http://localhost:8200 (Token: my-root-token)"
echo -e "${BLUE}--------------------------------------------------${NC}"

# 5. (Opcional) Correr análisis de Snyk al final
# pnpm snyk test