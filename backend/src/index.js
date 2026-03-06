import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './db/database.js';
import authRoutes from './routes/auth.js';
import moviesRoutes from './routes/movies.js';
import categoriesRoutes from './routes/categories.js';
import settingsRoutes from './routes/settings.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', moviesRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/settings', settingsRoutes);

// SEO routes
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/auth

Sitemap: ${process.env.SITE_URL || 'http://localhost:3000'}/sitemap.xml`);
});

app.get('/sitemap.xml', async (req, res) => {
  res.type('application/xml');
  try {
    const { getDatabase } = await import('./src/db/database.js');
    const db = await getDatabase();
    const movies = await db.all('SELECT id, updated_at FROM movies WHERE status = ?', ['published']);

    const siteUrl = process.env.SITE_URL || 'http://localhost:3000';

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Home page
    xml += `  <url>\n    <loc>${siteUrl}</loc>\n    <changefreq>daily</changefreq>\n  </url>\n`;

    // Movie pages
    for (const movie of movies) {
      xml += `  <url>\n    <loc>${siteUrl}/movie/${movie.id}</loc>\n    <lastmod>${new Date(movie.updated_at).toISOString().split('T')[0]}</lastmod>\n  </url>\n`;
    }

    xml += '</urlset>';
    res.send(xml);
  } catch (error) {
    res.status(500).send('Error generating sitemap');
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

async function startServer() {
  try {
    await initializeDatabase();
    console.log('✓ Database initialized');

    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
