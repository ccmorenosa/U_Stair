/*
** UStair.  Grade curriculum schedule.
** Copyright (C) 2020  Andŕes Felipe Moreno Sarria
**
** This program is free software: you can redistribute it and/or modify
** it under the terms of the GNU General Public License as published by
** the Free Software Foundation, either version 3 of the License, or
** (at your option) any later version.
**
** This program is distributed in the hope that it will be useful,
** but WITHOUT ANY WARRANTY; without even the implied warranty of
** MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
** GNU General Public License for more details.
**
** You should have received a copy of the GNU General Public License
** along with this program.  If not, see <https://www.gnu.org/licenses/>.
**/

var semesters;
var semestersTable = document.getElementById("semesters-table");

// Activate subject tab tools.
var semesterTools = ["NEW-SEMESTER", "DELETE-SEMESTER"];
activateButtons(semesterTools);

// Send an event to uptade the table when the tab is activated.
ipcRenderer.send("GET-SEMESTERS");

// Event that update the table
ipcRenderer.on("UPDATE-SEMESTERS", (event, value) => {
  semesters = value;

  var semesterHTML = "";

  for (var semester of semesters) {
    semesterHTML += "<div id=\"" + semester.Number +
    "\" class=\"h-100 w-10 m-0 p-0 d-inline-table\">" +
    "<p class=\"palette-wet-asphalt w-100 text-light text-medium py-1 m-0 text-center\">" +
    semester.Numero + "</p>";

    subjects = JSON.parse(semester.Materias);

    for (var subject in subjects) {
      semesterHTML += "<div class=\"card text-white bg-primary mb-1 w-100 rounded-0\">" +
      "<div class=\"card-header\">" + subjects[subject] + "</div>" +
      "<div class=\"card-body\">" +
      "<p class=\"card-title\">Codigo: " + subject + " </p>" +
      "</div>" +
      "</div>";
    }

    semesterHTML += "<div class=\"w-100 text-center\">" +
    "<button class=\"btn btn-primary btn-sm rounded-0 p-1\">" +
    "<img class=\"NEW-SUBJECT tool\" src=\"../../assets/plus-icon.svg\">" +
    "</button>" +
    "</div>" +
    "</div>";

  }

  semestersTable.innerHTML = semesterHTML;

});
