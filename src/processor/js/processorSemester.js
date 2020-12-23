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

var semestersCount = 1;

// This event updtae the semesters table.
ipcRenderer.on("GET-SEMESTERS", (event, value) => {
  ipcRenderer.send("status", "Actualizando tabla de semestres");

  updateSemesterTable();

  ipcRenderer.send("status", "Listo");
});

/**
* This function update the semesters table. It selects the contents of it with
* SQL, and send an event with the table.
*/
function updateSemesterTable() {
  dataBase.all("SELECT * FROM Semestre;",
  function (err, table) {
    if (err) {
      return console.error(err.message);
    } else {
      ipcRenderer.send("UPDATE-SEMESTERS", table);
    }
  });
}

// This event add a semester in the database.
ipcRenderer.on("NEW-SEMESTER", (event, value) => {
  ipcRenderer.send("status", "Agregando semestre");

  semestersCount++;

  dataBase.run(
    "INSERT INTO Semestre (Numero, Materias) " +
    "VALUES (" + semestersCount + ", \'{}\');",
    (err) => {
      if (err) {
        return console.error(err.message);
      }
    }
  );

  ipcRenderer.send("status", "Actualizando tabla de semestres");

  updateSemesterTable();

  ipcRenderer.send("MODIFY");

  ipcRenderer.send("status", "Listo");
});

// This event delete a semester in the database.
ipcRenderer.on("DELETE-SEMESTER", (event, value) => {
  if (semestersCount == 0) {
    return;
  }

  ipcRenderer.send("status", "Agregando semestre");

  dataBase.run(
    "DELETE FROM Semestre WHERE Numero=" +
    semestersCount + ";",
    (err) => {
      if (err) {
        return console.error(err.message);
      }
    }
  );

  semestersCount--;

  ipcRenderer.send("status", "Actualizando tabla de semestres");

  updateSemesterTable();

  ipcRenderer.send("MODIFY");

  ipcRenderer.send("status", "Listo");
});

ipcRenderer.on("ADD-SUBJECTS", (event, value) => {
  ipcRenderer.send("status", "Agregando materias");

  console.log(JSON.stringify(value[1]));

  var sqlQuery = "UPDATE Semestre SET Materias=\'" + JSON.stringify(value[1]) +
  "\' WHERE Numero=" + parseInt(value[0]) + ";";

  console.log(sqlQuery);

  dataBase.run(sqlQuery,
    (err) => {
      if (err) {
        return console.error(err.message);
      }
    }
  );

  ipcRenderer.send("status", "Actualizando tabla de semestres");

  updateSemesterTable();

  ipcRenderer.send("MODIFY");

  ipcRenderer.send("status", "Listo");
});

ipcRenderer.on("FIND-SUBJECT", (event, value) => {
  search = "SELECT Codigo, Nombre FROM Materias WHERE " +
  "(Nombre LIKE \"%" + value +
  "%\" OR Codigo LIKE \"%" + value + "%\") ";

  dataBase.all(search,
  (err, table) => {
    if (err) {
      return console.error(err.message);
    } else {
      ipcRenderer.send("UPDATE-LEFT-TABLE", table);
    }
  });
});
