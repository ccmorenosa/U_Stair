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

const {ipcRenderer} = require("electron");

var form = document.getElementById("new-db-subject-form");

/**
* This function submit the form to create a new subject in the database.
*/
function newDbSubject() {

  var data = [
    form.children["Codigo"].value,
    form.children["Materia"].value,
    form.children["Programa"].value,
    form.children["Universidad"].value,
    form.children["Sede"].value,
    form.children["Facultad"].value,
    form.children["Departamento"].value,
    form.children["Creditos"].value];

  data = data.map((value) => {
    return "\"" + value + "\"";
  });

  ipcRenderer.send("NEW-DB-SUBJECT-CREATED", data);
}
