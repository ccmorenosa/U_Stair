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

var subjectDataBase;

ipcRenderer.on("NEW", (event, value) => {
  ipcRenderer.send("status", "cargando base de datos");

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

  ipcRenderer.send("status", "listo");
});

ipcRenderer.on("NEW-DB-SUBJECT-CREATED", (event, value) => {
  subjectDataBase.run(
    "INSERT INTO Materias " +
    "(Codigo, Nombre, Creditos, Universidad, Sede," +
    " Facultad, Departamento, Programa) " +
    "VALUES (".concat(value) + ");",
    function (err) {
      if (err) {
        return console.error(err.message);
      }
    }
  );

  updateTable();

  ipcRenderer.send("status", "listo");
});

function updateTable() {
  subjectDataBase.all("SELECT * FROM Materias;",
  function (err, table) {
    if (err) {
      return console.error(err.message);
    }
    ipcRenderer.send("UPDATE-SUBJECTS", table);
  });
}
