# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Autenticação

### Login
Fazer login com credenciais de admin.

**Endpoint:** `POST /auth/login`

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

**Status Codes:**
- `200 OK` - Login realizado com sucesso
- `400 Bad Request` - Campos obrigatórios faltando
- `401 Unauthorized` - Credenciais inválidas

---

## Filmes

### Listar Filmes
Retorna lista de filmes publicados (público) ou todos (admin).

**Endpoint:** `GET /movies`

**Query Parameters:**
- `category` (string, optional) - Slug da categoria para filtrar
- `search` (string, optional) - Termo de busca por título ou descrição
- `status` (string, optional) - Status do filme (draft, published) - apenas para admin

**Response:**
```json
[
  {
    "id": 1,
    "title": "O Evangelho Segundo João",
    "description": "Um filme poderoso sobre a vida...",
    "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "thumbnail_url": "https://example.com/thumb.jpg",
    "category_id": 1,
    "category_name": "Drama",
    "status": "published",
    "views": 150,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
]
```

**Status Codes:**
- `200 OK` - Sucesso
- `500 Internal Server Error` - Erro no servidor

---

### Buscar Filme por ID
Retorna detalhes de um filme específico.

**Endpoint:** `GET /movies/:id`

**Parameters:**
- `id` (number, required) - ID do filme

**Response:**
```json
{
  "id": 1,
  "title": "O Evangelho Segundo João",
  "description": "Um filme poderoso...",
  "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
  "thumbnail_url": "https://example.com/thumb.jpg",
  "category_id": 1,
  "category_name": "Drama",
  "status": "published",
  "views": 151,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

**Status Codes:**
- `200 OK` - Sucesso
- `403 Forbidden` - Filme não publicado e usuário não é admin
- `404 Not Found` - Filme não encontrado

---

### Criar Filme
Cria um novo filme (admin apenas).

**Endpoint:** `POST /movies`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Novo Filme",
  "description": "Descrição do filme",
  "video_url": "https://youtu.be/dQw4w9WgXcQ",
  "thumbnail_url": "https://example.com/thumb.jpg",
  "category_id": 1
}
```

**Response:**
```json
{
  "id": 10,
  "message": "Movie created successfully"
}
```

**Status Codes:**
- `201 Created` - Filme criado com sucesso
- `400 Bad Request` - Dados inválidos
- `401 Unauthorized` - Token não fornecido ou inválido
- `403 Forbidden` - Usuário não é admin

---

### Atualizar Filme
Atualiza um filme existente (admin apenas).

**Endpoint:** `PUT /movies/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Parameters:**
- `id` (number, required) - ID do filme

**Request Body:**
```json
{
  "title": "Título Atualizado",
  "description": "Descrição atualizada",
  "video_url": "https://youtu.be/newVideoId",
  "thumbnail_url": "https://example.com/new-thumb.jpg",
  "category_id": 2,
  "status": "published"
}
```

**Response:**
```json
{
  "message": "Movie updated successfully"
}
```

**Status Codes:**
- `200 OK` - Filme atualizado com sucesso
- `400 Bad Request` - Dados inválidos
- `401 Unauthorized` - Token não fornecido ou inválido
- `403 Forbidden` - Usuário não é admin
- `404 Not Found` - Filme não encontrado

---

### Deletar Filme
Remove um filme (admin apenas).

**Endpoint:** `DELETE /movies/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Parameters:**
- `id` (number, required) - ID do filme

**Response:**
```json
{
  "message": "Movie deleted successfully"
}
```

**Status Codes:**
- `200 OK` - Filme deletado com sucesso
- `401 Unauthorized` - Token não fornecido ou inválido
- `403 Forbidden` - Usuário não é admin
- `404 Not Found` - Filme não encontrado

---

### Validar URL de Vídeo
Valida uma URL de vídeo e retorna o embed URL.

**Endpoint:** `POST /movies/validate/url`

**Request Body:**
```json
{
  "url": "https://youtube.com/watch?v=dQw4w9WgXcQ"
}
```

**Response:**
```json
{
  "valid": true,
  "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
}
```

**Status Codes:**
- `200 OK` - Validação concluída
- `400 Bad Request` - URL não fornecida

---

## Categorias

### Listar Categorias
Retorna lista de todas as categorias.

**Endpoint:** `GET /categories`

**Response:**
```json
[
  {
    "id": 1,
    "name": "Drama",
    "slug": "drama",
    "created_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": 2,
    "name": "Ação",
    "slug": "acao",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

**Status Codes:**
- `200 OK` - Sucesso

---

### Criar Categoria
Cria uma nova categoria (admin apenas).

**Endpoint:** `POST /categories`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Comédia"
}
```

**Response:**
```json
{
  "id": 3,
  "name": "Comédia",
  "slug": "comedia"
}
```

**Status Codes:**
- `201 Created` - Categoria criada com sucesso
- `400 Bad Request` - Dados inválidos ou categoria duplicada
- `401 Unauthorized` - Token não fornecido ou inválido
- `403 Forbidden` - Usuário não é admin

---

### Deletar Categoria
Remove uma categoria (admin apenas).

**Endpoint:** `DELETE /categories/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Parameters:**
- `id` (number, required) - ID da categoria

**Response:**
```json
{
  "message": "Category deleted successfully"
}
```

**Status Codes:**
- `200 OK` - Categoria deletada com sucesso
- `401 Unauthorized` - Token não fornecido ou inválido
- `403 Forbidden` - Usuário não é admin

---

## SEO

### robots.txt
Retorna arquivo robots.txt.

**Endpoint:** `GET /robots.txt`

**Response:**
```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/auth

Sitemap: http://localhost:3000/sitemap.xml
```

---

### sitemap.xml
Retorna sitemap XML com URLs de todos os filmes publicados.

**Endpoint:** `GET /sitemap.xml`

**Response:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>http://localhost:3000</loc>
    <changefreq>daily</changefreq>
  </url>
  <url>
    <loc>http://localhost:3000/movie/1</loc>
    <lastmod>2024-01-15</lastmod>
  </url>
</urlset>
```

---

## Tratamento de Erros

Todos os erros retornam formato JSON:

```json
{
  "error": "Mensagem de erro descritiva"
}
```

### Códigos de Status HTTP
- `200 OK` - Requisição bem-sucedida
- `201 Created` - Recurso criado com sucesso
- `400 Bad Request` - Dados inválidos
- `401 Unauthorized` - Autenticação necessária ou inválida
- `403 Forbidden` - Acesso negado
- `404 Not Found` - Recurso não encontrado
- `500 Internal Server Error` - Erro do servidor

---

## Rate Limiting
Não há rate limiting implementado neste MVP, mas considere adicionar em produção.

## CORS
CORS está habilitado para `localhost:3000` em desenvolvimento. Configure a whitelist de URLs permitidas em produção no arquivo `src/index.js`.
