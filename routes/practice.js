const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const VALID_SUBJECTS = ['science', 'mathematics', 'english', 'general-knowledge'];

router.get('/:subject', async (req, res) => {
    try {
        const { subject } = req.params;
        let rows;

        if (subject === 'mixed') {
            [rows] = await pool.query(
                `SELECT id, subject, question, option1, option2, option3, option4
                 FROM questions ORDER BY RAND() LIMIT 20`
            );
        } else {
            if (!VALID_SUBJECTS.includes(subject)) {
                return res.status(400).json({ error: 'Invalid subject' });
            }
            [rows] = await pool.query(
                `SELECT id, subject, question, option1, option2, option3, option4
                 FROM questions WHERE subject = ? ORDER BY RAND()`,
                [subject]
            );
        }

        if (rows.length === 0) {
            return res.status(404).json({ error: 'No questions available for this subject yet' });
        }

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch quiz questions' });
    }
});

router.post('/submit', async (req, res) => {
    try {
        const { subject, answers } = req.body;

        if (!Array.isArray(answers) || answers.length === 0) {
            return res.status(400).json({ error: 'answers array is required' });
        }

        const questionIds = answers.map(a => a.questionId);
        const [rows] = await pool.query(
            `SELECT id, correct_option, question FROM questions WHERE id IN (?)`,
            [questionIds]
        );

        const correctMap = new Map(rows.map(r => [r.id, r]));
        let score = 0;

        const results = answers.map(a => {
            const correctRow = correctMap.get(a.questionId);
            const isCorrect = correctRow && correctRow.correct_option === Number(a.selectedOption);
            if (isCorrect) score++;
            return {
                questionId: a.questionId,
                selectedOption: a.selectedOption,
                correctOption: correctRow ? correctRow.correct_option : null,
                isCorrect: Boolean(isCorrect)
            };
        });

        await pool.query(
            'INSERT INTO attempts (subject, score, total) VALUES (?, ?, ?)',
            [subject || 'mixed', score, answers.length]
        );

        res.json({ score, total: answers.length, results });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to score quiz' });
    }
});

module.exports = router;