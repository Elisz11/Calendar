import express from 'express';
import pool from '../db/database.js'
const router = express.Router();

// GET all events
router.get('/', async (req, res) => {
    const result = await pool.query('SELECT * FROM events ORDER BY date ASC');
    res.json(result.rows);
});

// CREATE new event
router.post('/', async (req, res) => {
    const { title, description, date, subject, type, progress } = req.body;

    if (!title || !date || !subject || !type || !progress) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await pool.query(
        'INSERT INTO events (title, description, date, subject, type, progress) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [title, description, date, subject, type, progress]
    );
    res.status(201).json(result.rows[0]);
});

// DELETE event by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }
    
    const result = await pool.query('DELETE FROM events WHERE id = $1', [parseInt(id)]);
    
    if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
});

// UPDATE event by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, date, subject, type, progress } = req.body;

    const result = await pool.query(
        'UPDATE events SET title=$1, description=$2, date=$3, subject=$4, type=$5, progress=$6, updated_at=CURRENT_TIMESTAMP WHERE id=$7 RETURNING *',
        [title, description, date, subject, type, progress, parseInt(id)]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Event not found' });
    }
    res.json(result.rows[0]);
});

export default router;