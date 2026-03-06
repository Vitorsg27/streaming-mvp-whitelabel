import express from 'express';
import { getDatabase } from '../db/database.js';
import { authenticate, adminOnly, optionalAuth } from '../middleware/auth.js';
import { isValidVideoUrl, sanitizeInput, getYoutubeEmbedUrl } from '../utils/auth.js';

const router = express.Router();

// Get all movies with filtering
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, search, status } = req.query;
    const db = await getDatabase();

    console.log('GET /movies - User:', req.user ? `${req.user.username} (${req.user.role})` : 'Not authenticated');
    console.log('Query params:', { category, search, status });

    let query = `
      SELECT m.*, c.name as category_name
      FROM movies m
      LEFT JOIN categories c ON m.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    // Only show published movies to public, unless admin
    if (!req.user) {
      query += ' AND m.status = ?';
      params.push('published');
      console.log('  → Filtering to published (not authenticated)');
    } else {
      console.log('  → Authenticated user, showing all statuses');
    }

    if (category) {
      query += ' AND c.slug = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (m.title LIKE ? OR m.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (status && req.user?.role === 'admin') {
      query += ' AND m.status = ?';
      params.push(status);
      console.log(`  → Filter by status: ${status}`);
    }

    query += ' ORDER BY m.created_at DESC LIMIT 50';

    const movies = await db.all(query, params);
    console.log(`  → Returning ${movies.length} movies`);
    res.json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

// Get single movie
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const db = await getDatabase();
    const movie = await db.get(`
      SELECT m.*, c.name as category_name
      FROM movies m
      LEFT JOIN categories c ON m.category_id = c.id
      WHERE m.id = ?
    `, [req.params.id]);

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    // If not published and not admin, deny access
    if (movie.status !== 'published' && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Movie not available' });
    }

    // Increment view count
    await db.run('UPDATE movies SET views = views + 1 WHERE id = ?', [req.params.id]);

    res.json(movie);
  } catch (error) {
    console.error('Error fetching movie:', error);
    res.status(500).json({ error: 'Failed to fetch movie' });
  }
});

// Create movie (admin only)
router.post('/', authenticate, adminOnly, async (req, res) => {
  try {
    console.log('POST /movies - Criando novo filme');
    console.log('Usuário:', req.user);
    const { title, description, video_url, thumbnail_url, category_id, status } = req.body;
    const db = await getDatabase();

    console.log('Dados recebidos:', { title, description, video_url, thumbnail_url, category_id, status });

    if (!title || !video_url) {
      console.log('Erro: Title ou video_url faltando');
      return res.status(400).json({ error: 'Title and video_url are required' });
    }

    if (!isValidVideoUrl(video_url)) {
      console.log('Erro: URL de vídeo inválida:', video_url);
      return res.status(400).json({ error: 'Invalid video URL' });
    }

    const embedUrl = getYoutubeEmbedUrl(video_url);
    console.log('URL convertida para embed:', embedUrl);

    const result = await db.run(
      `INSERT INTO movies (title, description, video_url, thumbnail_url, category_id, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        sanitizeInput(title),
        sanitizeInput(description),
        embedUrl,
        thumbnail_url,
        category_id || null,
        status || 'draft'
      ]
    );

    console.log('Filme criado com ID:', result.lastID);

    // Log the action
    await db.run(
      'INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)',
      [req.user.userId, 'create', 'movie', result.lastID, `Created movie: ${title}`]
    );

    console.log('Log de ação gravado');
    res.status(201).json({ id: result.lastID, message: 'Movie created successfully' });
  } catch (error) {
    console.error('Erro ao criar filme:', error);
    res.status(500).json({ error: 'Failed to create movie' });
  }
});

// Update movie (admin only)
router.put('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const { title, description, video_url, thumbnail_url, category_id, status } = req.body;
    const db = await getDatabase();

    const movie = await db.get('SELECT * FROM movies WHERE id = ?', [req.params.id]);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    if (video_url && !isValidVideoUrl(video_url)) {
      return res.status(400).json({ error: 'Invalid video URL' });
    }

    const embedUrl = video_url ? getYoutubeEmbedUrl(video_url) : movie.video_url;

    await db.run(
      `UPDATE movies
       SET title = ?, description = ?, video_url = ?, thumbnail_url = ?, category_id = ?, status = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        title ? sanitizeInput(title) : movie.title,
        description !== undefined ? sanitizeInput(description) : movie.description,
        embedUrl,
        thumbnail_url !== undefined ? thumbnail_url : movie.thumbnail_url,
        category_id !== undefined ? category_id : movie.category_id,
        status || movie.status,
        req.params.id
      ]
    );

    // Log the action
    await db.run(
      'INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)',
      [req.user.userId, 'update', 'movie', req.params.id, `Updated movie: ${title || movie.title}`]
    );

    res.json({ message: 'Movie updated successfully' });
  } catch (error) {
    console.error('Error updating movie:', error);
    res.status(500).json({ error: 'Failed to update movie' });
  }
});

// Delete movie (admin only)
router.delete('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const db = await getDatabase();
    const movie = await db.get('SELECT * FROM movies WHERE id = ?', [req.params.id]);

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    await db.run('DELETE FROM movies WHERE id = ?', [req.params.id]);

    // Log the action
    await db.run(
      'INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)',
      [req.user.userId, 'delete', 'movie', req.params.id, `Deleted movie: ${movie.title}`]
    );

    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error('Error deleting movie:', error);
    res.status(500).json({ error: 'Failed to delete movie' });
  }
});

// Validate video URL
router.post('/validate/url', (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const isValid = isValidVideoUrl(url);
    const embedUrl = getYoutubeEmbedUrl(url);

    res.json({ valid: isValid, embedUrl });
  } catch (error) {
    console.error('Error validating URL:', error);
    res.status(500).json({ error: 'Failed to validate URL' });
  }
});

export default router;
