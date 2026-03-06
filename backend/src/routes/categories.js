import express from 'express';
import { getDatabase } from '../db/database.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const db = await getDatabase();
    const categories = await db.all('SELECT * FROM categories ORDER BY name ASC');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Create category (admin only)
router.post('/', authenticate, adminOnly, async (req, res) => {
  try {
    const { name } = req.body;
    const db = await getDatabase();

    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

    try {
      const result = await db.run(
        'INSERT INTO categories (name, slug) VALUES (?, ?)',
        [name, slug]
      );

      res.status(201).json({ id: result.lastID, name, slug });
    } catch (error) {
      if (error.message.includes('UNIQUE')) {
        return res.status(400).json({ error: 'Category already exists' });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Delete category (admin only)
router.delete('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const db = await getDatabase();
    
    await db.run('DELETE FROM categories WHERE id = ?', [req.params.id]);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

export default router;
