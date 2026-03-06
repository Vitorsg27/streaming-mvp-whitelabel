# Guia de Contribuição

Agradecemos seu interesse em contribuir para o projeto OpenStream Platform!

## Como Contribuir

### 1. Fork o Repositório
Clique no botão "Fork" no GitHub para criar uma cópia do repositório em sua conta.

### 2. Clone Seu Fork
```bash
git clone https://github.com/seu-usuario/evangelical-streaming-mvp.git
cd evangelical-streaming-mvp
```

### 3. Crie uma Branch
```bash
git checkout -b feature/sua-feature
# ou
git checkout -b fix/seu-fix
```

### 4. Faça Suas Mudanças
- Siga o código existente
- Adicione testes para novas funcionalidades
- Mantenha o código limpo e bem documentado

### 5. Execute os Testes
```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

### 6. Commit suas Mudanças
```bash
git add .
git commit -m "Descrição clara da mudança"
```

### 7. Push para sua Branch
```bash
git push origin feature/sua-feature
```

### 8. Abra um Pull Request
No GitHub, crie um Pull Request descrevendo:
- O que foi mudado
- Por que foi mudado
- Como testar as mudanças

## Padrões de Código

### Backend (Node.js)
- Use `const` e `let`, não `var`
- Use async/await em vez de callbacks
- Adicione documentação em funções importantes
- Siga o padrão REST para APIs

### Frontend (React)
- Use functional components
- Use hooks (useState, useEffect, etc)
- Separe componentes em arquivos individuais
- Use Tailwind CSS para styling
- Adicione PropTypes ou TypeScript quando possível

## Estrutura de Commits

```
tipo(escopo): descrição

corpo (opcional)

```

### Tipos:
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação
- `refactor`: Refatoração
- `test`: Testes

### Exemplo:
```
feat(admin): adicionar filtro de status na lista de filmes

Permite filtrar filmes publicados e rascunhos separadamente
no painel de administração.
```

## Área de Foco

Estamos procurando ajuda em:
- ✅ Testes unitários e de integração
- ✅ Melhorias de UI/UX
- ✅ Documentação
- ✅ Performance
- ✅ Segurança
- ✅ Novos recursos (upload de vídeos, comentários, etc)

## Reportando Bugs

Abra uma issue descrevendo:
- O comportamento esperado
- O comportamento atual
- Passos para reproduzir
- Seu ambiente (OS, Node version, etc)

## Dúvidas?

Abra uma issue com a tag `question` e o repositório será respondido.

Obrigado por contribuir! 🎬❤️
