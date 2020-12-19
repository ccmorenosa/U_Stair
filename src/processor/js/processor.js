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
var dataBase;

// Create a new database in the temporal directory whenever the "NEW" button is
// clicked.
ipcRenderer.on("NEW", (event, value) => {
  // Send an event to update the status bar.
  ipcRenderer.send("status", "Cargando base de datos");

  // Create the database in the temporal directory and connect.
  dataBase = new sqlite.Database(
    path.join(value, "u_stair/temp.db"),
    (err) => {
      if (err) {
        return console.error(err.message);
      } else {
        console.log("Connected to database");
      }
    }
  );

  dataBase.run("PRAGMA foreign_keys=ON;");

  // Create the subjects table and update table if it success.
  dataBase.run(
    fs.readFileSync(path.join(__dirname,"../sql/Subjects.sql")).toString(),
    (err) => {
      if (err) {
        return console.error(err.message);
      } else {
        updateSubjectsTable();
      }
    }
  );

  // Send an event to update the status bar,
  ipcRenderer.send("status", "Listo");
});

// This event save the database in the path that the user specify.
ipcRenderer.on("FILE-SAVE", (event, value) => {
  ipcRenderer.send("status", "Guardando");

  fs.copyFile(path.join(value[0], "u_stair/temp.db"), value[1], (err) => {
    if (err) {
      return console.error(err.message);
    }
  });

  ipcRenderer.send("status", "Listo");
});

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
  ipcRenderer.send("Eliminando materia", "listo");

  dataBase.run(
    "DELETE FROM Materias WHERE Codigo=\"".concat(value) + "\";",
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
ipcRenderer.on("REFRESH-SUBJECT", (event, value) => {
  ipcRenderer.send("Actualizando tabla de materias", "listo");

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
      ipcRenderer.send("UPDATE-SUBJECTS", table);
    }
  });
}
