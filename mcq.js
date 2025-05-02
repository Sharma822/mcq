document.addEventListener('DOMContentLoaded', function() {
    // Quiz data
    const quizData = [
        {
            question: "What is the capital of France?",
            options: ["Berlin", "Madrid", "Paris", "Rome"],
            answer: 2
        },
        {
            question: "Which planet is known as the Red Planet?",
            options: ["Venus", "Mars", "Jupiter", "Saturn"],
            answer: 1
        },
        {
            question: "What is the largest mammal?",
            options: ["Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
            answer: 1
        },
        {
            question: "Which language runs in a web browser?",
            options: ["Java", "C", "Python", "JavaScript"],
            answer: 3
        },
        {
            question: "What year was JavaScript launched?",
            options: ["1996", "1995", "1994", "None of the above"],
            answer: 1
        },
        {
            question: "What does HTML stand for?",
            options: [
                "Hypertext Markup Language",
                "Hypertext Markdown Language",
                "Hyperloop Machine Language",
                "Helicopters Terminals Motorboats Lamborginis"
            ],
            answer: 0
        },
        {
            question: "Which of these is a JavaScript framework?",
            options: ["Django", "Flask", "React", "Laravel"],
            answer: 2
        },
        {
            question: "Which symbol is used for single line comments in JavaScript?",
            options: ["//", "#", "/*", "--"],
            answer: 0
        },
        {
            question: "How do you declare a JavaScript variable?",
            options: ["variable carName;", "v carName;", "let carName;", "var carName;"],
            answer: 2
        },
        {
            question: "What is the capital of France?",
            options: ["Berlin", "Madrid", "Paris", "Rome"],
            answer: 2
        },
        {
            question: "Which operator is used to assign a value to a variable?",
            options: ["*", "-", "=", "x"],
            answer: 2
        }
    ];

    // DOM elements
    const quizIntro = document.getElementById('quiz-intro');
    const quizContainer = document.getElementById('quiz-container');
    const quizResult = document.getElementById('quiz-result');
    const startBtn = document.getElementById('start-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    const retakeBtn = document.getElementById('retake-btn');
    const questionEl = document.getElementById('question');
    const optionsEl = document.getElementById('options');
    const currentQEl = document.getElementById('current-q');
    const totalQEl = document.getElementById('total-q');
    const progressBar = document.getElementById('progress-bar');
    const timerEl = document.getElementById('timer');
    const quizFooter = document.getElementById('quiz-footer');
    const scorePercentEl = document.getElementById('score-percent');
    const scoreTextEl = document.getElementById('score-text');
    const totalQuestionsEl = document.getElementById('total-questions');
    const answerReviewEl = document.getElementById('answer-review');

    // Quiz state
    let currentQuestion = 0;
    let score = 0;
    let userAnswers = new Array(quizData.length).fill(null);
    let timeLeft = 900; // 15 minutes in seconds
    let timerInterval;

    // Initialize quiz
    totalQEl.textContent = quizData.length;
    totalQuestionsEl.textContent = quizData.length;

    // Start quiz
    startBtn.addEventListener('click', startQuiz);
    retakeBtn.addEventListener('click', startQuiz);

    function startQuiz() {
        currentQuestion = 0;
        score = 0;
        userAnswers = new Array(quizData.length).fill(null);
        timeLeft = 900;
        
        quizIntro.classList.add('hidden');
        quizResult.classList.add('hidden');
        quizContainer.classList.remove('hidden');
        quizFooter.classList.remove('hidden');
        
        startTimer();
        loadQuestion();
    }

    // Timer function
    function startTimer() {
        clearInterval(timerInterval);
        updateTimerDisplay();
        
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                submitQuiz();
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Change color when time is running low
        if (timeLeft <= 60) {
            timerEl.style.backgroundColor = '#e74c3c';
        }
    }

    // Load question
    function loadQuestion() {
        const question = quizData[currentQuestion];
        questionEl.textContent = question.question;
        optionsEl.innerHTML = '';
        
        currentQEl.textContent = currentQuestion + 1;
        
        // Update progress bar
        const progress = ((currentQuestion + 1) / quizData.length) * 100;
        progressBar.style.width = `${progress}%`;
        
        // Create options
        question.options.forEach((option, index) => {
            const optionEl = document.createElement('div');
            optionEl.classList.add('option');
            if (userAnswers[currentQuestion] === index) {
                optionEl.classList.add('selected');
            }
            optionEl.textContent = option;
            optionEl.addEventListener('click', () => selectOption(index));
            optionsEl.appendChild(optionEl);
        });
        
        // Update navigation buttons
        prevBtn.disabled = currentQuestion === 0;
        
        if (currentQuestion === quizData.length - 1) {
            nextBtn.classList.add('hidden');
            submitBtn.classList.remove('hidden');
        } else {
            nextBtn.classList.remove('hidden');
            submitBtn.classList.add('hidden');
        }
    }

    // Select option
    function selectOption(index) {
        userAnswers[currentQuestion] = index;
        loadQuestion(); // Refresh to show selected option
    }

    // Navigation
    prevBtn.addEventListener('click', () => {
        if (currentQuestion > 0) {
            currentQuestion--;
            loadQuestion();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentQuestion < quizData.length - 1) {
            currentQuestion++;
            loadQuestion();
        }
    });

    // Submit quiz
    submitBtn.addEventListener('click', submitQuiz);

    function submitQuiz() {
        clearInterval(timerInterval);
        
        // Calculate score
        score = 0;
        quizData.forEach((question, index) => {
            if (userAnswers[index] === question.answer) {
                score++;
            }
        });
        
        // Display results
        const percentage = Math.round((score / quizData.length) * 100);
        scorePercentEl.textContent = percentage;
        scoreTextEl.textContent = score;
        
        // Generate answer review
        answerReviewEl.innerHTML = '';
        quizData.forEach((question, index) => {
            const isCorrect = userAnswers[index] === question.answer;
            const reviewItem = document.createElement('div');
            reviewItem.classList.add('review-item');
            reviewItem.classList.add(isCorrect ? 'correct' : 'incorrect');
            
            const userAnswer = userAnswers[index] !== null ? 
                question.options[userAnswers[index]] : "Not answered";
            const correctAnswer = question.options[question.answer];
            
            reviewItem.innerHTML = `
                <p><strong>Question ${index + 1}:</strong> ${question.question}</p>
                <p><strong>Your answer:</strong> ${userAnswer}</p>
                ${!isCorrect ? `<p><strong>Correct answer:</strong> ${correctAnswer}</p>` : ''}
            `;
            
            answerReviewEl.appendChild(reviewItem);
        });
        
        // Show results
        quizContainer.classList.add('hidden');
        quizFooter.classList.add('hidden');
        quizResult.classList.remove('hidden');
    }
});
