import express from 'express';
import pool from '../db/database.js'
const router = express.Router();

// GET all subjects
router.get('/', async (req, res) => {
    const result = await pool.query('SELECT * FROM subjects ORDER BY id ASC');
    res.json(result.rows);
});

// CREATE new subject
router.post('/', async (req, res) => {
    const { title, color } = req.body;
    if (!title || !color) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const result = await pool.query(
        'INSERT INTO subjects (title, color) VALUES ($1, $2) RETURNING *',
        [title, color]
    );
    res.status(201).json(result.rows[0]);
});

// DELETE subject by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }
    
    const result = await pool.query('DELETE FROM subjects WHERE id = $1', [parseInt(id)]);
    if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Subject not found' });
    }
    res.json({ message: 'Subject deleted successfully' });
});

// UPDATE subject by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, color } = req.body;

    const result = await pool.query(
        'UPDATE subjects SET title=$1, color=$2 WHERE id=$3 RETURNING *',
        [title, color, parseInt(id)]
    );
    
    if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Subject not found' });
    }
    res.json(result.rows[0]);
});

export default router;