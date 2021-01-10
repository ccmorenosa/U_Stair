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

// Event to update the semester timetable in the database.
ipcRenderer.on("TIMETABLE-DB", (event, value) => {
  ipcRenderer.send("status", "Actualizando horario");

  var sqlQuery = "UPDATE Horario SET Info=\'" + JSON.stringify(value) +
  "\' WHERE id=1;";

  dataBase.run(sqlQuery,
    (err) => {
      if (err) {
        return console.error(err.message);
      }
    }
  );

  updateTimetable();

  ipcRenderer.send("MODIFY");

  ipcRenderer.send("status", "Listo");
});


// Event to update the semester timetable in the window.
ipcRenderer.on("GET-TIMETABLE", (event, value) => {
  ipcRenderer.send("status", "Actualizando horario");

  updateTimetable();

  ipcRenderer.send("status", "Listo");
});

/**
* This function update the timetable table.
*/
function updateTimetable() {
  dataBase.all("SELECT * FROM Horario;",
  function (err, table) {
    if (err) {
      return console.error(err.message);
    } else {
      ipcRenderer.send("UPDATE-TIMETABLE", table);
    }
  });
}
