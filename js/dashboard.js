import { leagueData } from "./data.js";
import { initThemeToggle } from "./theme.js";

const chartColors = {
  text: "#a5b0a7",
  grid: "rgba(160, 174, 163, 0.12)",
  tooltip: "#202822"
};

const teamFilter = document.querySelector("#teamFilter");
const numberFormatter = new Intl.NumberFormat("es-ES");
const averageGoals = (leagueData.totalGoals / leagueData.matchesPlayed).toFixed(2).replace(".", ",");
const leader = [...leagueData.teams].sort((first, second) => second.points - first.points)[0];
const leadingScorer = [...leagueData.topScorers].sort((first, second) => second.goals - first.goals)[0];

document.querySelector("#matchesPlayed").textContent = numberFormatter.format(leagueData.matchesPlayed);
document.querySelector("#leaderTeam").textContent = leader.name;
document.querySelector("#leaderPoints").textContent = `${leader.points} pts`;
document.querySelector("#topScorer").textContent = leadingScorer.name;
document.querySelector("#topScorerGoals").textContent = `${leadingScorer.goals} goles`;
document.querySelector("#goalsAverage").textContent = averageGoals;
document.querySelector("#totalResults").textContent = numberFormatter.format(leagueData.matchesPlayed);

Chart.defaults.color = chartColors.text;
Chart.defaults.font.family = '"DM Sans", sans-serif';
Chart.defaults.font.size = 10;
Chart.defaults.plugins.legend.display = false;
Chart.defaults.plugins.tooltip.backgroundColor = chartColors.tooltip;
Chart.defaults.plugins.tooltip.titleColor = "#f2f5ef";
Chart.defaults.plugins.tooltip.bodyColor = "#c0cbc2";
Chart.defaults.plugins.tooltip.borderColor = "#465248";
Chart.defaults.plugins.tooltip.borderWidth = 1;
Chart.defaults.plugins.tooltip.padding = 10;

const standingsChart = new Chart(document.querySelector("#standingsChart"), {
  type: "bar",
  data: {
    labels: [],
    datasets: [{
      label: "Puntos",
      data: [],
      backgroundColor: [],
      borderRadius: 2,
      borderSkipped: false,
      barPercentage: 0.65,
      categoryPercentage: 0.72
    }]
  },
  options: {
    indexAxis: "y",
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: { beginAtZero: true, max: 30, ticks: { stepSize: 5, color: chartColors.text, padding: 7 }, grid: { color: chartColors.grid, drawTicks: false }, border: { display: false } },
      y: { ticks: { color: "#d0d8d1", padding: 9 }, grid: { display: false }, border: { display: false } }
    },
    plugins: {
      tooltip: { callbacks: { label: context => ` ${context.parsed.x} puntos` } }
    }
  }
});

const resultsChart = new Chart(document.querySelector("#resultsChart"), {
  type: "doughnut",
  data: {
    labels: leagueData.results.map(result => result.label),
    datasets: [{
      data: leagueData.results.map(result => result.value),
      backgroundColor: leagueData.results.map(result => result.color),
      borderColor: "#191f1b",
      borderWidth: 4,
      hoverOffset: 5
    }]
  },
  options: {
    maintainAspectRatio: false,
    cutout: "76%",
    plugins: {
      tooltip: { callbacks: { label: context => ` ${context.label}: ${context.parsed}%` } }
    }
  }
});

const momentumChart = new Chart(document.querySelector("#momentumChart"), {
  type: "line",
  data: {
    labels: leagueData.momentum.matchdays,
    datasets: leagueData.momentum.teams.map(team => ({
      label: team.name,
      data: team.points,
      borderColor: team.color,
      backgroundColor: team.color,
      pointBackgroundColor: team.color,
      pointBorderColor: "#191f1b",
      pointBorderWidth: 2,
      pointRadius: 3,
      pointHoverRadius: 5,
      borderWidth: 2,
      tension: 0.35
    }))
  },
  options: {
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    scales: {
      x: { ticks: { color: chartColors.text, padding: 8 }, grid: { display: false }, border: { color: chartColors.grid } },
      y: { beginAtZero: false, min: 6, max: 27, ticks: { stepSize: 3, color: chartColors.text, padding: 8 }, grid: { color: chartColors.grid, drawTicks: false }, border: { display: false } }
    },
    plugins: {
      tooltip: { callbacks: { label: context => ` ${context.dataset.label}: ${context.parsed.y} pts` } }
    }
  }
});

function renderStandings() {
  const limit = teamFilter.value === "top4" ? 4 : 5;
  const teams = [...leagueData.teams].sort((first, second) => second.points - first.points).slice(0, limit);
  standingsChart.data.labels = teams.map(team => team.shortName);
  standingsChart.data.datasets[0].data = teams.map(team => team.points);
  standingsChart.data.datasets[0].backgroundColor = teams.map(team => team.color);
  standingsChart.update();
}

function renderResultsLegend() {
  const legend = document.querySelector("#resultsLegend");
  leagueData.results.forEach(result => {
    const item = document.createElement("div");
    item.className = "result-legend-item";
    item.innerHTML = `<span class="legend-dot" style="background:${result.color}"></span><span><span class="result-legend-label"></span><strong class="result-legend-value">${result.value}%</strong></span>`;
    item.querySelector(".result-legend-label").textContent = result.label;
    legend.append(item);
  });
}

