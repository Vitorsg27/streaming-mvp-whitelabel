import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const db = await open({
  filename: './database.db',
  driver: sqlite3.Database
});

console.log('Inserindo filme de teste com status draft...');
await db.run(
  `INSERT INTO movies (title, description, video_url, thumbnail_url, category_id, status)
   VALUES (?, ?, ?, ?, ?, ?)`,
  [
    'Filme em Rascunho',
    'Este filme deve aparecer apenas para o admin',
    'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'https://cdn.pixabay.com/photo/2021/12/12/20/00/play-6865967_1280.jpg',
    2,
    'draft'
  ]
);

console.log('✓ Filme de teste draft inserido');

const allMovies = await db.all('SELECT id, title, status FROM movies ORDER BY id DESC');
console.log('\nTodos os filmes no banco:');
allMovies.forEach(m => {
  console.log(`  ID: ${m.id} | ${m.title} | Status: ${m.status}`);
});

await db.close();
