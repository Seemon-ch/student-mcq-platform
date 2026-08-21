document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('addQuestionForm');
    const formMessage = document.getElementById('formMessage');

    loadCounts();

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const payload = {
            subject: document.getElementById('subject').value,
            question: document.getElementById('question').value.trim(),
            option1: document.getElementById('option1').value.trim(),
            option2: document.getElementById('option2').value.trim(),
            option3: document.getElementById('option3').value.trim(),
            option4: document.getElementById('option4').value.trim(),
            correctOption: document.getElementById('correct-option').value
        };

        if (!payload.subject || !payload.question || !payload.option1 ||
            !payload.option2 || !payload.option3 || !payload.option4 || !payload.correctOption) {
            showMessage('Please fill in all fields.', false);
            return;
        }

        try {
            const res = await fetch('/api/questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) {
                showMessage(data.error || 'Failed to add question', false);
                return;
            }

            showMessage('Question added successfully!', true);
            form.reset();
            loadCounts();
        } catch (err) {
            console.error(err);
            showMessage('Network error - could not reach server', false);
        }
    });

    function showMessage(text, success) {
        formMessage.textContent = text;
        formMessage.style.color = success ? 'green' : 'crimson';
    }
});

async function loadCounts() {
    try {
        const res = await fetch('/api/questions/counts');
        if (!res.ok) return;
        const counts = await res.json();

        document.querySelectorAll('.subj[data-subject]').forEach(el => {
            const subject = el.dataset.subject;
            const countEl = el.querySelector('.count');
            if (countEl && counts[subject] !== undefined) {
                countEl.textContent = counts[subject];
            }
        });
    } catch (err) {
        console.error('Could not load counts:', err);
    }
}