// Global variables
let currentQuiz = null;
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let correctAnswers = 0;
let timer = null;
let timeLeft = 20;
let studentName = '';

// Quiz data storage (in a real app, this would be a database)
let quizzes = {};

// Generate random PIN
function generatePIN() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Show different interfaces
function showHome() {
    document.querySelectorAll('.interface').forEach(el => el.classList.add('hidden'));
    document.querySelector('.container').style.display = 'block';
}

function showTeacherMode() {
    document.querySelector('.container').style.display = 'none';
    document.getElementById('teacher-interface').classList.remove('hidden');
    resetTeacherForm();
}

function showStudentMode() {
    document.querySelector('.container').style.display = 'none';
    document.getElementById('student-interface').classList.remove('hidden');
    resetStudentForm();
}

// Teacher functions
function resetTeacherForm() {
    questions = [];
    document.getElementById('quiz-title').value = '';
    document.getElementById('question-text').value = '';
    document.querySelectorAll('.option-input').forEach(input => input.value = '');
    document.querySelectorAll('input[name="correct-answer"]').forEach(radio => radio.checked = false);
    document.getElementById('question-count').textContent = '0';
    document.getElementById('questions-preview').innerHTML = '';
    document.getElementById('quiz-created').classList.add('hidden');
    document.querySelector('.create-quiz-btn').disabled = true;
}

function addQuestion() {
    const questionText = document.getElementById('question-text').value.trim();
    const options = [
        document.getElementById('option1').value.trim(),
        document.getElementById('option2').value.trim(),
        document.getElementById('option3').value.trim(),
        document.getElementById('option4').value.trim()
    ];
    
    const correctAnswer = document.querySelector('input[name="correct-answer"]:checked');
    
    if (!questionText) {
        alert('Please enter a question!');
        return;
    }
    
    if (options.some(option => !option)) {
        alert('Please fill in all 4 options!');
        return;
    }
    
    if (!correctAnswer) {
        alert('Please select the correct answer!');
        return;
    }
    
    const question = {
        text: questionText,
        options: options,
        correctAnswer: parseInt(correctAnswer.value)
    };
    
    questions.push(question);
    updateQuestionsPreview();
    clearQuestionForm();
    
    // Enable create quiz button if we have questions
    document.querySelector('.create-quiz-btn').disabled = questions.length === 0;
}

function clearQuestionForm() {
    document.getElementById('question-text').value = '';
    document.querySelectorAll('.option-input').forEach(input => input.value = '');
    document.querySelectorAll('input[name="correct-answer"]').forEach(radio => radio.checked = false);
}

function updateQuestionsPreview() {
    const count = document.getElementById('question-count');
    const preview = document.getElementById('questions-preview');
    
    count.textContent = questions.length;
    
    preview.innerHTML = questions.map((q, index) => `
        <div class="question-preview">
            <strong>Q${index + 1}:</strong> ${q.text}
            <br><small>Correct: ${q.options[q.correctAnswer]}</small>
        </div>
    `).join('');
}

function createQuiz() {
    const title = document.getElementById('quiz-title').value.trim();
    const timePerQuestion = parseInt(document.getElementById('question-time').value);
    
    if (!title) {
        alert('Please enter a quiz title!');
        return;
    }
    
    if (questions.length === 0) {
        alert('Please add at least one question!');
        return;
    }
    
    const pin = generatePIN();
    const quiz = {
        title: title,
        questions: questions,
        timePerQuestion: timePerQuestion,
        pin: pin,
        active: false,
        students: []
    };
    
    quizzes[pin] = quiz;
    currentQuiz = quiz;
    
    document.getElementById('generated-pin').textContent = pin;
    document.getElementById('quiz-created').classList.remove('hidden');
}

function startQuizForTeacher() {
    if (currentQuiz) {
        currentQuiz.active = true;
        alert('Quiz started! Students can now play.');
    }
}

// Student functions
function resetStudentForm() {
    document.getElementById('pin-entry').classList.remove('hidden');
    document.getElementById('waiting-room').classList.add('hidden');
    document.getElementById('quiz-play').classList.add('hidden');
    document.getElementById('quiz-results').classList.add('hidden');
    document.getElementById('quiz-pin').value = '';
    document.getElementById('student-name').value = '';
    currentQuestionIndex = 0;
    score = 0;
    correctAnswers = 0;
}

