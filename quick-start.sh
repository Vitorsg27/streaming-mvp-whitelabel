#!/bin/bash

# Quick Start Script para Windows, macOS e Linux

set -e

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}  OpenStream Platform - Quick Start${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}❌ Node.js não encontrado${NC}"
    echo "   Instale Node.js em: https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✓${NC} Node.js $(node --version)"
echo ""

# Backend
echo -e "${BLUE}📦 Backend${NC}"
cd backend

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}  Instalando dependências...${NC}"
    npm install --silent
fi

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo -e "${YELLOW}  ✓ Arquivo .env criado${NC}"
fi

echo -e "${GREEN}  ✓ Backend pronto${NC}"
cd ..
echo ""

# Frontend
echo -e "${BLUE}🎨 Frontend${NC}"
cd frontend

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}  Instalando dependências...${NC}"
    npm install --silent
fi

if [ ! -f ".env.local" ]; then
    cp .env.example .env.local
    echo -e "${YELLOW}  ✓ Arquivo .env.local criado${NC}"
fi

echo -e "${GREEN}  ✓ Frontend pronto${NC}"
cd ..
echo ""

# Resumo
echo -e "${BLUE}======================================${NC}"
echo -e "${GREEN}✓ Configuração concluída!${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""
echo -e "${YELLOW}Próximos passos:${NC}"
echo ""
echo "1️⃣  Terminal 1 - Inicie o Backend:"
echo -e "   ${BLUE}cd backend && npm run dev${NC}"
echo ""
echo "2️⃣  Terminal 2 - Inicie o Frontend:"
echo -e "   ${BLUE}cd frontend && npm run dev${NC}"
echo ""
echo "3️⃣  Abra seu navegador:"
echo -e "   ${BLUE}http://localhost:3000${NC}"
echo ""
echo -e "${YELLOW}📝 Credenciais padrão:${NC}"
echo "   Usuário: ${BLUE}admin${NC}"
echo "   Senha: ${BLUE}admin123${NC}"
echo ""
echo -e "${YELLOW}🧪 Rodar testes:${NC}"
echo -e "   Backend: ${BLUE}cd backend && npm test${NC}"
echo -e "   Frontend: ${BLUE}cd frontend && npm test${NC}"
echo ""
