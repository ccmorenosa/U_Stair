/*
** UStair.  Grade curriculum schedule.
** Copyright (C) 2020  Cindy Catalina Moreno Sarria
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

// Tables.
var leftTable = document.getElementById("LEFT-TABLE");
var rightTable = document.getElementById("RIGHT-TABLE");

//
var subjectsAdded = {};

/**
* This function search the subjects by the name or code.
*/
function activeAddButtons() {
  var addButtons = document.getElementsByClassName("add-row");

  for (var button of addButtons) {
    button.addEventListener("click", (event) => {
      var parNode = event.target.parentElement.parentElement;

      var code = parNode.children[0].innerText;
      var name = parNode.children[1].innerText;

      subjectsAdded[code] = name;

      updateRightTable(subjectsAdded);
    });
  }
}

/**
* This function search the subjects by the name or code.
*/
function activeRemoveButtons() {
  var addButtons = document.getElementsByClassName("delete-row");

  for (var button of addButtons) {
    button.addEventListener("click", (event) => {
      var parNode = event.target.parentElement.parentElement;

      var code = parNode.children[0].innerText;

      delete subjectsAdded[code];

      updateRightTable(subjectsAdded);
    });
  }
}

ipcRenderer.send("FIND-SUBJECT", "");
