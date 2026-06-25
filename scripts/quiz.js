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
} else if (typeof defaultQuizData !== 'undefined') {
    quizData = JSON.parse(JSON.stringify(defaultQuizData));
    try { localStorage.setItem('adminQuizzes', JSON.stringify(quizData)); } catch (e) {}
}

const courseDetails = {
    webdev: {
        name: 'Web Development',
        url: 'webdev.html',
        fallbackTopic: 'Web development foundations'
    },
    ai: {
        name: 'AI & Machine Learning',
        url: 'ai.html',
        fallbackTopic: 'AI and machine learning foundations'
    },
    career: {
        name: 'Career Guidance',
        url: 'career.html',
        fallbackTopic: 'Career readiness'
    }
};

let currentQuiz = null;
let currentCourse = '';
let currentQuestionIndex = 0;
let score = 0;
let timer = null;
let timeLeft = 60;
let answers = [];
let latestReport = null;

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
const progressPercent = document.getElementById('progressPercent');
const resultProgress = document.getElementById('resultProgress');
const reportSummary = document.getElementById('reportSummary');
const improvementTopics = document.getElementById('improvementTopics');
const questionReport = document.getElementById('questionReport');
const saveCourseButton = document.getElementById('saveCourseBtn');
const recommendedCourseText = document.getElementById('recommendedCourseText');
const savedCoursesList = document.getElementById('savedCoursesList');
const scheduleForm = document.getElementById('scheduleForm');
const scheduledClasses = document.getElementById('scheduledClasses');

document.querySelectorAll('.start-quiz').forEach(button => {
    button.addEventListener('click', () => startQuiz(button.dataset.course));
});

if (nextButton) nextButton.addEventListener('click', nextQuestion);
if (prevButton) prevButton.addEventListener('click', previousQuestion);
if (submitButton) submitButton.addEventListener('click', submitQuiz);
if (retryButton) retryButton.addEventListener('click', resetToCourseSelection);
if (backButton) backButton.addEventListener('click', resetToCourseSelection);
if (saveCourseButton) saveCourseButton.addEventListener('click', saveRecommendedCourse);
if (scheduleForm) scheduleForm.addEventListener('submit', scheduleClass);

renderSavedCourses();
renderScheduledClasses();

function startQuiz(course) {
    currentQuiz = quizData[course];
    currentCourse = course;

    if (!currentQuiz || !Array.isArray(currentQuiz.questions) || currentQuiz.questions.length === 0) {
        alert('No quiz questions are available for this course yet.');
        return;
    }

    currentQuestionIndex = 0;
    score = 0;
    timeLeft = 60;
    answers = new Array(currentQuiz.questions.length).fill(null);
    latestReport = null;

    if (courseSelection) courseSelection.style.display = 'none';
    if (quizContainer) quizContainer.style.display = 'block';
    if (resultsContainer) resultsContainer.style.display = 'none';

    const quizTitleEl = document.getElementById('quizTitle');
    if (quizTitleEl) quizTitleEl.textContent = currentQuiz.title || courseDetails[course]?.name || 'Course Quiz';

    updateTimer();
    updateScore();
    showQuestion();
    startTimer();
}

function showQuestion() {
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

            if (answers[currentQuestionIndex] === index) {
                optionElement.classList.add('selected');
            }

            optionsContainer.appendChild(optionElement);
        });
    }

    const progress = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;
    const progressBar = quizContainer?.querySelector('.progress');
    if (progressBar) progressBar.style.width = `${progress}%`;

    if (prevButton) prevButton.disabled = currentQuestionIndex === 0;
    if (nextButton) nextButton.disabled = currentQuestionIndex === currentQuiz.questions.length - 1;
    if (submitButton) submitButton.style.display = currentQuestionIndex === currentQuiz.questions.length - 1 ? 'block' : 'none';
}

function selectOption(index) {
    answers[currentQuestionIndex] = index;
    document.querySelectorAll('.option').forEach(option => option.classList.remove('selected'));
    const selected = document.querySelector(`.option[data-index="${index}"]`);
    if (selected) selected.classList.add('selected');
    updateScore();
}

function nextQuestion() {
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
        currentQuestionIndex++;
        showQuestion();
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion();
    }
}