function joinQuiz() {
    const pin = document.getElementById('quiz-pin').value.trim();
    const name = document.getElementById('student-name').value.trim();
    
    if (!pin) {
        alert('Please enter a quiz PIN!');
        return;
    }
    
    if (!name) {
        alert('Please enter your name!');
        return;
    }
    
    const quiz = quizzes[pin];
    if (!quiz) {
        alert('Invalid PIN! Please check and try again.');
        return;
    }
    
    studentName = name;
    currentQuiz = quiz;
    
    // Add student to quiz
    if (!quiz.students.includes(name)) {
        quiz.students.push(name);
    }
    
    document.getElementById('pin-entry').classList.add('hidden');
    
    if (quiz.active) {
        startQuizForStudent();
    } else {
        document.getElementById('waiting-room').classList.remove('hidden');
        // In a real app, this would use WebSockets to wait for teacher to start
        setTimeout(() => {
            if (currentQuiz && !currentQuiz.active) {
                currentQuiz.active = true; // Auto-start for demo
                startQuizForStudent();
            }
        }, 3000);
    }
}

function startQuizForStudent() {
    document.getElementById('waiting-room').classList.add('hidden');
    document.getElementById('quiz-play').classList.remove('hidden');
    
    currentQuestionIndex = 0;
    score = 0;
    correctAnswers = 0;
    
    showQuestion();
}

function showQuestion() {
    if (currentQuestionIndex >= currentQuiz.questions.length) {
        showResults();
        return;
    }
    
    const question = currentQuiz.questions[currentQuestionIndex];
    
    document.getElementById('current-question').textContent = currentQuestionIndex + 1;
    document.getElementById('total-questions').textContent = currentQuiz.questions.length;
    document.getElementById('current-score').textContent = score;
    document.getElementById('question-text-display').textContent = question.text;
    
    const answersGrid = document.getElementById('answers-grid');
    answersGrid.innerHTML = question.options.map((option, index) => `
        <div class="answer-option option-${String.fromCharCode(97 + index)}" onclick="selectAnswer(${index})">
            <strong>${String.fromCharCode(65 + index)}</strong><br>
            ${option}
        </div>
    `).join('');
    
    startTimer();
}

function startTimer() {
    timeLeft = currentQuiz.timePerQuestion;
    document.getElementById('time-left').textContent = timeLeft;
    
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('time-left').textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            selectAnswer(-1); // Time's up, no answer selected
        }
    }, 1000);
}

function selectAnswer(selectedIndex) {
    clearInterval(timer);
    
    const question = currentQuiz.questions[currentQuestionIndex];
    const options = document.querySelectorAll('.answer-option');
    
    // Disable further clicks
    options.forEach(option => {
        option.style.pointerEvents = 'none';
    });
    
    // Show correct answer
    options.forEach((option, index) => {
        if (index === question.correctAnswer) {
            option.classList.add('correct');
        } else if (index === selectedIndex && index !== question.correctAnswer) {
            option.classList.add('incorrect');
        }
        
        if (index === selectedIndex) {
            option.classList.add('selected');
        }
    });
    
    // Calculate score
    if (selectedIndex === question.correctAnswer) {
        correctAnswers++;
        const timeBonus = Math.max(0, timeLeft * 10);
        score += 100 + timeBonus;
    }
    
    // Move to next question after delay
    setTimeout(() => {
        currentQuestionIndex++;
        showQuestion();
    }, 2000);
}

function showResults() {
    document.getElementById('quiz-play').classList.add('hidden');
    document.getElementById('quiz-results').classList.remove('hidden');
    
    const totalQuestions = currentQuiz.questions.length;
    const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
    
    document.getElementById('final-score').textContent = score;
    document.getElementById('correct-count').textContent = correctAnswers;
    document.getElementById('total-count').textContent = totalQuestions;
    document.getElementById('accuracy').textContent = accuracy + '%';
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Add some sample data for testing
    const sampleQuiz = {
        title: "Sample Quiz",
        questions: [
            {
                text: "What is the capital of France?",
                options: ["London", "Berlin", "Paris", "Madrid"],
                correctAnswer: 2
            },
            {
                text: "Which planet is known as the Red Planet?",
                options: ["Venus", "Mars", "Jupiter", "Saturn"],
                correctAnswer: 1
            }
        ],
        timePerQuestion: 20,
        pin: "123456",
        active: true,
        students: []
    };
    
    quizzes["123456"] = sampleQuiz;
});