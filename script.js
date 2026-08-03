
        // Data Storage
        let questions = {
            'Science': [],
            'Mathematics': [],
            'English': [],
            'General Knowledge': []
        };

        // Quiz State
        let currentQuiz = {
            subject: '',
            questions: [],
            currentIndex: 0,
            score: 0,
            answered: false
        };

        // Initialize
        window.onload = function() {
            loadQuestionsFromStorage();
            addSampleQuestions();
            updateQuestionCounts();
            updateStats();
        };

        // Load questions from localStorage
        function loadQuestionsFromStorage() {
            const stored = localStorage.getItem('mcqQuestions');
            if (stored) {
                questions = JSON.parse(stored);
            }
        }

        // Save questions to localStorage
        function saveQuestionsToStorage() {
            localStorage.setItem('mcqQuestions', JSON.stringify(questions));
        }

        // Add sample questions
        function addSampleQuestions() {
            if (questions['Science'].length === 0) {
                questions['Science'] = [
                    {
                        question: "What is the chemical symbol for water?",
                        options: ["H2O", "CO2", "O2", "N2"],
                        correct: "A"
                    },
                    {
                        question: "What is the powerhouse of the cell?",
                        options: ["Nucleus", "Mitochondria", "Ribosome", "Chloroplast"],
                        correct: "B"
                    },
                    {
                        question: "What planet is known as the Red Planet?",
                        options: ["Venus", "Jupiter", "Mars", "Saturn"],
                        correct: "C"
                    },
                    {
                        question: "What is the speed of light?",
                        options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"],
                        correct: "A"
                    },
                    {
                        question: "Which gas do plants absorb from the atmosphere?",
                        options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
                        correct: "B"
                    }
                ];

                questions['Mathematics'] = [
                    {
                        question: "What is 25 × 4?",
                        options: ["100", "75", "125", "150"],
                        correct: "A"
                    },
                    {
                        question: "What is the value of π (pi) approximately?",
                        options: ["2.14", "3.14", "4.14", "5.14"],
                        correct: "B"
                    },
                    {
                        question: "What is the square root of 144?",
                        options: ["10", "11", "12", "13"],
                        correct: "C"
                    },
                    {
                        question: "What is 15% of 200?",
                        options: ["25", "30", "35", "40"],
                        correct: "B"
                    },
                    {
                        question: "What is the sum of angles in a triangle?",
                        options: ["90°", "180°", "270°", "360°"],
                        correct: "B"
                    }
                ];

                questions['English'] = [
                    {
                        question: "What is the plural of 'child'?",
                        options: ["Childs", "Children", "Childes", "Childish"],
                        correct: "B"
                    },
                    {
                        question: "Which word is a synonym for 'happy'?",
                        options: ["Sad", "Joyful", "Angry", "Tired"],
                        correct: "B"
                    },
                    {
                        question: "What type of word is 'quickly'?",
                        options: ["Noun", "Verb", "Adjective", "Adverb"],
                        correct: "D"
                    },
                    {
                        question: "Who wrote 'Romeo and Juliet'?",
                        options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
                        correct: "B"
                    },
                    {
                        question: "What is the past tense of 'run'?",
                        options: ["Runned", "Running", "Ran", "Runs"],
                        correct: "C"
                    }
                ];

                questions['General Knowledge'] = [
                    {
                        question: "What is the capital of France?",
                        options: ["London", "Berlin", "Paris", "Madrid"],
                        correct: "C"
                    },
                    {
                        question: "How many continents are there?",
                        options: ["5", "6", "7", "8"],
                        correct: "C"
                    },
                    {
                        question: "Who painted the Mona Lisa?",
                        options: ["Van Gogh", "Picasso", "Leonardo da Vinci", "Michelangelo"],
                        correct: "C"
                    },
                    {
                        question: "What is the largest ocean on Earth?",
                        options: ["Atlantic", "Indian", "Arctic", "Pacific"],
                        correct: "D"
                    },
                    {
                        question: "In which year did World War II end?",
                        options: ["1943", "1944", "1945", "1946"],
                        correct: "C"
                    }
                ];

                saveQuestionsToStorage();
            }
        }

        // Section Navigation
        function showSection(sectionId) {
            const sections = ['home', 'practice', 'admin', 'about'];
            sections.forEach(id => {
                const section = document.getElementById(id);
                if (id === sectionId) {
                    section.classList.remove('hidden-section');
                    section.classList.add('fade-in');
                } else {
                    section.classList.add('hidden-section');
                }
            });

            // Reset practice section
            if (sectionId === 'practice') {
                document.getElementById('subjectSelection').classList.remove('hidden');
                document.getElementById('quizInterface').classList.add('hidden');
                document.getElementById('resultsSection').classList.add('hidden');
                updateQuestionCounts();
            }

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Update question counts
        function updateQuestionCounts() {
            document.getElementById('science-count').textContent = 
                questions['Science'].length + ' questions available';
            document.getElementById('mathematics-count').textContent = 
                questions['Mathematics'].length + ' questions available';
            document.getElementById('english-count').textContent = 
                questions['English'].length + ' questions available';
            document.getElementById('general-knowledge-count').textContent = 
                questions['General Knowledge'].length + ' questions available';
            
            const totalQuestions = Object.values(questions).reduce((sum, arr) => sum + arr.length, 0);
            document.getElementById('mixed-count').textContent = 
                totalQuestions + ' questions from all subjects';
        }

        // Start Quiz
        function startQuiz(subject) {
            currentQuiz.subject = subject;
            currentQuiz.currentIndex = 0;
            currentQuiz.score = 0;
            currentQuiz.answered = false;

            if (subject === 'Mixed') {
                currentQuiz.questions = [];
                Object.values(questions).forEach(subjectQuestions => {
                    currentQuiz.questions = currentQuiz.questions.concat(subjectQuestions);
                });
                shuffleArray(currentQuiz.questions);
            } else {
                currentQuiz.questions = [...questions[subject]];
                shuffleArray(currentQuiz.questions);
            }

            if (currentQuiz.questions.length === 0) {
                showNotification('No questions available for this subject!', 'error');
                return;
            }

            document.getElementById('subjectSelection').classList.add('hidden');
            document.getElementById('quizInterface').classList.remove('hidden');
            document.getElementById('subjectBadge').textContent = subject;
            document.getElementById('totalQuestions').textContent = currentQuiz.questions.length;
            
            displayQuestion();
        }

        // Shuffle array
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        // Display Question
        function displayQuestion() {
            const question = currentQuiz.questions[currentQuiz.currentIndex];
            document.getElementById('questionText').textContent = question.question;
            document.getElementById('currentQuestion').textContent = currentQuiz.currentIndex + 1;
            document.getElementById('currentScore').textContent = currentQuiz.score;

            const progress = ((currentQuiz.currentIndex + 1) / currentQuiz.questions.length) * 100;
            document.getElementById('progressBar').style.width = progress + '%';

            const optionsContainer = document.getElementById('optionsContainer');
            optionsContainer.innerHTML = '';

            const optionLabels = ['A', 'B', 'C', 'D'];
            question.options.forEach((option, index) => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'quiz-option p-4 border-2 border-gray-300 rounded-lg';
                optionDiv.innerHTML = `
                    <span class="font-semibold">${optionLabels[index]}.</span> ${option}
                `;
                optionDiv.onclick = () => selectAnswer(optionLabels[index], optionDiv);
                optionsContainer.appendChild(optionDiv);
            });

            currentQuiz.answered = false;
            document.getElementById('nextButton').classList.add('hidden');
        }

        // Select Answer
        function selectAnswer(selected, element) {
            if (currentQuiz.answered) return;

            currentQuiz.answered = true;
            const question = currentQuiz.questions[currentQuiz.currentIndex];
            const options = document.querySelectorAll('.quiz-option');

            options.forEach(option => {
                option.style.pointerEvents = 'none';
            });

            if (selected === question.correct) {
                element.classList.add('correct');
                currentQuiz.score++;
                showNotification('Correct! 🎉', 'success');
            } else {
                element.classList.add('incorrect');
                options[question.correct.charCodeAt(0) - 65].classList.add('correct');
                showNotification('Incorrect! The correct answer is highlighted.', 'error');
            }

            document.getElementById('currentScore').textContent = currentQuiz.score;
            document.getElementById('nextButton').classList.remove('hidden');
        }

        // Next Question
        function nextQuestion() {
            currentQuiz.currentIndex++;
            if (currentQuiz.currentIndex < currentQuiz.questions.length) {
                displayQuestion();
            } else {
                showResults();
            }
        }

        // Show Results
        function showResults() {
            document.getElementById('quizInterface').classList.add('hidden');
            document.getElementById('resultsSection').classList.remove('hidden');

            const totalQuestions = currentQuiz.questions.length;
            const percentage = Math.round((currentQuiz.score / totalQuestions) * 100);

            document.getElementById('finalScore').textContent = 
                `${currentQuiz.score}/${totalQuestions}`;
            document.getElementById('scorePercentage').textContent = `${percentage}%`;
            document.getElementById('resultProgressBar').style.width = percentage + '%';

            let message = '';
            if (percentage >= 90) {
                message = '🏆 Outstanding! You\'re a master!';
            } else if (percentage >= 75) {
                message = '🌟 Excellent work! Keep it up!';
            } else if (percentage >= 60) {
                message = '👍 Good job! You\'re doing well!';
            } else if (percentage >= 40) {
                message = '📚 Not bad! Keep practicing!';
            } else {
                message = '💪 Don\'t give up! Practice makes perfect!';
            }
            document.getElementById('resultMessage').textContent = message;
        }

        // Retry Quiz
        function retryQuiz() {
            startQuiz(currentQuiz.subject);
        }

        // Quit Quiz
        function quitQuiz() {
            if (confirm('Are you sure you want to quit the quiz?')) {
                document.getElementById('quizInterface').classList.add('hidden');
                document.getElementById('subjectSelection').classList.remove('hidden');
            }
        }

        // Admin Form Submit
        document.getElementById('adminForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const subject = document.getElementById('adminSubject').value;
            const question = document.getElementById('adminQuestion').value;
            const optionA = document.getElementById('optionA').value;
            const optionB = document.getElementById('optionB').value;
            const optionC = document.getElementById('optionC').value;
            const optionD = document.getElementById('optionD').value;
            const correct = document.getElementById('correctAnswer').value;

            const newQuestion = {
                question: question,
                options: [optionA, optionB, optionC, optionD],
                correct: correct
            };

            questions[subject].push(newQuestion);
            saveQuestionsToStorage();
            updateStats();
            updateQuestionCounts();

            showNotification('Question added successfully! 🎉', 'success');
            this.reset();
        });

        // Update Statistics
        function updateStats() {
            document.getElementById('stat-science').textContent = questions['Science'].length;
            document.getElementById('stat-mathematics').textContent = questions['Mathematics'].length;
            document.getElementById('stat-english').textContent = questions['English'].length;
            document.getElementById('stat-gk').textContent = questions['General Knowledge'].length;
        }

        // Show Notification
        function showNotification(message, type) {
            const container = document.getElementById('notificationContainer');
            const notification = document.createElement('div');
            
            const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
            notification.className = `notification ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg mb-4`;
            notification.textContent = message;
            
            container.appendChild(notification);

            setTimeout(() => {
                notification.style.animation = 'slideInRight 0.5s ease-out reverse';
                setTimeout(() => {
                    notification.remove();
                }, 500);
            }, 3000);
        }

        // Add entrance animation on scroll
        window.addEventListener('scroll', function() {
            const elements = document.querySelectorAll('.hover-lift');
            elements.forEach(element => {
                const position = element.getBoundingClientRect();
                if (position.top < window.innerHeight && position.bottom >= 0) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            });
        });

        // Initialize hover-lift elements
        document.addEventListener('DOMContentLoaded', function() {
            const elements = document.querySelectorAll('.hover-lift');
            elements.forEach(element => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                element.style.transition = 'all 0.6s ease-out';
            });
        });
