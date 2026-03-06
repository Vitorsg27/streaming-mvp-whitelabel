import http from 'http';

console.log('=== Teste: Acessar filme draft (17) sem autenticação ===\n');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/movies/17',
  method: 'GET',
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log('Response:', data);
    
    console.log('\n=== Teste: Acessar filme draft (17) COM autenticação ===\n');
    
    testWithAuth();
  });
});

req.on('error', (e) => console.error('Erro:', e.message));
req.end();

function testWithAuth() {
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
    let loginResp = '';
    res.on('data', (chunk) => { loginResp += chunk; });
    res.on('end', () => {
      const result = JSON.parse(loginResp);
      
      const movieOptions = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/movies/17',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${result.token}`
        }
      };
      
      const movieReq = http.request(movieOptions, (res) => {
        let movieData = '';
        res.on('data', (chunk) => { movieData += chunk; });
        res.on('end', () => {
          const movie = JSON.parse(movieData);
          console.log(`Status: ${res.statusCode}`);
          console.log(`Filme: ${movie.title} (Status: ${movie.status})`);
        });
      });
      
      movieReq.on('error', (e) => console.error('Erro:', e.message));
      movieReq.end();
    });
  });

  loginReq.on('error', (e) => console.error('Erro:', e.message));
  loginReq.write(loginData);
  loginReq.end();
}
