// ==================== I. DOM ELEMENT SELECTORS ====================
const startBtn = document.querySelector('.start-btn');
const popupInfo = document.querySelector('.popup-info');
const exitBtn = document.querySelector('.exit-btn');
const main = document.querySelector('.main');
const continueBtn = document.querySelector('.continue-btn');
const quizSection = document.querySelector('.quiz-section');
const quizBox = document.querySelector('.quiz-box');
const resultBox = document.querySelector('.result-box');
const tryAgainBtn = document.querySelector('.tryAgain-btn');
const goHomeBtn = document.querySelector('.goHome-btn');
const nextBtn = document.querySelector('.next-btn');
const optionList = document.querySelector('.option-list');
const questionText = document.querySelector('.question-text');
const preloader = document.getElementById("preloader");
const randomizeToggle = document.getElementById('randomizeToggle');
const loginModal = document.getElementById('loginModal');
const loginBtn = document.getElementById('loginBtn');
const usernameInput = document.getElementById('usernameInput');
const loginError = document.getElementById('loginError');

// ==================== II. STATE VARIABLES ====================
let questionCount = 0;
let questionNumb = 1;
let userScore = 0;
let userAnswers = [];
let selectedOption = null;
let quizShuffled = false;
let startTime;
let randomizeQuestions = true;
let currentUser = null;

// ==================== USER LOGIN ====================
const getUser = () => localStorage.getItem('quizUser');
const setUser = (username) => localStorage.setItem('quizUser', username);
const showLoginModal = () => {
  loginModal.style.display = 'flex';
  usernameInput.value = '';
  loginError.textContent = '';
  setTimeout(() => usernameInput.focus(), 100);
};
const hideLoginModal = () => loginModal.style.display = 'none';

window.addEventListener('DOMContentLoaded', () => {
  currentUser = getUser();
  if (!currentUser) {
    showLoginModal();
  }
});
loginBtn.onclick = () => {
  const username = usernameInput.value.trim();
  if (!username) {
    loginError.textContent = 'Please enter a username.';
    return;
  }
  setUser(username);
  currentUser = username;
  hideLoginModal();
};
usernameInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') loginBtn.click();
});

// ==================== III. EVENT LISTENERS ====================
window.addEventListener("load", () => {
    preloader && (preloader.style.display = "none");
});
startBtn.onclick = () => {
    popupInfo.classList.add('active');
    main.classList.add('active');
};
exitBtn.onclick = () => {
    popupInfo.classList.remove('active');
    main.classList.remove('active');
};
continueBtn.onclick = () => {
    quizSection.classList.add('active');
    popupInfo.classList.remove('active');
    main.classList.remove('active');
    quizBox.classList.add('active');
    randomizeQuestions = randomizeToggle ? randomizeToggle.checked : true;
    startQuiz();
};
nextBtn.onclick = () => handleNextQuestion();
tryAgainBtn.onclick = () => {
    resultBox.classList.remove('active');
    quizBox.classList.add('active');
    quizShuffled = false;
    startQuiz();
};
goHomeBtn.onclick = () => window.location.href = 'main.html';
window.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && nextBtn.classList.contains('active')) {
        nextBtn.click();
    }
});

// ==================== IV. CORE QUIZ FUNCTIONS ====================
function startQuiz() {
    startTime = new Date();
    resetQuizState();
    shuffleQuestions();
    showQuestion(questionCount);
    updateHeaderScore();
}
function shuffleQuestions() {
    if (randomizeQuestions && !quizShuffled) {
        for (let i = questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [questions[i], questions[j]] = [questions[j], questions[i]];
        }
        // Also randomize options for each question
        questions.forEach(q => {
            for (let i = q.options.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [q.options[i], q.options[j]] = [q.options[j], q.options[i]];
            }
        });
        quizShuffled = true;
    }
}
function showQuestion(index) {
    selectedOption = null;
    nextBtn.classList.remove('active');
    questionText.innerHTML = `<img src='./${questions[index].questions}' alt='Question ${index + 1}'/>`;
    let optionTag = '';
    questions[index].options.forEach((opt, i) => {
        optionTag += `<div class="option" data-name="${opt}"><span><img src="./${opt}" alt="Option ${i + 1}"/></span></div>`;
    });
    optionList.innerHTML = optionTag;
    optionList.querySelectorAll('.option').forEach(option => {
        option.onclick = () => optionSelected(option);
    });
    updateQuestionCounter(questionCount + 1);
}
function optionSelected(answer) {
    selectedOption = answer.dataset.name;
    userAnswers[questionCount] = selectedOption;
    optionList.querySelectorAll('.option').forEach(option => option.classList.remove("selected"));
    answer.classList.add('selected');
    nextBtn.classList.add('active');
}
function handleNextQuestion() {
    if (selectedOption === null) return;
    const correctAnswer = questions[questionCount].answer;
    if (selectedOption === correctAnswer) userScore++;
    updateHeaderScore();
    if (questionCount < questions.length - 1) {
        questionCount++;
        showQuestion(questionCount);
    } else {
        showResultBox();
    }
}
function showResultBox() {
    quizBox.classList.remove('active');
    resultBox.classList.add('active');
    const endTime = new Date();
    let timeElapsed = Math.floor((endTime - startTime) / 1000);
    document.getElementById('timeElapsed').textContent = `${timeElapsed}s`;
    const scoreText = document.querySelector('.score-text');
    scoreText.textContent = `Your Score ${userScore} out of ${questions.length}`;
    const circularProgress = document.querySelector('.circular-progress');
    const progressValue = document.querySelector('.progress-value');
    const progressEndValue = Math.round((userScore / questions.length) * 100);
    let progressStartValue = 0;
    let speed = 20;
    let progress = setInterval(() => {
        progressStartValue++;
        progressValue.textContent = `${progressStartValue}%`;
        circularProgress.style.background = `conic-gradient(#161742 ${progressStartValue * 3.6}deg, rgba(0,0,0,.1) 0deg)`;
        if (progressStartValue >= progressEndValue) clearInterval(progress);
    }, speed);
    storeIncorrectAnswers();
    storeUserScore();
}

// ==================== V. HELPER & STATE FUNCTIONS ====================
function resetQuizState() {
    questionCount = 0;
    questionNumb = 1;
    userScore = 0;
    userAnswers = [];
    selectedOption = null;
}
function updateHeaderScore() {
    const headerScoreText = document.querySelector('.header-score');
    headerScoreText.textContent = `Score: ${userScore} / ${questions.length}`;
}
function updateQuestionCounter(index) {
    const questionTotal = document.querySelector('.question-total');
    questionTotal.textContent = `${index} of ${questions.length} Questions`;
}
function storeIncorrectAnswers() {
    const incorrectAnswers = [];
    questions.forEach((question, index) => {
        const userAnswer = userAnswers[index];
        const correctAnswer = question.answer;
        if (userAnswer !== correctAnswer) {
            incorrectAnswers.push({
                question: question.questions,
                userAnswer: userAnswer || 'No Answer',
                correctAnswer: correctAnswer
            });
        }
    });
    localStorage.setItem('incorrectAnswers', JSON.stringify(incorrectAnswers));
}
function storeUserScore() {
    if (!currentUser) return;
    let userScores = JSON.parse(localStorage.getItem('userScores') || '{}');
    if (!userScores[currentUser]) userScores[currentUser] = [];
    userScores[currentUser].push({
        date: new Date().toISOString(),
        score: userScore,
        total: questions.length
    });
    localStorage.setItem('userScores', JSON.stringify(userScores));
}