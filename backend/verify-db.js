import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

const dbPath = path.resolve('./database.db');
console.log(`Abrindo banco em: ${dbPath}\n`);

const db = await open({
  filename: dbPath,
  driver: sqlite3.Database
});

console.log('=== Verificando tabela movies ===\n');

const movies = await db.all('SELECT id, title, status, created_at FROM movies ORDER BY id DESC');
console.log(`Total: ${movies.length} filmes\n`);

if (movies.length > 0) {
  console.log('Filmes:');
  movies.forEach(m => {
    console.log(`  ID: ${m.id} | Título: ${m.title} | Status: ${m.status} | Criado: ${m.created_at}`);
  });
} else {
  console.log('Nenhum filme no banco!');
}

console.log('\n=== Verificando tabela categories ===\n');

const categories = await db.all('SELECT id, name FROM categories');
console.log(`Total: ${categories.length} categorias\n`);

if (categories.length > 0) {
  console.log('Categorias:');
  categories.forEach(c => {
    console.log(`  ID: ${c.id} | Nome: ${c.name}`);
  });
}

await db.close();
