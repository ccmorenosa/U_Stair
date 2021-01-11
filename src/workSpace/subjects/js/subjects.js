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

var table = document.getElementById("DATABASE-TABLE");
var obj;

// Activate subject tab tools.
var subjectTools = ["NEW-DB-SUBJECT", "REFRESH-SUBJECT"];
activateButtons(subjectTools);


// Event to update the table whenever is necesary.
ipcRenderer.on("UPDATE-SUBJECTS", (event, value) => {
  // Fill the table headers.
  tableContent = "<thead class=\"palette-wet-asphalt text-light\">" +
  "<tr>" +
  "<th class=\"py-1\" scope=\"col\"></th>" +
  "<th class=\"py-1\" scope=\"col\">Codigo</th>" +
  "<th class=\"py-1\" scope=\"col\">Nombre</th>" +
  "<th class=\"py-1\" scope=\"col\">Créditos</th>" +
  "<th class=\"py-1\" scope=\"col\">Universidad</th>" +
  "<th class=\"py-1\" scope=\"col\">Sede</th>" +
  "<th class=\"py-1\" scope=\"col\">Facultad</th>" +
  "<th class=\"py-1\" scope=\"col\">Departamento</th>" +
  "<th class=\"py-1\" scope=\"col\">Programa</th>" +
  "<th class=\"py-1\" scope=\"col\"></th>" +
  "</tr>" +
  "</thead>";

  // Fill the table content.
  for (var row in value) {
    var entries = value[row];

    tableContent += "<tr>\n" +
    "<td class=\"py-1\"> <input type=\"checkbox\"/> </td>\n" +
    "<td class=\"py-1\">" + entries.Codigo + "</td>\n" +
    "<td class=\"py-1\">" + entries.Nombre + "</td>\n" +
    "<td class=\"py-1\">" + entries.Creditos + "</td>\n" +
    "<td class=\"py-1\">" + entries.Universidad + "</td>\n" +
    "<td class=\"py-1\">" + entries.Sede + "</td>\n" +
    "<td class=\"py-1\">" + entries.Facultad + "</td>\n" +
    "<td class=\"py-1\">" + entries.Departamento + "</td>\n" +
    "<td class=\"py-1\">" + entries.Programa + "</td>\n" +
    "<td class=\"py-1\">" +
    "<img src=\"../../assets/edit-icon.svg\" " +
    "class=\"bg-warning edit-row edit-button pointer\"/> " +
    "</td>\n" +
    "</tr>\n";
  }

  // Update table.
  table.innerHTML = tableContent;

  // Active edit buttons.
  activeEditButtons();
});

/**
* This function delete all the selected rows of the table whenever the delete
* button is clicked.
*/
function deleteItems() {
  var tableItems = table.children[1].children;

  for (var tableItem of tableItems) {
    if (tableItem.children[0].children[0].checked) {
      ipcRenderer.send("DELETE-DB-SUBJECT", tableItem.children[1].innerText);
    }
  }
}

/**
* This function add an event to edit a row of the table whenever the delete
* button is clicked.
*/
function activeEditButtons() {
  // Get all delete buttons of the table.
  var editButtons = document.getElementsByClassName("edit-row");

  // Add an event to the delete buttons.
  for (var button of editButtons) {

    button.addEventListener("click", (event) => {
      var parNode = event.target.parentElement.parentElement.children[1];
      ipcRenderer.send("EDIT-DB-SUBJECT", parNode.innerText);
    });

  }

}

ipcRenderer.send("REFRESH-SUBJECT");
