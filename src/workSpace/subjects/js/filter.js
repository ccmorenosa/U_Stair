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

var filter = document.getElementById("filter");

function applyFilter() {
  var filterParams = {};

  for (var input of filter.children) {
    filterParams[input.children[1].id] = input.children[1].value;
  }
  ipcRenderer.send("SEARCH-SUBJECT", filterParams);
}
