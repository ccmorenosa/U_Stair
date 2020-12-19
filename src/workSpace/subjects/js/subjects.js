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
var subjecTools = ["NEW-DB-SUBJECT", "REFRESH-SUBJECT"];
activateButtons(subjecTools);


// Event to update the table whenever is necesary.
ipcRenderer.on("UPDATE-SUBJECTS", (event, value) => {
  // Fill the table headers.
  tableContent = "<thead class=\"palette-wet-asphalt text-light\">" +
  "<tr>" +
  "<th scope=\"col\">Codigo</th>" +
  "<th scope=\"col\">Nombre</th>" +
  "<th scope=\"col\">Créditos</th>" +
  "<th scope=\"col\">Universidad</th>" +
  "<th scope=\"col\">Sede</th>" +
  "<th scope=\"col\">Facultad</th>" +
  "<th scope=\"col\">Departamento</th>" +
  "<th scope=\"col\">Programa</th>" +
  "<th scope=\"col\">Borrar</th>" +
  "</tr>" +
  "</thead>";

  // Fill the table content.
  for (var row in value) {
    var entries = value[row];
    tableContent += "<tr>\n" +
    "<td>" + entries.Codigo + "</td>\n" +
    "<td>" + entries.Nombre + "</td>\n" +
    "<td>" + entries.Creditos + "</td>\n" +
    "<td>" + entries.Universidad + "</td>\n" +
    "<td>" + entries.Sede + "</td>\n" +
    "<td>" + entries.Facultad + "</td>\n" +
    "<td>" + entries.Departamento + "</td>\n" +
    "<td>" + entries.Programa + "</td>\n" +
    "<td>" +
    "<img src=\"../../assets/delete-icon.svg\" " +
    "class=\"bg-danger delete-row rounded-circle delete-button pointer\"/> " +
    "</td>\n" +
    "</tr>\n";
  }

  // Update table.
  table.innerHTML = tableContent;

  // Active delete buttons.
  activeDeleteButtons();
});


/**
* This function add an event to delete a row of the table whenever the delete
* button is clicked.
*/
function activeDeleteButtons() {
  // Get all delete buttons of the table.
  var deleteButtons = document.getElementsByClassName("delete-row");

  // Add an event to the delete buttons.
  for (var button of deleteButtons) {
    button.addEventListener("click", (event) => {
      var parNode = event.target.parentElement.parentElement.children[0];
      ipcRenderer.send("DELETE-DB-SUBJECT", parNode.innerText);
    });
  }
}
