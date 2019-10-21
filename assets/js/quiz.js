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
    // This places the timer on the page without changing its value
    updateTimer(timerElement, 0);
    // If the timer isn't already running, start it
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
    var initials = document.getElementById('initialsInput').value;
    var scores = window.localStorage.getItem('quizScores');
    var submissionConfirmation = document.createElement('p');
    var highScoresLink = document.createElement('a');
    event.preventDefault();

    console.log("SUBMITTING A SCORE");
    console.log("input element: " + document.getElementById('initialsInput'));
    console.log("input element value: ", initials);
    // Either quizScores was found, in which case we need to add to it,
    //  or it wasn't, in which case we need to create it.
    if (scores) {
        scores = JSON.parse(scores);
        scores.push({name: initials,
                     score: timeRemaining
        });

        // This sorts the scores array in order of ascending scores
        scores.sort((a, b) => { return a.score - b.score });
        // We want them in descending order to get a "Top 10," so reverse after sorting
        scores.reverse();
        // Keep only the top 10 scores
        scores = scores.slice(0, 10);
    } else {
        scores = [
            {
                name: initials,
                score: timeRemaining
        }];
    }

    window.localStorage.setItem('quizScores', JSON.stringify(scores));

    submissionConfirmation.textContent = 'Thank you for submitting your score! '
    highScoresLink.href = 'scores.html';
    highScoresLink.textContent = 'View High Scores';
    submissionConfirmation.appendChild(highScoresLink);
    quizDiv.appendChild(submissionConfirmation);
    this.removeEventListener('click', formSubmitted);
    this.addEventListener('click', doNothing);
}

function updateTimer(timerElement, deltaSeconds) {
    timeRemaining += deltaSeconds;
    timerElement.textContent = `${timeRemaining} seconds left`;
}

// This is the event handler for click events on choice buttons
function choiceClicked(event) {
    // console.log(this.getAttribute("data-response"));
    if (this.getAttribute("data-response") === questions[currentQuestionIndex].answer) {
        // alert("Correct answer!");
        currentQuestionIndex++;
        if (currentQuestionIndex >= questions.length) {
            endQuiz();
        } else {
            renderQuestion(currentQuestionIndex);
        }
    } else {
        // alert("Wrong answer!");
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

function doNothing(event) {
    event.preventDefault();
}

startQuizButton.addEventListener("click", startQuiz);
