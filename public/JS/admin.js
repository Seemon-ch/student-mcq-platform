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

        try {
            const res = await fetch('/api/questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (!res.ok) {
                formMessage.textContent = data.error || 'Failed to add question';
                formMessage.style.color = 'crimson';
                return;
            }

            formMessage.textContent = 'Question added successfully!';
            formMessage.style.color = 'green';
            form.reset();
            loadCounts();
        } catch (err) {
            formMessage.textContent = 'Network error - could not reach server';
            formMessage.style.color = 'crimson';
        }
    });
});

async function loadCounts() {
    const res = await fetch('/api/questions/counts');
    const counts = await res.json();
    document.querySelectorAll('.subj[data-subject]').forEach(el => {
        const subject = el.dataset.subject;
        el.querySelector('.count').textContent = counts[subject] ?? 0;
    });
}