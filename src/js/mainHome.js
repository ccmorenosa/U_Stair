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
const path = require("path");
const url = require("url");

// This event get the event when the user wants to create a new database.
ipcMain.on("NEW", (event, value) => {
  makeWorkSpaceWindow ();

  welcomeWin.hide();

  processor.send("NEW", tempDir);
});

// This event get the event when the user wants to load an existing database.
ipcMain.on("OPEN", (event, value) => {

  dialog.showOpenDialog({
    title: "Abrir malla",
    multiSelections: false,
    propertries: [
      "openFile"
    ]
  }).then( result => {
    if(!result.canceled) {
      makeWorkSpaceWindow ();
      fileName = result.filePaths[0];

      processor.send("OPEN", [tempDir, fileName]);

      welcomeWin.hide();
    }
  }).catch( err => {
    console.log(err);
  });

});

// This event get the event when the user wants to change the program
// configuration.
ipcMain.on("SETTINGS", (event, value) => {
  // Create the browser window.
  configWindow = new BrowserWindow({
    parent: welcomeWin,
    width: 800,
    height: 600,
    frame: false,
    resizable: false,
    modal: true,
    webPreferences: {
      nodeIntegration: true,
    }
  });

  // and load the index.html of the workSpaceWindow.
  configWindow.loadURL(url.format({
    pathname: path.join(srcPath, "config/index.html"),
    protocol: "file:",
    slashes: true
  }));

  configWindow.on("close",  () => {
    configWindow = null;
  });
});

// This event will close the application.
ipcMain.on("EXIT", (event, value) => {
  welcomeWin.close();
});


/**
* This function create the workspace window.
*/
function makeWorkSpaceWindow() {
  fs.removeSync(path.join(tempDir, "u_stair/temp.db"), {}, (err) => {
    if (err) {
      console.error(err);
    }
  });

  // Create the browser window.
  workSpaceWindow = new BrowserWindow({
    parent: welcomeWin,
    width: 800,
    minWidth: 800,
    height: 600,
    minHeight: 600,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true
    }
  });

  workSpaceWindow.maximize();

  // and load the index.html of the workSpaceWindow.
  workSpaceWindow.loadURL(url.format({
    pathname: path.join(srcPath, "workSpace/subjects/index.html"),
    protocol: "file:",
    slashes: true
  }));

  workSpaceWindow.on("move", (event, value) => {
    if (workSpaceWindow.isMaximized()) {

      workSpaceWindow.send("UNMAXIMIZE");

    } else {

      workSpaceWindow.send("MAXIMIZE");

    }
  });

  workSpaceWindow.on("close",  () => {
    formOpened = false;
    workSpaceWindow = null;
    welcomeWin.show();
  });
}
