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

const {ipcRenderer, Menu} = require("electron");

// Variable of the status bar.
var statusBar = document.getElementById("status-bar");

// Event to update the estatus bar.
ipcRenderer.on("status", (event, value) => {
  statusBar.innerText = value;
});

// Tool bar icons
var tools = ["FILE-NEW", "FILE-OPEN", "FILE-SAVE"]

// Add events for all buttons.
for (var button of tools) {
  (function(action){
    document.getElementById(action).addEventListener("click",
    (event) => {
      ipcRenderer.send(action, null);
    });
  })(button)
}
