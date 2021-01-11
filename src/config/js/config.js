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

// Color blocks
var colorBlocks = document.getElementsByClassName("color-block");

/**
* This function close the form.
*/
function closeConfig() {
  ipcRenderer.send("CLOSE-CONFIG");
}

ipcRenderer.send("GET-CONFIG");

ipcRenderer.on("CONFIG-OBJ", (event, value) => {

  for (var i = 0; i < colorBlocks.length; i++) {
    colorBlocks[i].value = value.colors[i];
  }

});


/**
* This function update the colors for the schedule
*/
function updateColors() {

  var colors = [];

  for (var i = 0; i < colorBlocks.length; i++) {
    colors = colors.concat(colorBlocks[i].value);
  }

  ipcRenderer.send("UDATE-COLORS", colors);
}
