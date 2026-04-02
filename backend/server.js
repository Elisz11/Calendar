import express from 'express';
import initializeDatabase from './db/init.js';
import eventRoutes from './api/events.js';
import subjectRoutes from './api/subjects.js'
import typesRoutes from './api/types.js'

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

initializeDatabase();

app.use('/events', eventRoutes);
app.use('/subjects', subjectRoutes);
app.use('/types', typesRoutes);

app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err.message);
    res.status(500).json({ 
        error: 'Internal server error',
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});