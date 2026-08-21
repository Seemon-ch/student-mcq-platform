const express = require('express');
const router = express.Router();
const pool = require('../config/db');

const VALID_SUBJECTS = ['science', 'mathematics', 'english', 'general-knowledge'];

router.get('/counts', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT subject, COUNT(*) AS count FROM questions GROUP BY subject'
        );
        const counts = { science: 0, mathematics: 0, english: 0, 'general-knowledge': 0 };
        rows.forEach(r => { counts[r.subject] = r.count; });
        res.json(counts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch counts' });
    }
});

router.get('/', async (req, res) => {
    try {
        const { subject } = req.query;
        let sql = 'SELECT * FROM questions';
        const params = [];
        if (subject) {
            sql += ' WHERE subject = ?';
            params.push(subject);
        }
        sql += ' ORDER BY created_at DESC';
        const [rows] = await pool.query(sql, params);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { subject, question, option1, option2, option3, option4, correctOption } = req.body;

        if (!subject || !VALID_SUBJECTS.includes(subject)) {
            return res.status(400).json({ error: 'Invalid or missing subject' });
        }
        if (!question || !option1 || !option2 || !option3 || !option4) {
            return res.status(400).json({ error: 'All question fields are required' });
        }
        const correctNum = Number(correctOption);
        if (![1, 2, 3, 4].includes(correctNum)) {
            return res.status(400).json({ error: 'correctOption must be 1, 2, 3 or 4' });
        }

        const [result] = await pool.query(
            `INSERT INTO questions (subject, question, option1, option2, option3, option4, correct_option)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [subject, question, option1, option2, option3, option4, correctNum]
        );

        res.status(201).json({ id: result.insertId, message: 'Question added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add question' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM questions WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Question not found' });
        }
        res.json({ message: 'Question deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete question' });
    }
});

module.exports = router;