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

// Searcher.
var searchBar = document.getElementById("materia");

// Semester variables.
var semester;
var subjects;

ipcRenderer.on("SET-SEMESTER", (event, value) => {
  semester = value;
});

ipcRenderer.on("UPDATE-RIGHT-TABLE", (event, value) => {
  subjectsAdded = value;
  updateRightTable(subjectsAdded);
});


ipcRenderer.on("UPDATE-LEFT-TABLE", (event, value) => {
  var tableHTML = "<thead class=\"palette-wet-asphalt text-light\">" +
  "<tr>" +
  "<th class=\"py-1\" scope=\"col\">Codigo</th>" +
  "<th class=\"py-1\" scope=\"col\">Nombre</th>" +
  "<th class=\"py-1\" scope=\"col\"></th>" +
  "</tr>" +
  "</thead>";

  for (var row in value) {
    var entries = value[row];

    tableHTML += "<tr>\n" +
    "<td class=\"py-1\">" + entries.Codigo + "</td>\n" +
    "<td class=\"py-1\">" + entries.Nombre + "</td>\n" +
    "<td class=\"py-1\">" +
    "<img src=\"../../assets/plus-icon.svg\" " +
    "class=\"bg-success add-row pointer p-1\" style=\"width: 20px;\"/> " +
    "</td>\n" +
    "</tr>\n";
  }

  leftTable.innerHTML = tableHTML;

  activeAddButtons();
});


/**
* This function update the right table.
*/
function updateRightTable(subjects) {
  var tableHTML = "<thead class=\"palette-wet-asphalt text-light\">" +
  "<tr>" +
  "<th class=\"py-1\" scope=\"col\">Codigo</th>" +
  "<th class=\"py-1\" scope=\"col\">Nombre</th>" +
  "<th class=\"py-1\" scope=\"col\"></th>" +
  "</tr>" +
  "</thead>";

  for (var subject in subjects) {
    tableHTML += "<tr>\n" +
    "<td class=\"py-1\">" + subject + "</td>\n" +
    "<td class=\"py-1\">" + subjects[subject] + "</td>\n" +
    "<td class=\"py-1\">" +
    "<img src=\"../../assets/minus-icon.svg\" " +
    "class=\"bg-danger delete-row pointer p-1\" style=\"width: 20px;\"/> " +
    "</td>\n" +
    "</tr>\n";
  }

  rightTable.innerHTML = tableHTML;

  activeRemoveButtons();
}

/**
* This function search the subjects by the name or code.
*/
function searchSubjects() {
  ipcRenderer.send("FIND-SUBJECT", searchBar.value);
}

/**
* This Fucntion close the form and send the information.
*/
function completeSemester() {
  ipcRenderer.send("ADD-SUBJECTS", [semester, subjectsAdded]);
}


ipcRenderer.send("FIND-SUBJECT", "");
ipcRenderer.send("GET-SEMESTER-INFO");
