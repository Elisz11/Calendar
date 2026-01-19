const pool = require('./database');

async function initializeDatabase() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS events (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                date DATE NOT NULL,
                subject VARCHAR(255) NOT NULL,
                type VARCHAR(255) NOT NULL,
                progress VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_events_date ON events(date)
        `);

        await pool.query(`
            CREATE TABLE IF NOT ESIST subjects (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                color VARCHAR(7) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        console.log('Database tables initialized');
    } catch (err) {
        console.error('Error initializing database:', err);
    }
}

module.exports = initializeDatabase;