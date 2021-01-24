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

const electron = require("electron");
const {app, BrowserWindow, ipcMain, dialog} = electron;
const fs = require("fs-extra");

// This event will close the form.
ipcMain.on("CLOSE-FORM", (event, value) => {
  formWindow.close();
  workSpaceWindow.send("status", "Listo");
});

// This event search for a subject.
ipcMain.on("SEARCH-DB-SUBJECT", (event, value) => {

  if (editingSubject){
    processor.send("SEARCH-DB-SUBJECT", editingSubject);
  } else {

    // Read the configuration file.
    fs.readJson(configFile, (err, configObj) => {
      if (err) {
        throw err;
      }

      formWindow.send("FILL-SPACES", [configObj.defaultsNewSubject, false]);

    });

  }

});

// This event fill the spaces in the form.
ipcMain.on("FILL-SPACES", (event, value) => {

  formWindow.send("FILL-SPACES", value.concat(true));

});

// This event get all the semesters and its subjects
ipcMain.on("GET-SEMESTERS-INFO", (event, value) => {
  processor.send("GET-SEMESTERS-INFO");

});

// This event send all the semesters and its subjects
ipcMain.on("SEND-SEMESTERS-INFO", (event, value) => {

  formWindow.send("SEND-SEMESTERS-INFO", value);

});

// This event update the schedule
ipcMain.on("TIMETABLE-DB", (event, value) => {
  formWindow.close();
  processor.send("TIMETABLE-DB", value);
});
