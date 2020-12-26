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

var form = document.getElementById("new-db-subject-form");

var isEditing = false;

/**
* This function submit the form to create a new subject in the database.
*/
function newDbSubject() {

  console.log("asdghfasdjfg");

  if (form.children[0].children["Codigo"].value == "" ||
  form.children[1].children["Materia"].value == "" ||
  form.children[7].children["Creditos"].value == "" ||
  form.children[3].children["Universidad"].value == "" ||
  form.children[4].children["Sede"].value == "" ||
  form.children[5].children["Facultad"].value == "" ||
  form.children[6].children["Departamento"].value == "") {
    return;
  }

  var data = [
    form.children[0].children["Codigo"].value,
    form.children[1].children["Materia"].value,
    form.children[7].children["Creditos"].value,
    form.children[3].children["Universidad"].value,
    form.children[4].children["Sede"].value,
    form.children[5].children["Facultad"].value,
    form.children[6].children["Departamento"].value,
    form.children[2].children["Programa"].value
  ];

  if (isEditing){
    ipcRenderer.send("OLD-DB-SUBJECT-EDITED", data);
  } else {

    data = data.map((value) => {
      return "\"" + value + "\"";
    });

    ipcRenderer.send("NEW-DB-SUBJECT-CREATED", data);
  }
}

ipcRenderer.send("SEARCH-DB-SUBJECT");

ipcRenderer.on("FILL-SPACES", (event, value) => {

  isEditing = true;

  console.log(value);

  form.children[0].children["Codigo"].value = value[0].Codigo;
  form.children[1].children["Materia"].value = value[0].Nombre;
  form.children[7].children["Creditos"].value = value[0].Creditos;
  form.children[3].children["Universidad"].value = value[0].Universidad;
  form.children[4].children["Sede"].value = value[0].Sede;
  form.children[5].children["Facultad"].value = value[0].Facultad;
  form.children[6].children["Departamento"].value = value[0].Departamento;
  form.children[2].children["Programa"].value = value[0].Programa;

});