function submitQuiz() {
    clearInterval(timer);
    if (!currentQuiz || !Array.isArray(currentQuiz.questions)) return;

    const totalQuestions = currentQuiz.questions.length;
    score = calculateScore();
    const correctCount = score;
    const incorrectCount = totalQuestions - correctCount;
    const percent = Math.round((correctCount / totalQuestions) * 100);

    if (quizContainer) quizContainer.style.display = 'none';
    if (resultsContainer) resultsContainer.style.display = 'block';

    finalScore.textContent = `${score}/${totalQuestions}`;
    timeTaken.textContent = `${60 - timeLeft} seconds`;
    correctAnswers.textContent = correctCount;
    incorrectAnswers.textContent = incorrectCount;
    if (progressPercent) progressPercent.textContent = `${percent}%`;
    if (resultProgress) resultProgress.style.width = `${percent}%`;

    latestReport = buildReport(percent);
    renderReport(latestReport);
    renderSavedCourses();
    renderScheduledClasses();
}

function buildReport(percent) {
    const questions = currentQuiz.questions.map((question, index) => {
        const selectedIndex = answers[index];
        const correctIndex = Number(question.correct);
        const isCorrect = selectedIndex === correctIndex;
        const selectedAnswer = selectedIndex === null || selectedIndex === undefined
            ? 'Not answered'
            : question.options?.[selectedIndex] || 'Not answered';
        const correctAnswer = question.options?.[correctIndex] || 'Correct answer unavailable';
        const topic = question.topic || inferTopic(question);

        return {
            number: index + 1,
            question: question.question || '',
            selectedAnswer,
            correctAnswer,
            isCorrect,
            topic,
            feedback: getQuestionFeedback(question, isCorrect, selectedAnswer, correctAnswer, topic)
        };
    });

    const missedTopics = questions
        .filter(item => !item.isCorrect)
        .map(item => item.topic);
    const topicCounts = missedTopics.reduce((counts, topic) => {
        counts[topic] = (counts[topic] || 0) + 1;
        return counts;
    }, {});
    const improvement = Object.entries(topicCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([topic, count]) => ({ topic, count }));

    return {
        percent,
        questions,
        improvement,
        courseName: courseDetails[currentCourse]?.name || currentQuiz.title || 'Course',
        courseUrl: courseDetails[currentCourse]?.url || 'index.html'
    };
}

function renderReport(report) {
    if (reportSummary) {
        const missedCount = report.questions.length - score;
        reportSummary.textContent = missedCount === 0
            ? `Excellent work. You scored ${report.percent}% and are ready to keep moving in ${report.courseName}.`
            : `You scored ${report.percent}%. Focus on the topics below, then retake the quiz to check your improvement.`;
    }

    if (recommendedCourseText) {
        recommendedCourseText.textContent = `Recommended course: ${report.courseName}. Save it so it appears in your saved courses list.`;
    }

    if (improvementTopics) {
        if (report.improvement.length === 0) {
            improvementTopics.innerHTML = '<span class="topic-chip"><i class="fas fa-star"></i> No weak topics found</span>';
        } else {
            improvementTopics.innerHTML = report.improvement.map(item => `
                <span class="topic-chip"><i class="fas fa-lightbulb"></i> ${escapeHtml(item.topic)} (${item.count})</span>
            `).join('');
        }
    }

    if (questionReport) {
        questionReport.innerHTML = report.questions.map(item => `
            <article class="question-review ${item.isCorrect ? 'correct' : 'incorrect'}">
                <h4>Question ${item.number}: ${escapeHtml(item.question)}</h4>
                <p><strong>Your answer:</strong> ${escapeHtml(item.selectedAnswer)}</p>
                <p><strong>Correct answer:</strong> ${escapeHtml(item.correctAnswer)}</p>
                <p><strong>What ${item.isCorrect ? 'went right' : 'went wrong'}:</strong> ${escapeHtml(item.feedback)}</p>
                <p><strong>Topic:</strong> ${escapeHtml(item.topic)}</p>
            </article>
        `).join('');
    }
}

function getQuestionFeedback(question, isCorrect, selectedAnswer, correctAnswer, topic) {
    if (isCorrect) {
        return `You understood ${topic} and selected the correct answer.`;
    }

    if (selectedAnswer === 'Not answered') {
        return `This was skipped. Review ${topic}, then practice identifying why "${correctAnswer}" is correct.`;
    }

    return question.explanation || `You selected "${selectedAnswer}", but the correct answer is "${correctAnswer}". Review ${topic} and compare the key terms in the options.`;
}

