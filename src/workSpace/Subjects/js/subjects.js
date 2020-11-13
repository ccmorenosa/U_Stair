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

// Add a event to add a new subject with the ubtton in the tool bar.
document.getElementById("NEW-DB-SUBJECT").addEventListener("click", (event) => {
  ipcRenderer.send("NEW-DB-SUBJECT", null);
});

// Event to update the table whenever is necesary.
ipcRenderer.on("UPDATE-SUBJECTS", (event, value) => {
  console.log("Update");
  // Fill the table headers.
  tableContent = "<tr>\n" +
  "<th class=\"right-border bottom-border\">Código</th>\n" +
  "<th class=\"right-border bottom-border\">Nombre</th>\n" +
  "<th class=\"right-border bottom-border\">Créditos</th>\n" +
  "<th class=\"right-border bottom-border\">Universidad</th>\n" +
  "<th class=\"right-border bottom-border\">Sede</th>\n" +
  "<th class=\"right-border bottom-border\">Facultad</th>\n" +
  "<th class=\"right-border bottom-border\">Departamento</th>\n" +
  "<th class=\"right-border bottom-border\">Programa</th>\n" +
  "<th class=\"bottom-border\">Borrar</th>\n" +
  "</tr>\n";

  // Fill the table content.
  for (var row in value) {
    var entries = value[row];
    tableContent += "<tr>\n" +
    "<td class=\"right-border bottom-border\">" + entries.Codigo + "</td>\n" +
    "<td class=\"right-border bottom-border\">" + entries.Nombre + "</td>\n" +
    "<td class=\"right-border bottom-border\">" + entries.Creditos + "</td>\n" +
    "<td class=\"right-border bottom-border\">" + entries.Universidad + "</td>\n" +
    "<td class=\"right-border bottom-border\">" + entries.Sede + "</td>\n" +
    "<td class=\"right-border bottom-border\">" + entries.Facultad + "</td>\n" +
    "<td class=\"right-border bottom-border\">" + entries.Departamento + "</td>\n" +
    "<td class=\"right-border bottom-border\">" + entries.Programa + "</td>\n" +
    "<td class=\"bottom-border\"><img src=\"../../assets/icons-delete-50.svg\" " +
    "class=\"icon-button pointer delete-row\"/>" +
    "</td>\n";

    tableContent += "</tr>\n";
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
