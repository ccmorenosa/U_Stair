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
const fs = require("fs");

// Declare all windows
var welcomeWin;
var workSpaceWindow;
var formWindow;
var processor;

// Declare important dirs
var tempDir;

function createWindow () {
  // Create the welcome window.
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

  // Define temporal dir
  tempDir = app.getPath("temp");
  fs.mkdir(path.join(tempDir, "/u_stair/Subjects"), { recursive: true },
  (err) => {
    if (err) {
      throw err
    };
  });

  // Open the DevTools.
  welcomeWin.webContents.openDevTools();
  processor.webContents.openDevTools();

  welcomeWin.on("close",  () => {
    fs.rmdir(path.join(tempDir, "/u_stair"), { recursive: true }, (err) => {
      if (err) {
        throw err
      };
    });
    app.quit();
  });
}

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (welcomeWin) {
      if (welcomeWin.isMinimized()) {
        welcomeWin.restore()
      };
      welcomeWin.focus();
    }
  })

  // Create myWindow, load the rest of the app, etc...
  app.whenReady().then(createWindow);
}

ipcMain.on("NEW", (event, value) => {
  // Create the browser window.
  workSpaceWindow = new BrowserWindow({
    width: 800,
    minWidth: 800,
    height: 600,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true
    }
  })

  workSpaceWindow.maximize();

  // and load the index.html of the workSpaceWindow.
  workSpaceWindow.loadURL(url.format({
    pathname: path.join(__dirname,"workSpace/Subjects/index.html"),
    protocol: "file:",
    slashes: true
  }));

  workSpaceWindow.webContents.openDevTools();
  workSpaceWindow.on("close",  () => {
    workSpaceWindow=null;
    welcomeWin.show();
  });

  welcomeWin.hide();

  processor.send("NEW", tempDir);
});

ipcMain.on("OPEN", (event, value) => {
  dialog.showOpenDialog({
    title: "Abrir malla",
    propertries: [
      "openFile"
    ]
  }).then(result => {
    if(!result.canceled) {
      // welcomeWin.hide();
    }
  }).catch(err => {
    console.log(err)
  });
  // welcomeWin.hide();
});

ipcMain.on("SETTINGS", (event, value) => {
  console.log("GETTED");
});

ipcMain.on("EXIT", (event, value) => {
  welcomeWin.close();
});

ipcMain.on("NEW-DB-SUBJECT", (event, value) => {
  workSpaceWindow.send("status", "nueva materia");

  formWindow = new BrowserWindow({
    width: 300,
    height: 400,
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  formWindow.loadURL(url.format({
    pathname: path.join(__dirname,"forms/newDbSubject/index.html"),
    protocol: "file:",
    slashes: true
  }));

  formWindow.on("close",  () => {
    formWindow=null;
    workSpaceWindow.send("status", "listo");
  });
});

ipcMain.on("NEW-DB-SUBJECT-CREATED", (event, value) => {
  formWindow.close();
  processor.send("NEW-DB-SUBJECT-CREATED", value);
});

ipcMain.on("UPDATE-SUBJECTS", (event, value) => {
  workSpaceWindow.send("UPDATE-SUBJECTS", value);
});

ipcMain.on("status", (event, value) => {
  workSpaceWindow.send("status", value);
});
