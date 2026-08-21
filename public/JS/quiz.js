document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const subject = params.get('subject') || 'mixed';

    const quizTitle = document.getElementById('quizTitle');
    const loadingMsg = document.getElementById('loadingMsg');
    const errorMsg = document.getElementById('errorMsg');
    const quizForm = document.getElementById('quizForm');
    const questionsContainer = document.getElementById('questionsContainer');
    const resultBox = document.getElementById('resultBox');
    const scoreHeading = document.getElementById('scoreHeading');
    const reviewList = document.getElementById('reviewList');
    const retryBtn = document.getElementById('retryBtn');

    quizTitle.textContent = subject === 'mixed' ? 'Mixed Practice' : `${subject.replace('-', ' ')} Practice`;

    let currentQuestions = [];

    loadQuiz();

    async function loadQuiz() {
        try {
            const res = await fetch(`/api/practice/${encodeURIComponent(subject)}`);
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || 'Failed to load questions');
            }
            currentQuestions = await res.json();
            renderQuestions(currentQuestions);
            loadingMsg.style.display = 'none';
            quizForm.style.display = 'block';
        } catch (err) {
            loadingMsg.style.display = 'none';
            errorMsg.style.display = 'block';
            errorMsg.textContent = err.message;
        }
    }

    function renderQuestions(questions) {
        questionsContainer.innerHTML = '';
        questions.forEach((q, index) => {
            const card = document.createElement('div');
            card.className = 'question-card';

            const options = [q.option1, q.option2, q.option3, q.option4];
            const optionsHtml = options.map((opt, i) => `
                <label class="option-label">
                    <input type="radio" name="q_${q.id}" value="${i + 1}" required>
                    <span>${escapeHtml(opt)}</span>
                </label>
            `).join('');

            card.innerHTML = `
                <h3>${index + 1}. ${escapeHtml(q.question)}</h3>
                ${optionsHtml}
            `;
            questionsContainer.appendChild(card);
        });
    }

    quizForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const answers = currentQuestions.map(q => {
            const selected = quizForm.querySelector(`input[name="q_${q.id}"]:checked`);
            return {
                questionId: q.id,
                selectedOption: selected ? Number(selected.value) : null
            };
        });

        try {
            const res = await fetch('/api/practice/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subject, answers })
            });

            if (!res.ok) throw new Error('Failed to submit quiz');

            const data = await res.json();
            showResults(data);
        } catch (err) {
            errorMsg.style.display = 'block';
            errorMsg.textContent = err.message;
        }
    });

    function showResults(data) {
        quizForm.style.display = 'none';
        resultBox.style.display = 'block';
        scoreHeading.textContent = `You scored ${data.score} / ${data.total}`;

        reviewList.innerHTML = data.results.map(r => {
            const question = currentQuestions.find(q => q.id === r.questionId);
            const options = question ? [question.option1, question.option2, question.option3, question.option4] : [];
            const correctText = r.correctOption ? options[r.correctOption - 1] : 'N/A';
            const selectedText = r.selectedOption ? options[r.selectedOption - 1] : 'No answer';

            return `
                <div class="review-item ${r.isCorrect ? 'correct' : 'incorrect'}">
                    <div class="tag">${r.isCorrect ? 'Correct' : 'Incorrect'}</div>
                    <p>${escapeHtml(question ? question.question : '')}</p>
                    <p>Your answer: ${escapeHtml(String(selectedText))}</p>
                    ${!r.isCorrect ? `<p>Correct answer: ${escapeHtml(String(correctText))}</p>` : ''}
                </div>
            `;
        }).join('');
    }

    retryBtn.addEventListener('click', () => {
        window.location.reload();
    });

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
});