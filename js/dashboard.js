import { leagueData } from "./data.js";

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

teamFilter.addEventListener("change", renderStandings);
renderStandings();
renderResultsLegend();
renderMomentumLegend();