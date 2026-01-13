const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const pool = require('./db/database');
const initializeDatabase = require('./db/init');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Initialize database on startup
initializeDatabase();

// GET all events
app.get('/api/events', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM events ORDER BY date ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create new event
app.post('/api/events', async (req, res) => {
    const { title, description, date, subject, type, progress } = req.body;
    
    if (!title || !date || !subject || !type || !progress) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    try {
        const result = await pool.query(
            'INSERT INTO events (title, description, date, subject, type, progress) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [title, description, date, subject, type, progress]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE event by ID
app.delete('/api/events/:id', async (req, res) => {
    const { id } = req.params;
    console.log('Delete request received with id:', id);
    
    if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }
    
    try {
        const result = await pool.query('DELETE FROM events WHERE id = $1', [parseInt(id)]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json({ message: 'Event deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE event by ID
app.put('/api/events/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, date, subject, type, progress } = req.body;
    try {
        const result = await pool.query(
            'UPDATE events SET title=$1, description=$2, date=$3, subject=$4, type=$5, progress=$6, updated_at=CURRENT_TIMESTAMP WHERE id=$7 RETURNING *',
            [title, description, date, subject, type, progress, parseInt(id)]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});