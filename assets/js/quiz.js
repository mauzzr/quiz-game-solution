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
    var scoreForm = makeScoreSubmitForm();

    headingElement.textContent = "Quiz completed!";
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    alert("Quiz ended!");
    quizDiv.textContent = ""

    quizDiv.appendChild(scoreForm);

}

function formSubmitted(event) {
    event.preventDefault();
    alert('Form submitted!');
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
        // Note: document.createElement misbehaves if you try to make a <kbd> element.
        // So we use jQuery here.
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

function makeScoreSubmitForm() {
    var container = document.createElement('div');
    var heading = document.createElement('h1');
    var subheading = document.createElement('h4');

    var formElement = document.createElement('form');
    var formGroupDiv = document.createElement('div');
    var labelElement = document.createElement('label');
    var inputElement = document.createElement('input');
    var submitButton = document.createElement('button');

    heading.textContent = `Quiz ended! Your score: ${timeRemaining}`;
    subheading.textContent = 'Add your initials below and click "Submit" to submit your score.';
    subheading.classList.add('text-muted');

    formGroupDiv.classList.add('form-group');

    inputElement.id = 'initialsInput';

    labelElement.setAttribute('for', 'initialsInput');
    labelElement.textContent = 'Initials';

    inputElement.setAttribute('type', 'text');
    inputElement.classList.add('form-control');
    inputElement.id = 'initialsInput';
    inputElement.setAttribute('placeholder', 'ABC');
    inputElement.setAttribute('maxlength', '3');

    submitButton.classList.add('btn', 'btn-primary', 'btn-lg');
    submitButton.textContent = 'Submit';
    submitButton.setAttribute('type', 'submit');
    submitButton.addEventListener('click', formSubmitted);

    formGroupDiv.append(labelElement, inputElement);
    formElement.append(formGroupDiv, submitButton);

    container.append(heading, subheading, formElement);

    // Return everything in one containing element so that it's easy to append to the document.
    return container;
}

startQuizButton.addEventListener("click", startQuiz);
