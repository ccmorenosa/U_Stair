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
const fs = require("fs-extra");

// Variable of the subject database.
var dataBase;

// Create a new database in the temporal directory whenever the "NEW" button is
// clicked.
ipcRenderer.on("NEW", (event, value) => {
  // Send an event to update the status bar.
  ipcRenderer.send("status", "Cargando base de datos");

  connectDatabase(path.join(value, "u_stair/temp.db"));

  dataBase.run("PRAGMA foreign_keys=ON;");

  // Create the subjects table and update table if it success.
  dataBase.run(
    fs.readFileSync(path.join(__dirname,"../sql/subjects.sql")).toString(),
    (err) => {
      if (err) {
        return console.error(err.message);
      } else {
        updateSubjectsTable();
      }
    }
  );

  // Create the subjects table and update table if it success.
  dataBase.run(
    fs.readFileSync(path.join(__dirname,"../sql/semester.sql")).toString(),
    (err) => {
      if (err) {
        return console.error(err.message);
      } else {

        dataBase.run(
          "INSERT INTO Semestre (Numero, Materias) " +
          "VALUES (1, \'{}\');",
          (err) => {
            if (err) {
              return console.error(err.message);
            }
          }
        );

      }
    }
  );

  // Send an event to update the status bar,
  ipcRenderer.send("status", "Listo");
});

// This event open the given database.
ipcRenderer.on("OPEN", (event, value) => {
  // Send an event to update the status bar.
  ipcRenderer.send("status", "Cargando base de datos");

  fs.copyFile(value[1], path.join(value[0], "u_stair/temp.db"), (err) => {
    if (err) {
      return console.error(err.message);
    }
  });

  connectDatabase(path.join(value[0], "u_stair/temp.db"));

  ipcRenderer.send("status", "Actualizando tabla de materias");
  updateSubjectsTable();

  ipcRenderer.send("status", "Actualizando tabla de semestres");
  updateSemesterTable();

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


/**
* This function connect to the database.
*/
function connectDatabase(databasePath) {
  // Create the database in the temporal directory and connect.
  dataBase = new sqlite.Database(databasePath,
    (err) => {
      if (err) {
        return console.error(err.message);
      } else {
        console.log("Connected to database");
      }
    }
  );
}
