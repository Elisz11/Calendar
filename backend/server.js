const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const pool = require('./db/database');
const initializeDatabase = require('./db/init');

const app = express();
const PORT = 5000;

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

// CREATE new event
app.post('/api/events', async (req, res) => {
    const { title, description, date, subject, type, progress } = req.body;
    console.log('Create event request received');

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

    console.log('Create event request completed');
});

// DELETE event by ID
app.delete('/api/events/:id', async (req, res) => {
    const { id } = req.params;
    console.log('Delete event request received with id:', id);
    
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

    console.log('Delete event request completed');
});

// UPDATE event by ID
app.put('/api/events/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, date, subject, type, progress } = req.body;
    console.log('Update event request received with id:', id);

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

    console.log('Update event request completed with id:', id);
});

// GET all subjects
app.get('/api/subjects', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM subjects ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE new subjects
app.post('/api/subjects', async (req, res) => {
    const { title, color} = req.body;
    console.log('Create subjects request received');

    if (!title || !color) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    try {
        const result = await pool.query(
            'INSERT INTO subjects (title, color) VALUES ($1, $2) RETURNING *',
            [title, color]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

    console.log('Create subjects request completed');
});

// DELETE subject by ID
app.delete('/api/subjects/:id', async (req, res) => {
    const { id } = req.params;
    console.log('Delete subject request received with id:', id);
    
    if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }
    
    try {
        const result = await pool.query('DELETE FROM subjects WHERE id = $1', [parseInt(id)]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Subject not found' });
        }
        res.json({ message: 'Subject deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

    console.log('Delete subject request completed');
});

// UPDATE event by ID
app.put('/api/subjects/:id', async (req, res) => {
    const { id } = req.params;
    const { title, color} = req.body;
    console.log('Update subject request received with id:', id);

    try {
        const result = await pool.query(
            'UPDATE subjects SET title=$1, color=$2 WHERE id=$3 RETURNING *',
            [title, color, parseInt(id)]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Subject not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

    console.log('Update subject request completed with id:', id);
});

app.listen(PORT, () => {
    console.log(`Server running`);
});