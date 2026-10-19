// Datos de demostración compartidos por el cuestionario y el dashboard.
export const quizQuestions = [
  {
    question: "¿Cuál es el objetivo principal de Business Intelligence?",
    answers: [
      "Guardar todos los datos sin analizarlos",
      "Convertir datos en información útil para decidir",
      "Eliminar la necesidad de hacer preguntas"
    ],
    correctIndex: 1,
    explanation: "BI transforma datos en información que ayuda a tomar decisiones con evidencia."
  },
  {
    question: "En un proceso ETL, ¿qué ocurre durante la transformación?",
    answers: [
      "Se limpian, combinan y preparan los datos",
      "Se muestran los resultados en un gráfico",
      "Se descargan los datos desde su origen"
    ],
    correctIndex: 0,
    explanation: "Transformar es limpiar y dar estructura a los datos antes de cargarlos."
  },
  {
    question: "Una tienda quiere anticipar qué productos reponer. ¿Qué aporta BI?",
    answers: [
      "Una lista aleatoria de productos",
      "Un cambio automático de precios sin análisis",
      "Patrones de venta para planificar el inventario"
    ],
    correctIndex: 2,
    explanation: "El análisis de ventas permite reconocer patrones y planificar mejor el inventario."
  }
];

export const leagueData = {
  season: "2025/2026",
  matchday: 10,
  matchesPlayed: 100,
  totalGoals: 267,
  results: [
    { label: "Victorias locales", value: 46, color: "#c4f06b" },
    { label: "Empates", value: 25, color: "#69d7d0" },
    { label: "Victorias visitantes", value: 29, color: "#ff786b" }
  ],
  teams: [
    { name: "Real Madrid", shortName: "R. Madrid", points: 24, goalsFor: 22, goalsAgainst: 8, color: "#c4f06b" },
    { name: "FC Barcelona", shortName: "Barcelona", points: 23, goalsFor: 25, goalsAgainst: 11, color: "#69d7d0" },
    { name: "Atlético de Madrid", shortName: "Atlético", points: 21, goalsFor: 18, goalsAgainst: 9, color: "#ff786b" },
    { name: "Athletic Club", shortName: "Athletic", points: 18, goalsFor: 16, goalsAgainst: 10, color: "#edbc61" },
    { name: "Girona FC", shortName: "Girona", points: 16, goalsFor: 17, goalsAgainst: 14, color: "#9e8bff" }
  ],
  topScorers: [
    { name: "Kylian Mbappé", team: "Real Madrid", goals: 12 },
    { name: "Robert Lewandowski", team: "FC Barcelona", goals: 10 },
    { name: "Antoine Griezmann", team: "Atlético de Madrid", goals: 8 }
  ],
  momentum: {
    matchdays: ["J6", "J7", "J8", "J9", "J10"],
    teams: [
      { name: "Real Madrid", color: "#c4f06b", points: [12, 15, 18, 21, 24] },
      { name: "FC Barcelona", color: "#69d7d0", points: [11, 14, 17, 20, 23] },
      { name: "Atlético de Madrid", color: "#ff786b", points: [9, 12, 15, 18, 21] }
    ]
  }
};