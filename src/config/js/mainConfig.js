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

ipcMain.on("CLOSE-CONFIG", (event, value) => {
  configWindow.close();
});

ipcMain.on("GET-CONFIG", (event, value) => {

  // Read the configuration file.
  fs.readJson(configFile, (err, configObj) => {
    if (err) {
      throw err;
    }

    configWindow.send("CONFIG-OBJ", configObj);
  });

});

ipcMain.on("UDATE-COLORS", (event, value) => {

  // Read the configuration file.
  fs.readJson(configFile, (err, configObj) => {
    if (err) {
      throw err;
    }

    configObj.colors = value;


    fs.writeJsonSync(configFile,
      configObj,
      {
        "spaces": "\t",
        "EOL": "\n"
      },
      (wErr) => {

      if (wErr) {
        throw wErr;
      }

    });

  });

});
