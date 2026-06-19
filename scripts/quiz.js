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
let currentCourseKey = null;
let currentQuestionIndex = 0;
let userAnswers = []; // Array to store user's selected options: [null, 1, 0, ...]
let timer = null;
let timeLeft = 60; // 60 seconds per quiz

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
    currentCourseKey = course;
    currentQuestionIndex = 0;
    timeLeft = 60;
    
    // Initialize user answers array with nulls
    userAnswers = new Array(currentQuiz.questions.length).fill(null);

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

    // Update progress bar
    const progressFill = document.querySelector('.progress-bar .progress');
    if (progressFill) {
        const percent = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;
        progressFill.style.width = `${percent}%`;
    }

    if (optionsContainer) {
        optionsContainer.innerHTML = '';
        (question.options || []).forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            
            // Check if this option was previously selected
            if (userAnswers[currentQuestionIndex] === index) {
                optionElement.classList.add('selected');
            }
            
            optionElement.textContent = option;
            optionElement.dataset.index = index;
            optionElement.addEventListener('click', () => selectOption(index));
            optionsContainer.appendChild(optionElement);
        });
    }

    // Update navigation buttons
    if (prevButton) prevButton.disabled = currentQuestionIndex === 0;
    
    const isLastQuestion = currentQuestionIndex === currentQuiz.questions.length - 1;
    if (nextButton) {
        nextButton.style.display = isLastQuestion ? 'none' : 'block';
    }
    if (submitButton) {
        submitButton.style.display = isLastQuestion ? 'block' : 'none';
    }
}

// Select option
function selectOption(index) {
    userAnswers[currentQuestionIndex] = index;
    
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected');
    });
    const el = document.querySelector(`.option[data-index="${index}"]`);
    if (el) el.classList.add('selected');

    // Update the running score
    updateScore();
}

// Next question
function nextQuestion() {
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
        currentQuestionIndex++;
        showQuestion();
    }
}

// Previous question
function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion();
    }
}

// Calculate score based on current userAnswers
function calculateScore() {
    let runScore = 0;
    if (!currentQuiz || !currentQuiz.questions) return 0;
    currentQuiz.questions.forEach((q, idx) => {
        if (userAnswers[idx] !== null && userAnswers[idx] === q.correct) {
            runScore++;
        }
    });
    return runScore;
}

// Submit quiz
function submitQuiz() {
    clearInterval(timer);
    if (quizContainer) quizContainer.style.display = 'none';
    if (resultsContainer) resultsContainer.style.display = 'block';

    const totalQuestions = currentQuiz.questions.length;
    const correctCount = calculateScore();
    const incorrectCount = totalQuestions - correctCount;

    if (finalScore) finalScore.textContent = `${correctCount}/${totalQuestions}`;
    if (timeTaken) timeTaken.textContent = `${60 - timeLeft} seconds`;
    if (correctAnswers) correctAnswers.textContent = correctCount;
    if (incorrectAnswers) incorrectAnswers.textContent = incorrectCount;

    // Save results to user profile
    const authInstance = new Auth();
    const currentUser = authInstance.getCurrentUser();
    if (currentUser) {
        // Construct detailed answer analysis
        const answerDetails = [];
        currentQuiz.questions.forEach((q, idx) => {
            const selected = userAnswers[idx];
            const isCorrect = (selected !== null && selected === q.correct);
            answerDetails.push({
                question: q.question,
                topic: q.topic || 'General',
                selected: selected !== null ? q.options[selected] : 'No Answer',
                correctAnswer: q.options[q.correct],
                isCorrect: isCorrect
            });
        });

        if (!currentUser.quizHistory) {
            currentUser.quizHistory = [];
        }
        currentUser.quizHistory.push({
            course: currentCourseKey,
            courseTitle: currentQuiz.title,
            score: correctCount,
            total: totalQuestions,
            timeTaken: 60 - timeLeft,
            date: new Date().toISOString(),
            answers: answerDetails
        });

        // Update user courses progress (if higher or new)
        if (!currentUser.courses) {
            currentUser.courses = [];
        }
        const progressPercentage = Math.round((correctCount / totalQuestions) * 100);
        const courseIdx = currentUser.courses.findIndex(c => c.id === currentCourseKey);
        if (courseIdx > -1) {
            currentUser.courses[courseIdx].progress = Math.max(currentUser.courses[courseIdx].progress || 0, progressPercentage);
        } else {
            currentUser.courses.push({
                id: currentCourseKey,
                name: currentQuiz.title,
                progress: progressPercentage
            });
        }

        // Save changes to localStorage
        authInstance.updateUser(currentUser);
    }
}

// Update timer
function updateTimer() {
    if (!timerDisplay) return;
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

// Update score display
function updateScore() {
    if (!scoreDisplay) return;
    scoreDisplay.textContent = `Score: ${calculateScore()}`;
}