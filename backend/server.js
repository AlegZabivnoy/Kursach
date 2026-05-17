require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pool.connect((err) => {
    if(err) console.error('Error connecting to the database:', err.stack);
    else console.log('Connected to the database');
});

app.get('/api/transactions', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM transactions ORDER BY created_at DESC');
        res.json(result.rows);

    } catch(err) {
        console.error('Error in GET', err.message);
        res.status(500).json([]);
    }
});

app.post('/api/transactions', async (req, res) => {
    try {
        const { name, price, type } = req.body;
        const result = await pool.query ('INSERT INTO transactions (name, price, type) VALUES ($1, $2, $3) RETURNING *', [name, price, type]);

        res.json(result.rows[0]);
    } catch(err) {
        console.error('Error in POST', err.message);
        res.status(500).json({ error: 'Error during saving transaction' });
    }
});

app.delete('/api/transactions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM transactions WHERE id = $1', [id]);
        res.json({ message: 'Transaction deleted' });
    } catch(err) {
        console.error('Error in DELETE', err.message)
        res.status(500).json({ error: 'Error during deleting transaction' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});