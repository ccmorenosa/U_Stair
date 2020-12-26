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
var actualFilter = {"programa": ""};

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

  ipcRenderer.send("MODIFY");

  ipcRenderer.send("status", "Listo");
});

// Event to edit an old row in the subjects table.
ipcRenderer.on("OLD-DB-SUBJECT-EDITED", (event, value) => {
  ipcRenderer.send("status", "Agregando materia");

  var sqlQuery = "UPDATE Materias SET Codigo=\""+ value[0][0] +
  "\", Nombre=\"" + value[0][1] +
  "\", Creditos=" + value[0][2] +
  ", Universidad=\"" + value[0][3] +
  "\", Sede=\"" + value[0][4] +
  "\", Facultad=\"" + value[0][5] +
  "\", Departamento=\"" + value[0][6] +
  "\", Programa=\"" + value[0][7] + "\" WHERE Codigo=\"" + value[1] + "\";";

  console.log(sqlQuery);

  // Add the new row, and update the table if the window if it success.
  dataBase.run(sqlQuery,
    function (err) {
      if (err) {
        return console.error(err.message);
      } else{
        updateSubjectsTable();
      }
    }
  );

  ipcRenderer.send("MODIFY");

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
        updateFilteredSubjectsTable(actualFilter);
      }
    }
  );

  ipcRenderer.send("MODIFY");

  ipcRenderer.send("status", "Listo");
});

// This event delete a subject in the database.
ipcRenderer.on("SEARCH-SUBJECT", (event, value) => {
  ipcRenderer.send("status", "Buscando materias");

  actualFilter = value;
  updateFilteredSubjectsTable(actualFilter);

  ipcRenderer.send("status", "Listo");
});

// This event delete a subject in the database.
ipcRenderer.on("REFRESH-SUBJECT", (event, value) => {
  ipcRenderer.send("status", "Actualizando tabla de materias");

  updateSubjectsTable();

  ipcRenderer.send("status", "Listo");
});

// This event search a subject in the database.
ipcRenderer.on("SEARCH-DB-SUBJECT", (event, value) => {
  dataBase.all("SELECT * FROM Materias WHERE Codigo=\"" + value + "\";",
  function (err, table) {
    if (err) {
      return console.error(err.message);
    } else {
      ipcRenderer.send("FILL-SPACES", table);
    }
  });

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
* This Function search filtered data
*/
function updateFilteredSubjectsTable(filters) {
  var search = "SELECT * FROM Materias WHERE ";
  var prev = false;

  if (filters.materia){
    search += "(Nombre LIKE \"%" + filters.materia +
    "%\" OR Codigo LIKE \"%" + filters.materia + "%\") ";
    prev = true;
  }

  if (filters.universidad){
    search += joinPrev(prev);
    search += "Universidad LIKE \"%" + filters.universidad + "%\" ";
    prev = true;
  }

  if (filters.sede){
    search += joinPrev(prev);
    search += "Sede LIKE \"%" + filters.sede + "%\" ";
    prev = true;
  }

  if (filters.facultad){
    search += joinPrev(prev);
    search += "Facultad LIKE \"%" + filters.facultad + "%\" ";
    prev = true;
  }

  search += joinPrev(prev);
  search += "Programa LIKE \"%" + filters.programa + "%\" ";
  prev = true;

  if (filters.creditos){
    search += joinPrev(prev);
    search += "Creditos=\"" + filters.creditos + "\" ";
  }

  search += ";";

  dataBase.all(search,
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
