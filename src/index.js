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
const path = require("path");
const url = require("url");

const { app, BrowserWindow } = require('electron')

function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 300,
    minWidth: 300,
    maxWidth: 300,
    height: 400,
    minHeight: 400,
    maxHeight: 400,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // win.maximize();

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname,"index.html"),
    protocol: "file:",
    slashes: true
  }));

  // Open the DevTools.
  win.webContents.openDevTools();

  win.on("close",  () => {
    mainWin = null;
    processor = null;
    app.quit();
  });
}

app.whenReady().then(createWindow)
