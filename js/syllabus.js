import { initThemeToggle } from "./theme.js";

const stages = [...document.querySelectorAll(".journey-stage")];
const nextButton = document.querySelector("#nextStep");
const nextLabel = document.querySelector("#nextStepLabel");
const restartButton = document.querySelector("#restartJourney");
const progressBar = document.querySelector("#journeyProgress");
const progressTrack = document.querySelector(".journey-progress-track");
const hint = document.querySelector("#stepHint");
const discoveryCount = document.querySelector("#discoveryCount");
const journeyFooter = document.querySelector("#journeyFooter");

let unlockedStages = 0;

function updateProgress() {
  const percent = Math.round((unlockedStages / stages.length) * 100);
  progressBar.style.width = `${percent}%`;
  progressTrack.setAttribute("aria-valuenow", String(percent));
  discoveryCount.textContent = `${unlockedStages} de ${stages.length} etapas descubiertas`;
}

function revealNextStage() {
  if (unlockedStages >= stages.length) return;

  const stage = stages[unlockedStages];
  stage.hidden = false;
  stage.classList.remove("is-revealed");
  requestAnimationFrame(() => stage.classList.add("is-revealed"));
  unlockedStages += 1;

  // Cada revelación representa una de las cinco etapas del sílabo.
  updateProgress();
  journeyFooter.hidden = false;

  if (unlockedStages === stages.length) {
    nextLabel.textContent = "Recorrido completado";
    nextButton.disabled = true;
    hint.textContent = "¡Ruta completada! Descubriste todo el sílabo.";
    restartButton.classList.remove("d-none");
  } else {
    nextLabel.textContent = "Siguiente paso";
    hint.textContent = `Etapa ${unlockedStages} desbloqueada. Continúa para descubrir más.`;
  }

  stage.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
}

function restartJourney() {
  stages.forEach(stage => {
    stage.hidden = true;
    stage.classList.remove("is-revealed");
  });
  unlockedStages = 0;
  nextLabel.textContent = "Desbloquear información";
  nextButton.disabled = false;
  restartButton.classList.add("d-none");
  journeyFooter.hidden = true;
  hint.textContent = "Tu recorrido empieza aquí";
  updateProgress();
  document.querySelector("#journeyGate").scrollIntoView({ behavior: "smooth", block: "start" });
  nextButton.focus({ preventScroll: true });
}

nextButton.addEventListener("click", revealNextStage);
restartButton.addEventListener("click", restartJourney);
initThemeToggle();
updateProgress();