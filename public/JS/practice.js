document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card_item[data-subject]');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const subject = card.dataset.subject;
            window.location.href = `quiz.html?subject=${encodeURIComponent(subject)}`;
        });
    });

    loadCounts();
});

async function loadCounts() {
    try {
        const res = await fetch('/api/questions/counts');
        if (!res.ok) return;
        const counts = await res.json();

        document.querySelectorAll('.card_item[data-subject]').forEach(card => {
            const subject = card.dataset.subject;
            const countText = card.querySelector('.count-text');
            if (!countText) return;

            if (subject === 'mixed') {
                const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
                countText.textContent = `${total} questions from all subjects`;
            } else if (counts[subject] !== undefined) {
                countText.textContent = `${counts[subject]} question${counts[subject] === 1 ? '' : 's'} available`;
            }
        });
    } catch (err) {
        console.error('Could not load subject counts:', err);
    }
}