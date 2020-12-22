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

// Actual table
var subjectsTable = null;

// Event to create a new row in the subjects table.
ipcRenderer.on("NEW-DB-SUBJECT-CREATED", (event, value) => {
  ipcRenderer.send("status", "Agregando materia");

  // Add the new row, and update the table if the window if it success.
  dataBase.run(
    "INSERT INTO Materias " +
    "(Codigo, Nombre, Creditos, Universidad, Sede," +
    " Facultad, Departamento, Programa) " +
    "VALUES (".concat(value) + ");",
    function (err) {
      if (err) {
        return console.error(err.message);
      } else{
        updateSubjectsTable();
      }
    }
  );

  ipcRenderer.send("status", "Listo");
});

// This event delete a subject in the database.
ipcRenderer.on("DELETE-DB-SUBJECT", (event, value) => {
  ipcRenderer.send("status", "Eliminando materia");

  dataBase.run(
    "DELETE FROM Materias WHERE Codigo=\"".concat(value) + "\";",
    function (err) {
      if (err) {
        return console.error(err.message);
      } else{
        ipcRenderer.send("UPDATE-SUBJECTS", subjectsTable);
      }
    }
  );

  ipcRenderer.send("status", "Listo");
});

// This event delete a subject in the database.
ipcRenderer.on("SEARCH-SUBJECT", (event, value) => {
  ipcRenderer.send("status", "Buscando materias");

  var search = "SELECT * FROM Materias WHERE ";
  var prev = false;

  if (value["materia"] != ""){
    search += "(Nombre LIKE \"%" + value["materia"] +
    "%\" OR Codigo LIKE \"%" + value["materia"] + "%\") ";
    prev = true;
  }

  if (value["universidad"] != ""){
    search += joinPrev(prev);
    search += "Universidad LIKE \"%" + value["universidad"] + "%\" ";
    prev = true;
  }

  if (value["sede"] != ""){
    search += joinPrev(prev);
    search += "Sede LIKE \"%" + value["sede"] + "%\" ";
    prev = true;
  }

  if (value["facultad"] != ""){
    search += joinPrev(prev);
    search += "Facultad LIKE \"%" + value["facultad"] + "%\" ";
    prev = true;
  }

  search += joinPrev(prev);
  search += "Programa =\"" + value["programa"] + "\" ";
  prev = true;

  if (value["creditos"] != ""){
    search += joinPrev(prev);
    search += "Creditos=\"" + value["creditos"] + "\" ";
  }

  search += ";";

  console.log(search);

  dataBase.all(search,
  function (err, table) {
    if (err) {
      return console.error(err.message);
    } else {
      subjectsTable = table;
      ipcRenderer.send("UPDATE-SUBJECTS", subjectsTable);
    }
  });

  ipcRenderer.send("status", "Listo");
});

// This event delete a subject in the database.
ipcRenderer.on("REFRESH-SUBJECT", (event, value) => {
  ipcRenderer.send("status", "Actualizando tabla de materias");

  updateSubjectsTable();

  ipcRenderer.send("status", "Listo");
});

/**
* This function update the subjects table. It selects the contents of it with
* SQL, and send an event with the table.
*/
function updateSubjectsTable() {
  dataBase.all("SELECT * FROM Materias;",
  function (err, table) {
    if (err) {
      return console.error(err.message);
    } else {
      subjectsTable = table;
      ipcRenderer.send("UPDATE-SUBJECTS", subjectsTable);
    }
  });
}


/**
* This function check if there is a previous search parameter.
*/
function joinPrev(prev) {
  if (prev) {
    return "AND ";
  } else {
    return "";
  }
}
