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

// Declare all windows.
global.welcomeWin = null;
global.workSpaceWindow = null;
global.configWindow = null;
global.formWindow = null;
global.processor = null;

// Declare important dirs.
global.tempDir = app.getPath("temp");
global.srcPath = path.join(app.getAppPath(),"src");
global.dataDir = app.getPath("userData");

// Declare the variable for the configuration file.
global.configFile = path.join(dataDir, "config.json");

// File name
global.fileName = "";

// Bool for opened forms.
global.formOpened = false;

// Variable for editing a subject.
global.editingSubject = "";

require("./js/mainHome");
require("./forms/js/mainForms");
require("./config/js/mainConfig");
require("./workSpace/js/mainWorkSpace");
require("./workSpace/subjects/js/mainSubjects");
require("./workSpace/planning/js/mainSemester");
require("./workSpace/schedule/js/mainSchedule");

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

  // Create the data directory if it does not exists.
  fs.pathExistsSync(dataDir, (err, exists) => {
    if (err) {
      throw err;
    }

    if (!exists) {
      fs.mkdirSync(dataDir, (dErr) => {
        if (dErr) {
          throw dErr;
        }
      });
    }
  });

  // Crete the configuration file if it does not exists.
  fs.pathExists(configFile, (err, exists) => {
    if (err) {
      throw err;
    }

    if (!exists) {
      var config = {
        "colors": [
          "#f1c40f",
          "#1abc9c",
          "#d35400",
          "#9b59b6",
          "#34495e",
          "#2ecc71",
          "#3498db",
          "#e67e22",
          "#e74c3c",
          "#95a5a6"
        ]
      };

      fs.writeJsonSync(configFile,
        config,
        {
          "spaces": "\t",
          "EOL": "\n"
        },
        (wErr) => {

        if (wErr) {
          throw wErr;
        }

      });
    }

  });

  // Define temporal dir.
  fs.mkdir(path.join(tempDir, "/u_stair"), { recursive: true },
  (err) => {
    if (err) {
      throw err;
    }
  });

  // Open the DevTools.
  // welcomeWin.webContents.openDevTools();
  processor.webContents.openDevTools();

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
