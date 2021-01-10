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
const path = require("path");
const url = require("url");

var semesterInfo;

// This event get all the semesters in the database.
ipcMain.on("GET-SEMESTERS", (event, value) => {
  processor.send("GET-SEMESTERS", value);
});

// This event will update the table of semesters.
ipcMain.on("UPDATE-SEMESTERS", (event, value) => {
  workSpaceWindow.send("UPDATE-SEMESTERS", value);
});

// This event add a semester in the database.
ipcMain.on("NEW-SEMESTER", (event, value) => {
  processor.send("NEW-SEMESTER", value);
});

// This event delete a semester in the database.
ipcMain.on("DELETE-SEMESTER", (event, value) => {
  processor.send("DELETE-SEMESTER", value);
});

// This event add a subject in a semester.
ipcMain.on("NEW-SEMESTER-SUBJECT", (event, value) => {
  if (formOpened) {
    return;
  }

  formOpened = true;

  semesterInfo = value;

  workSpaceWindow.send("status", "Configurando semestre");

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
    pathname: path.join(srcPath, "forms/addSubject/index.html"),
    protocol: "file:",
    slashes: true
  }));

  formWindow.on("close",  () => {
    formOpened = false;
    formWindow = null;
    workSpaceWindow.send("status", "Listo");
  });
  // processor.send("NEW-SEMESTER-SUBJECT", value);
});

// This event search the subjects by the name or code.
ipcMain.on("FIND-SUBJECT", (event, value) => {
  processor.send("FIND-SUBJECT", value);
});

// This event refresh the left table of the form.
ipcMain.on("UPDATE-LEFT-TABLE", (event, value) => {
  formWindow.send("UPDATE-LEFT-TABLE", value);
});

ipcMain.on("GET-SEMESTER-INFO", (event, value) => {
  formWindow.send("SET-SEMESTER", semesterInfo[0]);
  formWindow.send("UPDATE-RIGHT-TABLE", semesterInfo[1]);
});

ipcMain.on("ADD-SUBJECTS", (event, value) => {
  formWindow.close();
  processor.send("ADD-SUBJECTS", value);
});
