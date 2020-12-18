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

// Variable of the status bar.
var statusBar = document.getElementById("status-bar");

// Event to update the estatus bar.
ipcRenderer.on("status", (event, value) => {
  statusBar.innerText = value;
});

// Window buttons
var winButtons = ["ICONIZE", "MAXIMIZE", "CLOSE"];

// Tool bar icons
var tools = ["FILE-NEW", "FILE-OPEN", "FILE-SAVE"];

// Add events for all buttons.
activateButtons(winButtons);
activateButtons(tools);

// Maximize button
maximizeIcon = document.getElementById("MAXIMIZE").children[0];

ipcRenderer.on("MAXIMIZE", (event, value) => {
  maximizeIcon.classList.remove("fui-window");
  maximizeIcon.classList.add("fui-windows");
});

ipcRenderer.on("UNMAXIMIZE", (event, value) => {
  maximizeIcon.classList.add("fui-window");
  maximizeIcon.classList.remove("fui-windows");
});
