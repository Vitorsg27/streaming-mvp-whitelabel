import express from 'express';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/auth.js';
import { getDatabase } from '../db/database.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const db = await getDatabase();
    const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id, user.username, user.role);

    // Log the login
    await db.run(
      'INSERT INTO activity_logs (user_id, action, entity_type, details) VALUES (?, ?, ?, ?)',
      [user.id, 'login', 'auth', null]
    );

    const isDefaultPassword = password === 'admin123';

    res.json({ token, user: { id: user.id, username: user.username, role: user.role, isDefaultPassword } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.put('/password', authenticate, adminOnly, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'As senhas atual e nova são obrigatórias' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'A nova senha deve ter pelo menos 6 caracteres' });
    }

    const db = await getDatabase();
    const user = await db.get('SELECT * FROM users WHERE id = ?', [userId]);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const validPassword = await bcrypt.compare(currentPassword, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'A senha atual está incorreta' });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);
    await db.run('UPDATE users SET password_hash = ? WHERE id = ?', [hashPassword, userId]);

    await db.run(
      'INSERT INTO activity_logs (user_id, action, entity_type, details) VALUES (?, ?, ?, ?)',
      [user.id, 'password_change', 'auth', null]
    );

    res.json({ message: 'Senha atualizada com sucesso' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Falha ao atualizar a senha' });
  }
});

export default router;
