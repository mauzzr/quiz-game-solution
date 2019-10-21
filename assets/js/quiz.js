/**
 * File: quiz.js
 * Author: Peter Welby
 * This file contains the full implementation of the quiz game,
 * from quiz start to score reporting & storage at the end of the quiz.
 */

// The number of seconds remaining to complete the quiz.
var timeRemaining = 15 * questions.length;
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
    renderQuestion(0);
}

function endQuiz() {
    var headingElement = document.createElement("h2");
    headingElement.textContent = "Quiz completed!";
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    alert("Quiz ended!");
    quizDiv.textContent = ""

    quizDiv.appendChild()
}

function updateTimer(timerElement, deltaSeconds) {
    timeRemaining += deltaSeconds;
    timerElement.textContent = `${timeRemaining} seconds left`;
}

// This is the event handler for click events on choice buttons
function choiceClicked(event) {
    // console.log(this.getAttribute("data-response"));
    if (this.getAttribute("data-response") === questions[currentQuestionIndex].answer) {
        alert("Correct answer!");
        currentQuestionIndex++;
        if (currentQuestionIndex >= questions.length) {
            endQuiz();
        } else {
            renderQuestion(currentQuestionIndex);
        }
    } else {
        alert("Wrong answer!");
        updateTimer(timerElement, -15);
    }
}

function renderQuestion(questionIndex) {
    var titleElement = document.createElement("h3");
    var choiceElement;
    var kbdElement;
    var i;
    // Clear previous question content
    quizDiv.textContent = "";

    titleElement.textContent = questions[questionIndex].title;
    quizDiv.appendChild(titleElement);

    for (i = 0; i < questions[questionIndex].choices.length; i++) {
        kbdElement = $("<kbd></kbd>").text(`${i + 1}`);
        choiceElement = document.createElement("p");
        choiceElement.classList.add("btn", "btn-primary", "btn-lg");

        kbdElement.addClass("mr-2");
        $(choiceElement).append(kbdElement);
        $(choiceElement).append(`${questions[questionIndex].choices[i]}`);
        choiceElement.addEventListener("click", choiceClicked);
        choiceElement.setAttribute("data-response", questions[questionIndex].choices[i]);
        quizDiv.appendChild(choiceElement);
        quizDiv.appendChild(document.createElement("br"));
    }
}

startQuizButton.addEventListener("click", startQuiz);
