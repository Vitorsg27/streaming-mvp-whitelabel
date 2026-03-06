# Guia de Deployment

## Deployment no Vercel (Frontend + Backend)

### 1. Backend no Vercel

#### Preparação
```bash
cd backend
npm install
```

#### Configurar arquivo `vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production",
    "JWT_SECRET": "@JWT_SECRET",
    "ADMIN_USERNAME": "@ADMIN_USERNAME",
    "ADMIN_PASSWORD": "@ADMIN_PASSWORD"
  }
}
```

#### Deploy
```bash
npm install -g vercel
vercel
```

Configure as variáveis de ambiente no dashboard do Vercel.

### 2. Frontend no Vercel

#### Preparação
```bash
cd frontend
npm install
npm run build
```

#### Deploy
```bash
cd frontend
vercel
```

Configure `VITE_API_URL` para a URL do seu backend no Vercel.

---

## Deployment no Netlify (Frontend)

### 1. Instale Netlify CLI
```bash
npm install -g netlify-cli
```

### 2. Configure o site
```bash
cd frontend
netlify init
```

### 3. Configure variáveis de ambiente
No dashboard do Netlify, vá para **Site settings** → **Build & deploy** → **Environment**

Adicione:
```
VITE_API_URL=https://seu-backend.vercel.app/api
```

### 4. Deploy
```bash
netlify deploy --prod
```

---

## Deployment no Heroku (Backend)

### 1. Instale Heroku CLI
```bash
curl https://cli-assets.heroku.com/install.sh | sh
```

### 2. Login
```bash
heroku login
```

### 3. Crie app
```bash
cd backend
heroku create seu-app-name
```

### 4. Configure variáveis de ambiente
```bash
heroku config:set JWT_SECRET="sua_chave_secreta"
heroku config:set ADMIN_USERNAME="admin"
heroku config:set ADMIN_PASSWORD="senha_segura"
heroku config:set NODE_ENV="production"
```

### 5. Deploy
```bash
git push heroku main
```

### 6. Verifique logs
```bash
heroku logs --tail
```

---

## Deployment no Railway

### 1. Acesse https://railway.app

### 2. Crie novo projeto

### 3. Conecte seu GitHub

### 4. Configure variáveis de ambiente no painel

### 5. O deployment é automático a cada push

---

## Docker Deployment

### Dockerfile Backend
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

### Dockerfile Frontend
```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: production
      JWT_SECRET: ${JWT_SECRET}
      DATABASE_PATH: /app/database.db
    volumes:
      - ./backend/database.db:/app/database.db

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    environment:
      VITE_API_URL: http://localhost:5000/api
    depends_on:
      - backend
```

### Deploy com Docker Compose
```bash
docker-compose up -d
```

---

## Checklist de Deployment

- [ ] Variáveis de ambiente configuradas
- [ ] JWT_SECRET alterado (seguro)
- [ ] Credenciais de admin alteradas
- [ ] Banco de dados migrado/inicializado
- [ ] CORS configurado para domínios permitidos
- [ ] SSL/HTTPS habilitado
- [ ] Backups do banco de dados configurados
- [ ] Logs monitorados
- [ ] Testes executados com sucesso
- [ ] Performance testada
- [ ] Segurança verificada

---

## Monitoramento

### Sentry (Error Tracking)
```bash
npm install @sentry/node
```

Integre no seu backend para monitorar erros em produção.

### Analytics
Configure o Google Analytics no frontend para acompanhar uso.

---

## Troubleshooting

### Erro de conexão ao banco de dados
- Verifique se o caminho do banco de dados existe
- Verifique permissões de leitura/escrita

### CORS errors
- Verifique se a URL do frontend está configurada corretamente
- Verifique os headers de CORS no backend

### JWT errors
- Verifique se a chave JWT é a mesma em todos os ambientes
- Verifique se o token está sendo enviado corretamente

---

## Suporte

Para dúvidas de deployment, abra uma issue com a tag `deployment`.
