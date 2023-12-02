const { ipcRenderer } = require("electron");

document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("startButton");
  const playAgainButton = document.getElementById("playAgainButton");
  const quizContainer = document.getElementById("quizContainer");
  const quizModal = $("#quizModal");

  let currentQuestionIndex = 0;
  let score = 0;
  let questions = [];

  startButton.addEventListener("click", () => {
    // Reset variables for a new quiz
    currentQuestionIndex = 0;
    score = 0;
    startButton.style.display = "none";
    playAgainButton.style.display = "none";
    quizContainer.style.display = "block";

    // Fetch questions from the main process
    ipcRenderer.send("start-quiz", [
      {
        question: "What is the capital of France?",
        options: ["Berlin", "Paris", "Madrid", "Rome"],
        correctAnswer: "Paris",
      },
      {
        question: "Which planet is known as the red planet?",
        options: ["Earth", "Mars", "Venus", "Jupiter"],
        correctAnswer: "Mars",
      },
      {
        question: "What is the largest mammal?",
        options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
        correctAnswer: "Blue Whale",
      },
    ]);
  });

  playAgainButton.addEventListener("click", () => {
    startButton.style.display = "none";
    playAgainButton.style.display = "none";
    quizContainer.style.display = "block";

    // Reset variables for a new quiz
    currentQuestionIndex = 0;
    score = 0;

    // Fetch questions from the main process
    ipcRenderer.send("start-quiz", [
      {
        question: "What is the capital of France?",
        options: ["Berlin", "Paris", "Madrid", "Rome"],
        correctAnswer: "Paris",
      },
      {
        question: "Which planet is known as the red planet?",
        options: ["Earth", "Mars", "Venus", "Jupiter"],
        correctAnswer: "Mars",
      },
      {
        question: "What is the largest mammal?",
        options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
        correctAnswer: "Blue Whale",
      },
    ]);
  });

  ipcRenderer.on("show-modal", (event, message) => {
    quizModal.find(".modal-body").text(message);
    quizModal.modal("show");
  });

  ipcRenderer.on("show-final-score", (event, finalScore) => {
    quizContainer.style.display = "none";
    playAgainButton.style.display = "block";
    startButton.style.display = "none";
    ipcRenderer.send("show-modal", `Your final score is: ${finalScore}`);
  });
});

function answerSelected(selectedAnswer) {
  const currentQuestion = questions[currentQuestionIndex];

  if (selectedAnswer === currentQuestion.correctAnswer) {
    score++;
    ipcRenderer.send("show-notification", "Correct Answer!");
    ipcRenderer.send("show-modal", "Correct Answer!");
  } else {
    ipcRenderer.send("show-notification", "Incorrect Answer!");
    ipcRenderer.send("show-modal", "Incorrect");
  }
}
