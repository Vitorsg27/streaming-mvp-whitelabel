import http from 'http';

// Teste de login
console.log('=== TESTE: Login como admin ===\n');

const loginData = JSON.stringify({
  username: 'admin',
  password: 'admin123'
});

const loginOptions = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': loginData.length
  }
};

const loginReq = http.request(loginOptions, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      console.log('✓ Login bem-sucedido!');
      console.log('Token:', result.token.substring(0, 50) + '...\n');
      
      // Agora pedir filmes COM autenticação
      console.log('=== COM autenticação (deve retornar ALL movies) ===\n');
      
      const moviesOptions = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/movies',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${result.token}`
        }
      };
      
      const moviesReq = http.request(moviesOptions, (res) => {
        let movieData = '';
        res.on('data', (chunk) => { movieData += chunk; });
        res.on('end', () => {
          try {
            const movies = JSON.parse(movieData);
            console.log(`Total de filmes para admin: ${movies.length}\n`);
            console.log('Filmes:');
            movies.forEach(m => {
              console.log(`  - ${m.title} (Status: ${m.status})`);
            });
          } catch(e) {
            console.error('Erro ao parsear filmes:', e.message);
          }
        });
      });
      
      moviesReq.on('error', (e) => console.error('Erro:', e.message));
      moviesReq.end();
      
    } catch(e) {
      console.error('Erro ao parsear login:', e.message);
    }
  });
});

loginReq.on('error', (e) => console.error('Erro:', e.message));
loginReq.write(loginData);
loginReq.end();
