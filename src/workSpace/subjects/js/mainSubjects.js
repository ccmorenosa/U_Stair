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
const path = require("path");
const url = require("url");

// This event create a new window to add a new subject to the database.
ipcMain.on("NEW-DB-SUBJECT", (event, value) => {
  if (formOpened) {
    return;
  }

  formOpened = true;

  workSpaceWindow.send("status", "Nueva materia");

  formWindow = new BrowserWindow({
    parent: workSpaceWindow,
    width: 350,
    height: 600,
    resizable: false,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the form.
  formWindow.loadURL(url.format({
    pathname: path.join(srcPath, "forms/newDbSubject/index.html"),
    protocol: "file:",
    slashes: true
  }));

  formWindow.on("close",  () => {
    formOpened = false;
    formWindow = null;
    workSpaceWindow.send("status", "Listo");
  });
});

// This event delete a subject in the database.
ipcMain.on("DELETE-DB-SUBJECT", (event, value) => {
  processor.send("DELETE-DB-SUBJECT", value);
});

// This event delete a subject in the database.
ipcMain.on("EDIT-DB-SUBJECT", (event, value) => {

  if (formOpened) {
    return;
  }

  formOpened = true;

  editingSubject = value;;

  workSpaceWindow.send("status", "Editando materia");

  formWindow = new BrowserWindow({
    width: 350,
    height: 600,
    resizable: false,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the form.
  formWindow.loadURL(url.format({
    pathname: path.join(srcPath, "forms/newDbSubject/index.html"),
    protocol: "file:",
    slashes: true
  }));

  formWindow.on("close",  () => {
    formOpened = false;
    formWindow = null;
    editingSubject = "";

    workSpaceWindow.send("status", "Listo");
  });

});

// This event will create a new subject to the database.
ipcMain.on("NEW-DB-SUBJECT-CREATED", (event, value) => {
  formWindow.close();
  processor.send("NEW-DB-SUBJECT-CREATED", value);
});

// This event will edit an old subject in the database.
ipcMain.on("OLD-DB-SUBJECT-EDITED", (event, value) => {
  var oldId = editingSubject;

  formWindow.close();

  processor.send("OLD-DB-SUBJECT-EDITED", [value, oldId]);
});

ipcMain.on("SEARCH-SUBJECT", (event, value) => {
  processor.send("SEARCH-SUBJECT", value);
});

// This event will update the database in the table of the subject database.
ipcMain.on("REFRESH-SUBJECT", (event, value) => {
  processor.send("REFRESH-SUBJECT", value);
});

// This event will update the database in the table of the subject database.
ipcMain.on("UPDATE-SUBJECTS", (event, value) => {
  workSpaceWindow.send("UPDATE-SUBJECTS", value);
});
