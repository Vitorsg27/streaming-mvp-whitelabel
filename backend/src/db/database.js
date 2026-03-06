import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let db = null;

export async function initializeDatabase() {
  if (db) return db;

  db = await open({
    filename: path.resolve(__dirname, '../../database.db'),
    driver: sqlite3.Database
  });

  await db.exec('PRAGMA foreign_keys = ON');

  // Create tables
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS movies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      video_url TEXT NOT NULL,
      thumbnail_url TEXT,
      category_id INTEGER,
      status TEXT DEFAULT 'draft',
      views INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS activity_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      action TEXT NOT NULL,
      entity_type TEXT,
      entity_id INTEGER,
      details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Insert default categories
  const categoryCount = await db.get('SELECT COUNT(*) as count FROM categories');
  if (categoryCount.count === 0) {
    await db.run('INSERT INTO categories (name, slug) VALUES (?, ?)', ['Ação', 'acao']);
    await db.run('INSERT INTO categories (name, slug) VALUES (?, ?)', ['Drama', 'drama']);
    await db.run('INSERT INTO categories (name, slug) VALUES (?, ?)', ['Comédia', 'comedia']);
    await db.run('INSERT INTO categories (name, slug) VALUES (?, ?)', ['Documentário', 'documentario']);
    await db.run('INSERT INTO categories (name, slug) VALUES (?, ?)', ['Infantil', 'infantil']);
  }

  // Insert default admin user if not exists
  const adminCount = await db.get('SELECT COUNT(*) as count FROM users WHERE username = ?', ['admin']);
  if (adminCount.count === 0) {
    const bcrypt = await import('bcrypt');
    const hashPassword = await bcrypt.hash('admin123', 10);
    await db.run(
      'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
      ['admin', hashPassword, 'admin']
    );
  }

  // Insert default settings if not exists
  const settingsCount = await db.get('SELECT COUNT(*) as count FROM settings');
  if (settingsCount.count === 0) {
    await db.run('INSERT INTO settings (key, value) VALUES (?, ?)', ['site_name', 'MyStreaming']);
    await db.run('INSERT INTO settings (key, value) VALUES (?, ?)', ['site_description', 'Sua plataforma de vídeos personalizada']);
    await db.run('INSERT INTO settings (key, value) VALUES (?, ?)', ['primary_color', '#C2003D']);
    await db.run('INSERT INTO settings (key, value) VALUES (?, ?)', ['secondary_color', '#8B0029']);
    await db.run('INSERT INTO settings (key, value) VALUES (?, ?)', ['google_ads_client_id', '']);
  }

  return db;
}

export async function getDatabase() {
  if (!db) {
    await initializeDatabase();
  }
  return db;
}
