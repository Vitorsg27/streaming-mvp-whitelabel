import Database from 'better-sqlite3';

const db = new Database('./database.db');

console.log('=== Verificando filmes no banco ===\n');

const movies = db.prepare('SELECT * FROM movies').all();
console.log(`Total de filmes: ${movies.length}\n`);

if (movies.length > 0) {
  console.log('Filmes encontrados:');
  movies.forEach(m => {
    console.log(`  ID: ${m.id}, Title: ${m.title}, Status: ${m.status}`);
  });
} else {
  console.log('Nenhum filme encontrado no banco de dados!');
}

db.close();
