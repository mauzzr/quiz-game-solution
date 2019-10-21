/**
 * File: scores.js
 * Author: Peter Welby
 * For use on the scores.html page, this script retrieves any saved scores from localStorage
 * and renders them onto the page in a table.
 */

var tbodyElement = document.getElementById('scoresTableBody');
var scores = JSON.parse(window.localStorage.getItem('quizScores'));
// Loop vars
var i, tableRowElement, tableHeadElement, initialsElement, scoreElement;

for (i = 0; i < scores.length; i++) {
    tableRowElement = document.createElement('tr');

    tableHeadElement = document.createElement('th');
    tableHeadElement.setAttribute('scope', 'row');
    tableHeadElement.textContent = `${i + 1}`;
    tableRowElement.appendChild(tableHeadElement);

    initialsElement = document.createElement('td');
    initialsElement.textContent = scores[i].name;
    tableRowElement.appendChild(initialsElement);

    scoreElement = document.createElement('td');
    scoreElement.textContent = scores[i].score;
    tableRowElement.appendChild(scoreElement);

    tbodyElement.appendChild(tableRowElement);
}
