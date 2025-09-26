// Quiz data for different courses
const quizData = {
    'webdev': {
        title: 'Web Development Quiz',
        questions: [
            {
                question: 'What does HTML stand for?',
                options: [
                    'Hyper Text Markup Language',
                    'High Tech Modern Language',
                    'Hyper Transfer Markup Language',
                    'Home Tool Markup Language'
                ],
                correct: 0
            },
            {
                question: 'Which of these is not a JavaScript framework?',
                options: [
                    'React',
                    'Angular',
                    'Vue',
                    'Django'
                ],
                correct: 3
            },
            {
                question: 'What is the purpose of CSS?',
                options: [
                    'To create dynamic web pages',
                    'To style and layout web pages',
                    'To handle server-side operations',
                    'To manage databases'
                ],
                correct: 1
            }
        ]
    },
    'ai': {
        title: 'AI & ML Quiz',
        questions: [
            {
                question: 'What is Machine Learning?',
                options: [
                    'A type of computer hardware',
                    'A programming language',
                    'A subset of AI that enables systems to learn from data',
                    'A database management system'
                ],
                correct: 2
            },
            {
                question: 'Which of these is not a type of machine learning?',
                options: [
                    'Supervised Learning',
                    'Unsupervised Learning',
                    'Reinforcement Learning',
                    'Static Learning'
                ],
                correct: 3
            },
            {
                question: 'What is the purpose of neural networks?',
                options: [
                    'To store data',
                    'To process and analyze complex patterns',
                    'To create web pages',
                    'To manage databases'
                ],
                correct: 1
            }
        ]
    },
    'career': {
        title: 'Career Development Quiz',
        questions: [
            {
                question: 'What is the first step in career planning?',
                options: [
                    'Applying for jobs',
                    'Self-assessment',
                    'Writing a resume',
                    'Networking'
                ],
                correct: 1
            },
            {
                question: 'Which of these is not a soft skill?',
                options: [
                    'Communication',
                    'Teamwork',
                    'Programming',
                    'Problem-solving'
                ],
                correct: 2
            },
            {
                question: 'What is the purpose of a cover letter?',
                options: [
                    'To list all your skills',
                    'To introduce yourself and explain why you\'re a good fit',
                    'To provide references',
                    'To request a salary'
                ],
                correct: 1
            }
        ]
    }
};

// Quiz state variables
let currentQuiz = null;
let currentQuestionIndex = 0;
let score = 0;
let timer = null;
let timeLeft = 60; // 60 seconds per quiz
let selectedOption = null;

// DOM elements
const courseSelection = document.getElementById('courseSelection');
const quizContainer = document.getElementById('quizContainer');
const resultsContainer = document.getElementById('resultsContainer');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');
const questionText = document.getElementById('questionText');
const optionsContainer = document.getElementById('options');
const nextButton = document.getElementById('nextBtn');
const prevButton = document.getElementById('prevBtn');
const submitButton = document.getElementById('submitBtn');
const retryButton = document.getElementById('retryBtn');
const backButton = document.getElementById('backToCoursesBtn');
const finalScore = document.getElementById('finalScore');
const timeTaken = document.getElementById('timeTaken');
const correctAnswers = document.getElementById('correctAnswers');
const incorrectAnswers = document.getElementById('incorrectAnswers');

// Event listeners for quiz buttons
document.querySelectorAll('.start-quiz').forEach(button => {
    button.addEventListener('click', () => {
        const course = button.dataset.course;
        startQuiz(course);
    });
});

nextButton.addEventListener('click', nextQuestion);
prevButton.addEventListener('click', previousQuestion);
submitButton.addEventListener('click', submitQuiz);
retryButton.addEventListener('click', () => {
    resultsContainer.style.display = 'none';
    courseSelection.style.display = 'block';
});
backButton.addEventListener('click', () => {
    resultsContainer.style.display = 'none';
    courseSelection.style.display = 'block';
});

// Start quiz function
function startQuiz(course) {
    currentQuiz = quizData[course];
    currentQuestionIndex = 0;
    score = 0;
    timeLeft = 60;
    selectedOption = null;

    courseSelection.style.display = 'none';
    quizContainer.style.display = 'block';
    resultsContainer.style.display = 'none';

    document.getElementById('quizTitle').textContent = currentQuiz.title;
    updateTimer();
    updateScore();
    showQuestion();
    startTimer();
}

// Show current question
function showQuestion() {
    const question = currentQuiz.questions[currentQuestionIndex];
    questionText.textContent = question.question;

    optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.textContent = option;
        optionElement.dataset.index = index;
        optionElement.addEventListener('click', () => selectOption(index));
        optionsContainer.appendChild(optionElement);
    });

    // Update navigation buttons
    prevButton.disabled = currentQuestionIndex === 0;
    nextButton.disabled = currentQuestionIndex === currentQuiz.questions.length - 1;
    submitButton.style.display = currentQuestionIndex === currentQuiz.questions.length - 1 ? 'block' : 'none';
}

// Select option
function selectOption(index) {
    selectedOption = index;
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected');
    });
    document.querySelector(`.option[data-index="${index}"]`).classList.add('selected');
    
    // Update score if correct
    if (index === currentQuiz.questions[currentQuestionIndex].correct) {
        score++;
        updateScore();
    }
}

// Next question
function nextQuestion() {
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
        currentQuestionIndex++;
        selectedOption = null;
        showQuestion();
    }
}

// Previous question
function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        selectedOption = null;
        showQuestion();
    }
}

// Submit quiz
function submitQuiz() {
    clearInterval(timer);
    quizContainer.style.display = 'none';
    resultsContainer.style.display = 'block';

    const totalQuestions = currentQuiz.questions.length;
    const correctCount = score;
    const incorrectCount = totalQuestions - correctCount;

    finalScore.textContent = `${score}/${totalQuestions}`;
    timeTaken.textContent = `${60 - timeLeft} seconds`;
    correctAnswers.textContent = correctCount;
    incorrectAnswers.textContent = incorrectCount;
}

// Update timer
function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Start timer
function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) {
            clearInterval(timer);
            submitQuiz();
        }
    }, 1000);
}

// Update score
function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
} 