function renderMomentumLegend() {
  const legend = document.querySelector("#momentumLegend");
  leagueData.momentum.teams.forEach(team => {
    const item = document.createElement("span");
    item.className = "momentum-legend-item";
    item.innerHTML = `<span class="legend-dot" style="background:${team.color}"></span><span></span>`;
    item.lastElementChild.textContent = team.name;
    legend.append(item);
  });
}

function updateChartTheme(theme) {
  const isLight = theme === "light";
  const textColor = isLight ? "#58685d" : "#a5b0a7";
  const gridColor = isLight ? "rgba(68, 89, 73, 0.14)" : "rgba(160, 174, 163, 0.12)";
  Chart.defaults.color = textColor;
  Chart.defaults.plugins.tooltip.backgroundColor = isLight ? "#ffffff" : chartColors.tooltip;
  Chart.defaults.plugins.tooltip.titleColor = isLight ? "#1b2820" : "#f2f5ef";
  Chart.defaults.plugins.tooltip.bodyColor = isLight ? "#526157" : "#c0cbc2";
  Chart.defaults.plugins.tooltip.borderColor = isLight ? "#cbd7cd" : "#465248";

  [standingsChart, momentumChart].forEach(chart => {
    Object.values(chart.options.scales).forEach(scale => {
      scale.ticks.color = textColor;
      if (scale.grid.display !== false) scale.grid.color = gridColor;
    });
    chart.update("none");
  });

  standingsChart.options.scales.y.ticks.color = isLight ? "#26352b" : "#d0d8d1";
  standingsChart.update("none");
  resultsChart.data.datasets[0].borderColor = isLight ? "#ffffff" : "#191f1b";
  resultsChart.update("none");
}

let reportStatusTimer;

function showReportStatus(message) {
  const status = document.querySelector("#reportStatus");
  status.textContent = message;
  status.classList.add("is-visible");
  window.clearTimeout(reportStatusTimer);
  reportStatusTimer = window.setTimeout(() => status.classList.remove("is-visible"), 3500);
}

function downloadReport() {
  const JsPDF = window.jspdf?.jsPDF;
  if (!JsPDF) {
    showReportStatus("No se pudo cargar el generador PDF. Revisa tu conexión e inténtalo otra vez.");
    return;
  }

  const currentTheme = document.documentElement.dataset.theme;
  updateChartTheme("light");

  try {
    const pdf = new JsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const reportDate = new Intl.DateTimeFormat("es-ES", { dateStyle: "long" }).format(new Date());
    const labels = standingsChart.data.labels;
    const points = standingsChart.data.datasets[0].data;

    pdf.setFillColor(246, 248, 246);
    pdf.rect(0, 0, pageWidth, 210, "F");
    pdf.setTextColor(29, 43, 33);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text("Informe de La Liga 2025/26", 14, 16);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(90, 105, 94);
    pdf.text(`Jornada ${leagueData.matchday} · Datos simulados · ${reportDate}`, 14, 23);

    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(35, 51, 39);
    pdf.text(`Partidos: ${leagueData.matchesPlayed}`, 14, 34);
    pdf.text(`Líder: ${leader.name} (${leader.points} pts)`, 75, 34);
    pdf.text(`Goleador: ${leadingScorer.name} (${leadingScorer.goals})`, 156, 34);
    pdf.text(`Goles / partido: ${averageGoals}`, 245, 34);

    pdf.setFontSize(10);
    pdf.text(`Clasificación · ${teamFilter.value === "top4" ? "Top 4" : "Tabla general"}`, 14, 46);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    labels.forEach((name, index) => {
      pdf.text(`${index + 1}. ${name}`, 14, 53 + index * 4.5);
      pdf.text(`${points[index]} pts`, 75, 53 + index * 4.5);
    });

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.text("Balance de resultados", 120, 46);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    leagueData.results.forEach((result, index) => {
      pdf.text(`${result.label}: ${result.value}%`, 120, 53 + index * 5);
    });

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.text("Puntos por equipo", 14, 81);
    pdf.addImage(standingsChart.toBase64Image(), "PNG", 12, 84, 132, 49);
    pdf.text("Resultados", 158, 81);
    pdf.addImage(resultsChart.toBase64Image(), "PNG", 157, 84, 48, 48);

    pdf.setFontSize(10);
    pdf.text("Evolución de los líderes · últimas 5 fechas", 14, 143);
    pdf.addImage(momentumChart.toBase64Image(), "PNG", 12, 146, pageWidth - 24, 49);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7);
    pdf.setTextColor(100, 115, 104);
    pdf.text("Reporte generado desde el dashboard. Información con fines demostrativos.", 14, 203);
    pdf.save("informe-la-liga-2025-26.pdf");
    showReportStatus("Reporte PDF descargado.");
  } catch (error) {
    console.error("No se pudo generar el reporte PDF:", error);
    showReportStatus("Ocurrió un error al generar el PDF. Vuelve a intentarlo.");
  } finally {
    updateChartTheme(currentTheme);
  }
}

teamFilter.addEventListener("change", renderStandings);
document.querySelector("#downloadReport").addEventListener("click", downloadReport);
renderStandings();
renderResultsLegend();
renderMomentumLegend();
initThemeToggle(updateChartTheme);