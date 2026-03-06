import express from 'express';
import { getDatabase } from '../db/database.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Get all settings
router.get('/', async (req, res) => {
    try {
        const db = await getDatabase();
        const settings = await db.all('SELECT * FROM settings');
        // Convert to key-value object
        const settingsObj = {};
        settings.forEach(s => {
            settingsObj[s.key] = s.value;
        });
        res.json(settingsObj);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update settings
router.put('/', authenticate, adminOnly, async (req, res) => {
    const settingsToUpdate = req.body;

    if (!settingsToUpdate || Object.keys(settingsToUpdate).length === 0) {
        return res.status(400).json({ error: 'No settings provided' });
    }

    try {
        const db = await getDatabase();
        await db.exec('BEGIN TRANSACTION');

        for (const [key, value] of Object.entries(settingsToUpdate)) {
            await db.run(
                'INSERT INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP',
                [key, value]
            );
        }

        await db.exec('COMMIT');

        // Return updated settings
        const updatedSettings = await db.all('SELECT * FROM settings');
        const settingsObj = {};
        updatedSettings.forEach(s => {
            settingsObj[s.key] = s.value;
        });

        res.json({ message: 'Settings updated successfully', settings: settingsObj });
    } catch (error) {
        const db = await getDatabase();
        await db.exec('ROLLBACK');
        res.status(500).json({ error: error.message });
    }
});

export default router;
