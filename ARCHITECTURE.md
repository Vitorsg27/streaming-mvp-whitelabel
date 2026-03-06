# Arquitetura e Código

## Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Browser (http://localhost:3000)                    │   │
│  │  ├── HomePage (Catálogo + Filtros)                  │   │
│  │  ├── MoviePage (Detalhes + Player)                  │   │
│  │  ├── LoginPage (Autenticação)                       │   │
│  │  └── AdminPage (Painel de Administração)            │   │
│  │      ├── AdminMovieForm (CRUD de filmes)            │   │
│  │      └── Gerencia categorias                        │   │
│  └──────────────────────────────────────────────────────┘   │
│                         ↓ (HTTP/JSON)                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│               Backend (Node.js + Express)                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Server (http://localhost:5000)                     │   │
│  │                                                       │   │
│  │  Routes:                                             │   │
│  │  ├── POST /api/auth/login                           │   │
│  │  │   └─ Autnicação JWT                              │   │
│  │  │                                                   │   │
│  │  ├── GET/POST/PUT/DELETE /api/movies                │   │
│  │  │   └─ CRUD de filmes com validação                │   │
│  │  │                                                   │   │
│  │  ├── GET/POST/DELETE /api/categories                │   │
│  │  │   └─ Gerenciamento de categorias                 │   │
│  │  │                                                   │   │
│  │  ├── GET /robots.txt                                │   │
│  │  └─ GET /sitemap.xml (SEO)                          │   │
│  └──────────────────────────────────────────────────────┘   │
│                         ↓                                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│             Database (SQLite)                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  database.db                                         │   │
│  │  ├── users (autenticação)                           │   │
│  │  ├── categories                                      │   │
│  │  ├── movies (filmes + metadados)                     │   │
│  │  └── activity_logs (auditoria)                       │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Fluxo de Autenticação

```
┌──────────────┐
│   Cliente    │
│   (Browser)  │
└──────┬───────┘
       │ 1. POST /api/auth/login
       │    {username, password}
       ↓
┌──────────────────────────┐
│   Backend (Express)      │
├──────────────────────────┤
│ auth.js (route)          │
│ - Valida credenciais     │
│ - Compara hash bcrypt    │
│ - Gera JWT token         │
└──────┬───────────────────┘
       │ 2. Response {token, user}
       ↓
┌──────────────────────────┐
│   LocalStorage           │
│ - Armazena token         │
│ - Armazena dados do user │
└──────┬───────────────────┘
       │ 3. Requisições subsequentes
       │    Header: Authorization: Bearer <token>
       ↓
┌──────────────────────────────────┐
│   Middleware de Autenticação     │
│ - Verifica token JWT             │
│ - Decodifica payload             │
│ - Valida expiração (24h)         │
│ - Rejeita se inválido            │
└──────────────────────────────────┘
```

## Fluxo de CRUD de Filmes

```
┌─────────────────────────────────────────────────┐
│  CRIAR FILME (POST /api/movies)                │
├─────────────────────────────────────────────────┤
│ 1. User completa formulário no admin           │
│ 2. Frontend valida dados localmente            │
│ 3. Valida URL do vídeo (POST /validate/url)   │
│ 4. POST /api/movies com dados sanitizados     │
│ 5. Backend valida entrada novamente            │
│ 6. Converte URL YouTube para embed             │
│ 7. Insere na database                          │
│ 8. Registra log de ação (activity_logs)        │
│ 9. Retorna ID do novo filme                    │
│ 10. Frontend redireciona para admin            │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  LISTAR FILMES (GET /api/movies)               │
├─────────────────────────────────────────────────┤
│ 1. Frontend faz request com query params       │
│    ?category=drama&search=evangelico            │
│ 2. Backend filtra pela categoria (slug)        │
│ 3. Faz LIKE search no título/descrição         │
│ 4. Se não admin, retorna apenas publicados     │
│ 5. Retorna array de filmes (max 50)            │
│ 6. Frontend renderiza em grid de cards         │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  ATUALIZAR FILME (PUT /api/movies/:id)         │
├─────────────────────────────────────────────────┤
│ 1. Admin clica editar                          │
│ 2. Frontend GET /api/movies/:id (carrega)      │
│ 3. Preenche formulário com dados atuais        │
│ 4. User edita campos                           │
│ 5. Valida URL se alterada                      │
│ 6. PUT /api/movies/:id com novos dados         │
│ 7. Backend valida tudo novamente               │
│ 8. Atualiza database com CURRENT_TIMESTAMP     │
│ 9. Registra log da ação                        │
│ 10. Retorna sucesso                            │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  DELETAR FILME (DELETE /api/movies/:id)        │
├─────────────────────────────────────────────────┤
│ 1. Admin clica deletar                         │
│ 2. Pede confirmação (confirm dialog)           │
│ 3. DELETE /api/movies/:id                      │
│ 4. Backend verifica permissões                 │
│ 5. Remove filme da database                    │
│ 6. Registra log da ação                        │
│ 7. Retorna sucesso                             │
│ 8. Frontend atualiza lista                     │
└─────────────────────────────────────────────────┘
```

## Estrutura de Componentes React

```
App.jsx (raiz)
├── Router (React Router v6)
├── AuthProvider (contexto)
│   └── AppContent
│       ├── Header
│       │   ├── Logo
│       │   ├── Nav
│       │   └── Auth buttons (condicional)
│       │
│       ├── Routes
│       │   ├── / → HomePage
│       │   │   ├── Head (SEO)
│       │   │   ├── SearchBar
│       │   │   ├── CategoryFilter
│       │   │   └── MovieCard[] (grid)
│       │   │
│       │   ├── /movie/:id → MoviePage
│       │   │   ├── Head (com meta dinâmicos)
│       │   │   ├── VideoPlayer
│       │   │   └── MovieInfo
│       │   │
│       │   ├── /login → LoginPage
│       │   │   └── LoginForm
│       │   │
│       │   └── /admin → AdminPage (protected)
│       │       ├── Stats
│       │       ├── CreateButton
│       │       ├── AdminMovieForm (condicional)
│       │       │   ├── InputTitle
│       │       │   ├── InputDescription
│       │       │   ├── InputVideoUrl
│       │       │   │   └── ValidateButton
│       │       │   ├── InputThumbnail
│       │       │   ├── SelectCategory
│       │       │   ├── SelectStatus
│       │       │   └── SubmitButton
│       │       │
│       │       └── MovieTable (paginada)
│       │           └── MovieRow[] (actions)
│       │
│       └── Footer
│           ├── Links
│           └── AdSpace
```

## Estrutura de Estado (Context + LocalStorage)

### AuthContext
```javascript
{
  user: {
    id: number,
    username: string,
    role: 'admin'
  },
  token: string, // JWT
  loading: boolean,
  isAdmin: boolean,
  login: (username, password) => Promise,
  logout: () => void
}

// Persistência: LocalStorage
localStorage.auth_token = "eyJhbGc..."
localStorage.auth_user = "{\"id\": 1, \"username\": \"admin\"}"
```

## Estrutura de Banco de Dados

### users
```sql
id              INTEGER PRIMARY KEY
username        TEXT UNIQUE NOT NULL
password_hash   TEXT NOT NULL (bcrypt)
role           TEXT DEFAULT 'admin'
created_at     DATETIME DEFAULT CURRENT_TIMESTAMP
```

### categories
```sql
id              INTEGER PRIMARY KEY
name            TEXT UNIQUE NOT NULL
slug            TEXT UNIQUE NOT NULL
created_at     DATETIME DEFAULT CURRENT_TIMESTAMP
```

### movies
```sql
id              INTEGER PRIMARY KEY
title           TEXT NOT NULL
description     TEXT
video_url       TEXT NOT NULL (embed URL)
thumbnail_url   TEXT (can be null)
category_id     INTEGER FK
status          TEXT DEFAULT 'draft' (draft|published)
views           INTEGER DEFAULT 0
created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP
```

### activity_logs
```sql
id              INTEGER PRIMARY KEY
user_id         INTEGER FK
action          TEXT NOT NULL (create|update|delete|login)
entity_type     TEXT (movie|category|auth)
entity_id       INTEGER (opcional)
details         TEXT (JSON serializado)
created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
```

## Implementações de Segurança

### 1. Autenticação (JWT)
- Token com expiração de 24h
- Payload: `{userId, username}`
- Verificação em cada rota protegida

### 2. Autorização (Role-based)
- Middleware `adminOnly` verifica `user.role`
- Rotas de CRUD requerem token + admin

### 3. Hash de Senhas
- Bcrypt com salt rounds = 10
- Salted hash comparado no login

### 4. Sanitização de Input
- Função `sanitizeInput()` escapa caracteres
- Previne XSS em descrições/títulos
- Validação de URLs com regex

### 5. Validação de URLs
- Regex specifico para YouTube
- Validação de URLs genéricas
- Conversão automática para embed URL

## Fluxo de SEO

```
┌──────────────────────┐
│   Páginas Estáticas  │
├──────────────────────┤
│ title               │
│ description         │
│ keywords            │
│ og:* tags           │
│ estrutura semântica │
└──────┬───────────────┘
       │ Geradas no index.html
       │ + componente Head.jsx
       ↓
┌──────────────────────┐
│   Página Dinâmica    │
│   (MoviePage)        │
├──────────────────────┤
│ Carrega filme        │
│ Atualiza meta tags   │
│ com dados do filme   │
└──────┬───────────────┘
       │
       ↓
┌──────────────────────┐
│   Sitemap.xml        │
├──────────────────────┤
│ GET /sitemap.xml     │
│ - Home               │
│ - /movie/:id urls    │
│ - lastmod dates      │
└──────────────────────┘
       
       + robots.txt
       - Disallow: /admin
       - Disallow: /api/auth
```

## Performance Considerations

1. **Frontend**
   - Lazy loading de imagens
   - Code splitting com React Router
   - Caching com LocalStorage
   - Debounce na barra de busca

2. **Backend**
   - Database índices em slug e title
   - Paginação (LIMIT 50)
   - Query optimization
   - Caching headers

3. **Videos**
   - YouTube embed (faster)
   - Direct video links (on-demand)
   - No video storage (economia de banda)

## Escalabilidade Futura

Para evoluir o MVP para produção:

1. Migrar SQLite → PostgreSQL
2. Adicionar cache (Redis)
3. CDN para thumbnails
4. Queue worker para encoding de vídeos
5. Análises detalhadas de visualizações
6. Sistema de comentários/ratings
7. Perfil do usuário (watchlist, histórico)
