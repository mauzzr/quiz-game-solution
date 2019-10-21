/**
 * File: quiz.js
 * Author: Peter Welby
 * This file contains the full implementation of the quiz game,
 * from quiz start to score reporting & storage at the end of the quiz.
 */

// The number of seconds remaining to complete the quiz.
var timeRemaining = 10; // 15 * questions.length;
// This will hold a reference to the interval that we set later which updates the timer every second.
// We need this so that we can clear the interval once the quiz has ended.
var timerInterval;

var currentQuestionIndex = 0;

var startQuizButton = document.getElementById("startQuiz");
var timerElement = document.getElementById("timer");
var quizDiv = document.getElementById("quizContent");

function startQuiz(event) {
    if (!timerInterval) {
        timerInterval = setInterval(function () {
            updateTimer(timerElement, -1);
            if (timeRemaining < 1) {
                endQuiz();
            }
        }, 1000);
    }
}

function endQuiz() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    alert("Quiz ended!");
}

function updateTimer(timerElement, deltaSeconds) {
    timeRemaining += deltaSeconds;
    timerElement.textContent = `${timeRemaining} seconds left`;
}



startQuizButton.addEventListener("click", startQuiz);
