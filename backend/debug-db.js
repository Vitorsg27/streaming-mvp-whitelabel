import Database from 'better-sqlite3';

const db = new Database('./database.db');
const user = db.prepare('SELECT * FROM users WHERE username = ?').get('admin');
console.log('Admin user:', user);
