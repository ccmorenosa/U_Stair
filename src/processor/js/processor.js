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
const sqlite = require("sqlite3");
const path = require("path");
const fs = require("fs");

// Variable of the subject database.
var subjectDataBase;

// Create a new database in the temporal directory whenever the "NEW" button is
// clickced.
ipcRenderer.on("NEW", (event, value) => {
  // Send an event to update the status bar.
  ipcRenderer.send("status", "cargando base de datos");

  // Create the database in the temporal directory and connect.
  subjectDataBase = new sqlite.Database(
    path.join(value, "u_stair/Subjects/local.db"),
    (err) => {
      if (err) {
        return console.error(err.message);
      } else {
        console.log("Connected to database");
      }
    }
  );

  subjectDataBase.run("PRAGMA foreign_keys=ON;");

  // Create the subjects table and update table if it success.
  subjectDataBase.run(
    fs.readFileSync(path.join(__dirname,"../sql/Subjects.sql")).toString(),
    (err) => {
      if (err) {
        return console.error(err.message);
      } else {
        updateTable();
      }
    }
  );

  // Send an event to update the status bar,
  ipcRenderer.send("status", "listo");
});

// Event to creat a new row in the subjects table.
ipcRenderer.on("NEW-DB-SUBJECT-CREATED", (event, value) => {
  ipcRenderer.send("Agregando materia", "listo");

  // Add the new row, and update the table if the window if it success.
  subjectDataBase.run(
    "INSERT INTO Materias " +
    "(Codigo, Nombre, Creditos, Universidad, Sede," +
    " Facultad, Departamento, Programa) " +
    "VALUES (".concat(value) + ");",
    function (err) {
      if (err) {
        return console.error(err.message);
      } else{
        updateTable();
      }
    }
  );

  ipcRenderer.send("status", "listo");
});

// This event delete a subject in the database.
ipcRenderer.on("DELETE-DB-SUBJECT", (event, value) => {
  ipcRenderer.send("Eliminando materia", "listo");

  subjectDataBase.run(
    "DELETE FROM Materias WHERE Codigo=\"".concat(value) + "\";",
    function (err) {
      if (err) {
        return console.error(err.message);
      } else{
        updateTable();
      }
    }
  );

  ipcRenderer.send("status", "listo");
});

/**
* This function update the subjects table. It selects the contens of it with
* sql, and send an event with the table.
*/
function updateTable() {
  subjectDataBase.all("SELECT * FROM Materias;",
  function (err, table) {
    if (err) {
      return console.error(err.message);
    } else {
      ipcRenderer.send("UPDATE-SUBJECTS", table);
    }
  });
}
