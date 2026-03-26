import express from 'express';
import pool from '../db/database.js'
const router = express.Router();

// GET all users
router.get('/', async (req, res) => {
    const result = await pool.query('SELECT * FROM users ORDER BY id ASC');
    res.json(result.rows);
});

// CREATE new user
router.post('/', async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await pool.query(
        'INSERT INTO users (username) VALUES ($1) RETURNING *',
        [username]
    );
    res.status(201).json(result.rows[0]);
});

// DELETE user by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }
    
    const result = await pool.query('DELETE FROM users WHERE id = $1', [parseInt(id)]);
    
    if (result.rowCount === 0) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
});

// UPDATE user by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { username } = req.body;

    const result = await pool.query(
        'UPDATE users SET username=$1, updated_at=CURRENT_TIMESTAMP WHERE id=$3 RETURNING *',
        [username, parseInt(id)]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
});

export default router;