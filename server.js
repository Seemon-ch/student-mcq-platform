const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const questionsRouter = require('./routes/questions');
const practiceRouter = require('./routes/practice');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/questions', questionsRouter);
app.use('/api/practice', practiceRouter);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
    console.log(`MCQ Practice Platform running at http://localhost:${PORT}`);
});