# OpenStream Platform - Plataforma de Streaming Personalizável

MVP de uma plataforma de streaming de filmes estilo Netflix/Prime Video com painel de administração.

## 🎯 Características

### Frontend
- ✅ Catálogo responsivo de filmes com grid dinâmico
- ✅ Barra de busca e filtro por categoria
- ✅ Player de vídeo embutido (YouTube e links diretos)
- ✅ Página de detalhes do filme com SEO otimizado
- ✅ Painel de administração protegido
- ✅ Design moderno com Tailwind CSS
- ✅ Meta tags e Open Graph para compartilhamento social

### Backend
- ✅ API REST com Express.js
- ✅ Banco de dados SQLite
- ✅ Autenticação JWT
- ✅ CRUD completo de filmes
- ✅ Gerenciamento de categorias
- ✅ Validação de URLs de vídeo
- ✅ Logs de ações admin
- ✅ Geração automática de sitemap.xml e robots.txt

### Testes
- ✅ Testes unitários e de integração com Jest
- ✅ Testes de autenticação e rotas protegidas
- ✅ Testes de CRUD de filmes
- ✅ Validação de URLs
- ✅ Testes de SEO

## 🚀 Começando

### Requisitos
- Node.js (v16+)
- npm ou yarn
- Git

### Instalação

#### 1. Clone o repositório
```bash
git clone <seu-repositorio>
cd evangelical-streaming-mvp
```

#### 2. Instale dependências do Backend
```bash
cd backend
npm install
cp .env.example .env
```

#### 3. Instale dependências do Frontend
```bash
cd ../frontend
npm install
```

### Configuração

#### Backend (.env)
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=sua-chave-secreta-aqui
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
DATABASE_PATH=./database.db
GOOGLE_ADS_CLIENT_ID=seu-id-do-google-ads
SITE_URL=http://localhost:3000
```

#### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:5000/api
```

## 📚 Scripts

### Backend
```bash
# Desenvolvimento
npm run dev

# Produção
npm start

# Testes
npm test

# Testes com cobertura
npm test -- --coverage
```

### Frontend
```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Testes
npm test
```

## 🔌 Rotas da API

### Autenticação
- `POST /api/auth/login` - Login do admin
  ```json
  {
    "username": "admin",
    "password": "admin123"
  }
  ```

### Filmes
- `GET /api/movies` - Listar filmes publicados
- `GET /api/movies?category=acao&search=titulo` - Filtrar filmes
- `GET /api/movies/:id` - Detalhes de um filme
- `POST /api/movies` - Criar filme (admin)
- `PUT /api/movies/:id` - Atualizar filme (admin)
- `DELETE /api/movies/:id` - Deletar filme (admin)
- `POST /api/movies/validate/url` - Validar URL de vídeo

### Categorias
- `GET /api/categories` - Listar categorias
- `POST /api/categories` - Criar categoria (admin)
- `DELETE /api/categories/:id` - Deletar categoria (admin)

### SEO
- `GET /robots.txt` - Arquivo robots.txt
- `GET /sitemap.xml` - Sitemap XML

## 📁 Estrutura de Pastas

```
evangelical-streaming-mvp/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   └── database.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── movies.js
│   │   │   └── categories.js
│   │   ├── utils/
│   │   │   └── auth.js
│   │   └── index.js
│   ├── __tests__/
│   │   └── api.test.js
│   ├── jest.config.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Head.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── MovieCard.jsx
│   │   │   └── VideoPlayer.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── MoviePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── AdminPage.jsx
│   │   │   └── AdminMovieForm.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.jsx
│   │   └── index.css
│   ├── __tests__/
│   │   ├── setup.js
│   │   ├── components.test.jsx
│   │   └── api.test.js
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── jest.config.js
│   ├── package.json
│   └── .gitignore
│
└── README.md
```

## 🛡️ Segurança

- ✅ Senhas com hash bcrypt
- ✅ JWT para autenticação de sessão
- ✅ Sanitização de entrada (XSS protection)
- ✅ CORS configurado
- ✅ Validação de URLs de vídeo
- ✅ Rotas protegidas por autenticação

### Credenciais Padrão
- **Usuário**: admin
- **Senha**: admin123

⚠️ **IMPORTANTE**: Altere essas credenciais em produção!

## 📊 Testes

Todos os testes devem passar:

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

Testes cobrem:
- Autenticação e proteção de rotas
- CRUD de filmes
- CRUD de categorias
- Validação de URLs
- Renderização de componentes
- Geração de sitemap e robots.txt
- Meta tags e SEO

## 🌐 SEO

O projeto inclui otimizações SEO:

- ✅ Meta tags (title, description, keywords)
- ✅ Open Graph tags para redes sociais
- ✅ Estrutura HTML semântica
- ✅ URLs amigáveis
- ✅ Sitemap.xml gerado dinamicamente
- ✅ robots.txt configurado
- ✅ Componente `<Head>` para gerenciamento de meta tags por página

## 📺 Google Ads

Espaços reservados para Google Ads nos seguintes locais:
- Header (topo da página)
- Entre cards de filmes
- Página de player (lado da informação do filme)
- Footer (rodapé)

Para integrar, adicione seu `client ID` no `.env` e uncommente o script no `index.html`:

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
 crossorigin="anonymous"></script>
```

## 🚀 Deployment

### Backend (Heroku, Railway, Vercel)
```bash
npm install
npm start
```

### Frontend (Vercel, Netlify)
```bash
npm run build
# Fazer deploy da pasta `dist/`
```

## 📝 Credenciais de Teste

```
Usuário: admin
Senha: admin123
```

## 🤝 Contribuindo

1. Faça um fork
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é open source sob a licença MIT.

---

**Desenvolvido com ❤️ para a comunidade open-source**
