#!/bin/bash

# Script para iniciar o projeto em desenvolvimento

echo "🎬 OpenStream Platform - Iniciando ambiente..."
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verifica se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js não está instalado${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Node.js versão:${NC}"
node --version
echo ""

# Backend
echo -e "${BLUE}🔧 Configurando Backend...${NC}"
if [ ! -d "backend/node_modules" ]; then
    echo -e "${YELLOW}Instalando dependências do backend...${NC}"
    cd backend
    npm install
    cd ..
fi

if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}Criando .env do backend...${NC}"
    cp backend/.env.example backend/.env
fi

# Frontend
echo -e "${BLUE}🎨 Configurando Frontend...${NC}"
if [ ! -d "frontend/node_modules" ]; then
    echo -e "${YELLOW}Instalando dependências do frontend...${NC}"
    cd frontend
    npm install
    cd ..
fi

if [ ! -f "frontend/.env.local" ]; then
    echo -e "${YELLOW}Criando .env.local do frontend...${NC}"
    cp frontend/.env.example frontend/.env.local
fi

echo ""
echo -e "${GREEN}✅ Ambiente configurado!${NC}"
echo ""
echo -e "${BLUE}📝 Para iniciar o projeto:${NC}"
echo ""
echo -e "${YELLOW}Terminal 1 - Backend:${NC}"
echo "  cd backend && npm run dev"
echo ""
echo -e "${YELLOW}Terminal 2 - Frontend:${NC}"
echo "  cd frontend && npm run dev"
echo ""
echo -e "${YELLOW}Credenciais padrão:${NC}"
echo "  Usuário: admin"
echo "  Senha: admin123"
echo ""
echo -e "${BLUE}URLs:${NC}"
echo "  Frontend: http://localhost:3000"
echo "  Backend: http://localhost:5000"
echo ""
