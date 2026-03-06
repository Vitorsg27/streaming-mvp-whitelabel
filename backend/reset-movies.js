import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const db = await open({
  filename: './database.db',
  driver: sqlite3.Database
});

console.log('Limpando filmes antigos...');
await db.run('DELETE FROM movies');
console.log('✓ Filmes deletados');

console.log('\nInserindo filme de teste com status published...');
await db.run(
  `INSERT INTO movies (title, description, video_url, thumbnail_url, category_id, status)
   VALUES (?, ?, ?, ?, ?, ?)`,
  [
    'Teste Publicado',
    'Este é um filme de teste que deve aparecer no catálogo',
    'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg',
    1,
    'published'
  ]
);

console.log('✓ Filme de teste inserido');

const movies = await db.all('SELECT id, title, status FROM movies');
console.log('\nFilmes no banco:');
movies.forEach(m => {
  console.log(`  ID: ${m.id} | Título: ${m.title} | Status: ${m.status}`);
});

await db.close();
console.log('\n✓ Banco limpo e atualizado!');
