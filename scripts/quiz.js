// Quiz data for different courses (load safely from localStorage)
let quizData = {};
const storedQuizData = localStorage.getItem('adminQuizzes');
if (storedQuizData) {
    try {
        const parsed = JSON.parse(storedQuizData);
        if (parsed && typeof parsed === 'object') {
            quizData = parsed;
        } else {
            throw new Error('invalid quiz data');
        }
    } catch (error) {
        if (typeof defaultQuizData !== 'undefined') {
            quizData = JSON.parse(JSON.stringify(defaultQuizData));
            try { localStorage.setItem('adminQuizzes', JSON.stringify(quizData)); } catch (e) {}
        } else {
            quizData = {};
        }
    }
} else {
    if (typeof defaultQuizData !== 'undefined') {
        quizData = JSON.parse(JSON.stringify(defaultQuizData));
        try { localStorage.setItem('adminQuizzes', JSON.stringify(quizData)); } catch (e) {}
    } else {
        quizData = {};
    }
}

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

if (nextButton) nextButton.addEventListener('click', nextQuestion);
if (prevButton) prevButton.addEventListener('click', previousQuestion);
if (submitButton) submitButton.addEventListener('click', submitQuiz);
if (retryButton) retryButton.addEventListener('click', () => {
    if (resultsContainer) resultsContainer.style.display = 'none';
    if (courseSelection) courseSelection.style.display = 'block';
});
if (backButton) backButton.addEventListener('click', () => {
    if (resultsContainer) resultsContainer.style.display = 'none';
    if (courseSelection) courseSelection.style.display = 'block';
});

// Start quiz function
function startQuiz(course) {
    currentQuiz = quizData[course];
    currentQuestionIndex = 0;
    score = 0;
    timeLeft = 60;
    selectedOption = null;

    if (courseSelection) courseSelection.style.display = 'none';
    if (quizContainer) quizContainer.style.display = 'block';
    if (resultsContainer) resultsContainer.style.display = 'none';

    const quizTitleEl = document.getElementById('quizTitle');
    if (quizTitleEl && currentQuiz && currentQuiz.title) quizTitleEl.textContent = currentQuiz.title;
    updateTimer();
    updateScore();
    showQuestion();
    startTimer();
}

// Show current question
function showQuestion() {
    if (!currentQuiz || !Array.isArray(currentQuiz.questions)) {
        return;
    }
    const question = currentQuiz.questions[currentQuestionIndex];
    if (questionText) questionText.textContent = question.question || '';

    if (optionsContainer) {
        optionsContainer.innerHTML = '';
        (question.options || []).forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.textContent = option;
            optionElement.dataset.index = index;
            optionElement.addEventListener('click', () => selectOption(index));
            optionsContainer.appendChild(optionElement);
        });
    }

    // Update navigation buttons
    if (prevButton) prevButton.disabled = currentQuestionIndex === 0;
    if (nextButton) nextButton.disabled = currentQuestionIndex === currentQuiz.questions.length - 1;
    if (submitButton) submitButton.style.display = currentQuestionIndex === currentQuiz.questions.length - 1 ? 'block' : 'none';
}

// Select option
function selectOption(index) {
    selectedOption = index;
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected');
    });
    const el = document.querySelector(`.option[data-index="${index}"]`);
    if (el) el.classList.add('selected');

    // Update score if correct
    if (currentQuiz && currentQuiz.questions && currentQuiz.questions[currentQuestionIndex]) {
        if (index === currentQuiz.questions[currentQuestionIndex].correct) {
            score++;
            updateScore();
        }
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