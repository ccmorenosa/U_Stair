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
  // Fill the table headers.
  tableContent = "<tr>\n" +
  "<th class=\"right-border\">Código</th>\n" +
  "<th class=\"right-border\">Nombre</th>\n" +
  "<th class=\"right-border\">Créditos</th>\n" +
  "<th class=\"right-border\">Universidad</th>\n" +
  "<th class=\"right-border\">Sede</th>\n" +
  "<th class=\"right-border\">Facultad</th>\n" +
  "<th class=\"right-border\">Departamento</th>\n" +
  "<th class=\"right-border\">Programa</th>\n" +
  "<th>Borrar</th>\n" +
  "</tr>\n";

  // Fill the table content.
  for (var row in value) {
    var entries = value[row];
    tableContent += "<tr>\n" +
    "<td class=\"right-border\">" + entries.Codigo + "</td>\n" +
    "<td class=\"right-border\">" + entries.Nombre + "</td>\n" +
    "<td class=\"right-border\">" + entries.Creditos + "</td>\n" +
    "<td class=\"right-border\">" + entries.Universidad + "</td>\n" +
    "<td class=\"right-border\">" + entries.Sede + "</td>\n" +
    "<td class=\"right-border\">" + entries.Facultad + "</td>\n" +
    "<td class=\"right-border\">" + entries.Departamento + "</td>\n" +
    "<td class=\"right-border\">" + entries.Programa + "</td>\n" +
    "<td><img src=\"../../assets/icons-delete-50.svg\" " +
    "class=\"icon-button pointer\"/>" +
    "</td>\n";

    tableContent += "</tr>\n";
  }

  // Update table.
  table.innerHTML = tableContent;
});
