/*
** UStair.  Grade curriculum schedule.
** Copyright (C) 2020  Cindy Catalina Moreno Sarria
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
const path = require("path");
const url = require("url");

// This event create a new window to add a new subject to the database.
ipcMain.on("ADD-SEMESTER", (event, value) => {
  if (formOpened) {
    return;
  }

  formOpened = true;

  workSpaceWindow.send("status", "Agregando semestre");

  formWindow = new BrowserWindow({
    parent: workSpaceWindow,
    width: 800,
    height: 600,
    resizable: false,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the form.
  formWindow.loadURL(url.format({
    pathname: path.join(srcPath, "forms/addSemesterSchedule/index.html"),
    protocol: "file:",
    slashes: true
  }));

  formWindow.on("close",  () => {
    formOpened = false;
    formWindow = null;
    workSpaceWindow.send("status", "Listo");
  });
});

// This event will update the timetable.
ipcMain.on("GET-TIMETABLE", (event, value) => {
  processor.send("GET-TIMETABLE");
});

// This event will add the timetable.
ipcMain.on("UPDATE-TIMETABLE", (event, value) => {

  // Read the configuration file.
  fs.readJson(configFile, (err, configObj) => {
    if (err) {
      throw err;
    }

    workSpaceWindow.send("UPDATE-TIMETABLE", [configObj.colorsTimetable, value]);
  });

});
