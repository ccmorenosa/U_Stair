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

// Declare all windows.
global.welcomeWin;
global.workSpaceWindow;
global.formWindow;
global.processor;

// Declare important dirs.
global.tempDir;
global.srcPath = path.join(app.getAppPath(),"src");

// File name
var fileName = "";

require("./js/main_home");
require("./workSpace/js/main_workSpace");
require("./workSpace/subjects/js/main_worksubjects");

/**
* This function creates the main window, that will be shown in the middle of the
* screen.
*
* It also will create the processor that will most of the process of the
* application and the database.
*/
function createWindow () {
  // Create the welcome window.
  welcomeWin = new BrowserWindow({
    width: 300,
    height: 400,
    resizable: false,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  welcomeWin.loadURL(url.format({
    pathname: path.join(srcPath, "index.html"),
    protocol: "file:",
    slashes: true
  }));

  // Create processor window, it will not be visible.
  processor = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // Load the processor window.
  processor.loadURL(url.format({
    pathname: path.join(srcPath, "processor/processor.html"),
    protocol: "file:",
    slashes: true
  }));

  // Define temporal dir.
  tempDir = app.getPath("temp");
  fs.mkdir(path.join(tempDir, "/u_stair"), { recursive: true },
  (err) => {
    if (err) {
      throw err;
    }
  });

  // Open the DevTools.
  welcomeWin.webContents.openDevTools();
  // processor.webContents.openDevTools();

  welcomeWin.on("close",  () => {
    fs.rmdir(path.join(tempDir, "/u_stair"), { recursive: true }, (err) => {
      if (err) {
        throw err;
      }
    });
    app.quit();
  });
}

// This avoid to open most that one window.
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (welcomeWin) {
      if (welcomeWin.isMinimized()) {
        welcomeWin.restore();
      }
      welcomeWin.focus();
    }
  });

  // Create myWindow, load the rest of the app, etc...
  app.whenReady().then(createWindow);
}

// This event update the status bar.
ipcMain.on("status", (event, value) => {
  workSpaceWindow.send("status", value);
});
