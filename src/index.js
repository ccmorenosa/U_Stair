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

// Define all windows
var welcomeWin;
var mainWin;
var processor;

function createWindow () {
  // Create the browser window.
  welcomeWin = new BrowserWindow({
    width: 300,
    height: 400,
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  welcomeWin.loadURL(url.format({
    pathname: path.join(__dirname,"index.html"),
    protocol: "file:",
    slashes: true
  }));

  // Create processor window, it will not be visible
  processor = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // Load the processor window
  processor.loadURL(url.format({
    pathname: path.join(__dirname,"processor/processor.html"),
    protocol: "file:",
    slashes: true
  }));

  // Open the DevTools.
  welcomeWin.webContents.openDevTools();

  welcomeWin.on("close",  () => {
    app.quit();
  });
}

app.whenReady().then(createWindow);

ipcMain.on("NEW", (event, value) => {
  dialog.showSaveDialog({
    title: "Nueva malla",
    filters: { name: 'Malla curricular', extensions: ['umesh'] }
  }).then(result => {
    if(!result.canceled) {
      console.log(result.filePath);
      // welcomeWin.hide();
    }
  }).catch(err => {
    console.log(err)
  });
});

ipcMain.on("OPEN", function (event, value) {
  dialog.showOpenDialog({
    title: "Abrir malla",
    propertries: [
      "openFile"
    ]
  }).then(result => {
    if(!result.canceled) {
      welcomeWin.hide();
    }
  }).catch(err => {
    console.log(err)
  });
  // welcomeWin.hide();
});

ipcMain.on("SETTINGS", function (event, value) {
  console.log("GETTED");
});

ipcMain.on("EXIT", function (event, value) {
  welcomeWin.close();
});
