import { quizQuestions } from "./data.js";
import { initThemeToggle } from "./theme.js";

const questionLabel = document.querySelector("#questionLabel");
const scoreLabel = document.querySelector("#scoreLabel");
const progressBar = document.querySelector("#quizProgress");
const progressTrack = document.querySelector(".quiz-progress");
const questionText = document.querySelector("#questionText");
const answerList = document.querySelector("#answerList");
const feedbackMessage = document.querySelector("#feedbackMessage");
const nextButton = document.querySelector("#nextQuestion");
const resultPanel = document.querySelector("#quizResult");

let currentQuestionIndex = 0;
let score = 0;
let answered = false;

function renderQuestion() {
  const question = quizQuestions[currentQuestionIndex];
  answered = false;
  questionLabel.textContent = `PREGUNTA ${currentQuestionIndex + 1} DE ${quizQuestions.length}`;
  scoreLabel.textContent = `${score} ${score === 1 ? "PUNTO" : "PUNTOS"}`;
  questionText.textContent = question.question;
  answerList.replaceChildren();
  feedbackMessage.textContent = "";
  feedbackMessage.className = "feedback-message";
  nextButton.disabled = true;
  nextButton.innerHTML = currentQuestionIndex === quizQuestions.length - 1
    ? 'Ver resultado <span aria-hidden="true">→</span>'
    : 'Siguiente pregunta <span aria-hidden="true">→</span>';
  const progress = (currentQuestionIndex / quizQuestions.length) * 100;
  progressBar.style.width = `${progress}%`;
  progressTrack.setAttribute("aria-valuenow", String(Math.round(progress)));

  question.answers.forEach((answer, answerIndex) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-option";
    button.innerHTML = `<span class="answer-letter">${String.fromCharCode(65 + answerIndex)}</span><span></span>`;
    button.lastElementChild.textContent = answer;
    button.addEventListener("click", () => selectAnswer(answerIndex));
    answerList.append(button);
  });
}

function selectAnswer(selectedIndex) {
  if (answered) return;
  answered = true;
  const question = quizQuestions[currentQuestionIndex];
  const buttons = [...answerList.querySelectorAll(".answer-option")];
  const isCorrect = selectedIndex === question.correctIndex;

  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === question.correctIndex) button.classList.add("is-correct");
    if (index === selectedIndex && !isCorrect) button.classList.add("is-incorrect");
  });

  if (isCorrect) score += 1;
  feedbackMessage.textContent = `${isCorrect ? "¡Correcto!" : "No exactamente."} ${question.explanation}`;
  feedbackMessage.classList.add(isCorrect ? "feedback-correct" : "feedback-incorrect");
  scoreLabel.textContent = `${score} ${score === 1 ? "PUNTO" : "PUNTOS"}`;
  nextButton.disabled = false;
}

function renderResult() {
  questionLabel.textContent = "RETO COMPLETADO";
  scoreLabel.textContent = `${score} ${score === 1 ? "PUNTO" : "PUNTOS"}`;
  progressBar.style.width = "100%";
  progressTrack.setAttribute("aria-valuenow", "100");
  questionText.classList.add("d-none");
  answerList.classList.add("d-none");
  feedbackMessage.classList.add("d-none");
  nextButton.classList.add("d-none");
  resultPanel.classList.remove("d-none");

  const messages = [
    ["Buen comienzo", "Repasa los fundamentos y vuelve a intentarlo. Cada pregunta afina tu mirada analítica."],
    ["Vas por buen camino", "Ya conectas los conceptos clave. Un repaso más y dominarás el recorrido de los datos."],
    ["¡Excelente lectura!", "Tienes una gran base para convertir datos en decisiones."],
    ["¡Reto superado!", "BI no tiene secretos para ti. Ahora explora los datos de La Liga."]
  ];
  const [title, message] = messages[score];
  resultPanel.innerHTML = `<div class="result-score">${score}/${quizQuestions.length}</div><h3>${title}</h3><p>${message}</p><button class="btn-restart" type="button">Intentar de nuevo ↻</button>`;
  resultPanel.querySelector(".btn-restart").addEventListener("click", restartQuiz);
}

function restartQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  questionText.classList.remove("d-none");
  answerList.classList.remove("d-none");
  feedbackMessage.classList.remove("d-none");
  nextButton.classList.remove("d-none");
  resultPanel.classList.add("d-none");
  renderQuestion();
}

nextButton.addEventListener("click", () => {
  if (!answered) return;
  if (currentQuestionIndex === quizQuestions.length - 1) {
    renderResult();
    return;
  }
  currentQuestionIndex += 1;
  renderQuestion();
});

renderQuestion();
initThemeToggle();