function inferTopic(question) {
    const text = `${question.question || ''} ${(question.options || []).join(' ')}`.toLowerCase();
    if (text.includes('html')) return 'HTML basics';
    if (text.includes('css') || text.includes('style')) return 'CSS styling';
    if (text.includes('javascript') || text.includes('framework')) return 'JavaScript frameworks';
    if (text.includes('machine learning')) return 'Machine learning basics';
    if (text.includes('neural')) return 'Neural networks';
    if (text.includes('career') || text.includes('job')) return 'Career planning';
    if (text.includes('soft skill')) return 'Soft skills';
    return courseDetails[currentCourse]?.fallbackTopic || 'Course fundamentals';
}

function calculateScore() {
    return currentQuiz.questions.reduce((total, question, index) => {
        return total + (answers[index] === Number(question.correct) ? 1 : 0);
    }, 0);
}

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    if (timerDisplay) timerDisplay.textContent = `Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
}

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

function updateScore() {
    score = currentQuiz ? calculateScore() : 0;
    if (scoreDisplay) scoreDisplay.textContent = `Score: ${score}`;
}

function resetToCourseSelection() {
    clearInterval(timer);
    if (resultsContainer) resultsContainer.style.display = 'none';
    if (quizContainer) quizContainer.style.display = 'none';
    if (courseSelection) courseSelection.style.display = 'block';
}

function saveRecommendedCourse() {
    if (!latestReport) return;

    const savedCourses = getStoredList('savedCourses');
    const exists = savedCourses.some(course => course.key === currentCourse);
    if (!exists) {
        savedCourses.push({
            key: currentCourse,
            name: latestReport.courseName,
            url: latestReport.courseUrl,
            score: latestReport.percent,
            savedAt: new Date().toISOString()
        });
        localStorage.setItem('savedCourses', JSON.stringify(savedCourses));
    }

    renderSavedCourses();
    if (saveCourseButton) saveCourseButton.textContent = exists ? 'Already Saved' : 'Saved';
}

function renderSavedCourses() {
    if (!savedCoursesList) return;
    const savedCourses = getStoredList('savedCourses');

    if (savedCourses.length === 0) {
        savedCoursesList.innerHTML = '<p class="empty-state">No saved courses yet.</p>';
        return;
    }

    savedCoursesList.innerHTML = savedCourses.map(course => `
        <div class="saved-course-item">
            <div>
                <strong>${escapeHtml(course.name)}</strong>
                <span>Saved score: ${course.score || 0}%</span>
            </div>
            <a class="btn btn-outline btn-sm" href="${escapeHtml(course.url)}">Open</a>
        </div>
    `).join('');
}

function scheduleClass(event) {
    event.preventDefault();
    const dateInput = document.getElementById('classDate');
    const timeInput = document.getElementById('classTime');
    const topicInput = document.getElementById('classTopic');

    const scheduled = getStoredList('scheduledClasses');
    scheduled.push({
        date: dateInput.value,
        time: timeInput.value,
        topic: topicInput.value.trim(),
        course: latestReport?.courseName || courseDetails[currentCourse]?.name || 'EduBridge Class'
    });
    localStorage.setItem('scheduledClasses', JSON.stringify(scheduled));

    scheduleForm.reset();
    renderScheduledClasses();
}

function renderScheduledClasses() {
    if (!scheduledClasses) return;
    const scheduled = getStoredList('scheduledClasses');

    if (scheduled.length === 0) {
        scheduledClasses.innerHTML = '<p class="empty-state">No classes scheduled yet.</p>';
        return;
    }

    scheduledClasses.innerHTML = scheduled
        .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
        .map(item => `
            <div class="scheduled-class-item">
                <div>
                    <strong>${escapeHtml(item.topic)}</strong>
                    <span>${escapeHtml(item.course)} - ${escapeHtml(item.date)} at ${escapeHtml(item.time)}</span>
                </div>
                <i class="fas fa-calendar-check"></i>
            </div>
        `).join('');
}

function getStoredList(key) {
    try {
        const value = JSON.parse(localStorage.getItem(key) || '[]');
        return Array.isArray(value) ? value : [];
    } catch (error) {
        return [];
    }
}

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
