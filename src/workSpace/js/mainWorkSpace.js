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
const {ipcMain, dialog} = electron;

// Close button.
ipcMain.on("CLOSE", (event, value) => {
  workSpaceWindow.close();
});

// Maixmize-minimize button.
ipcMain.on("MAXIMIZE", (event, value) => {
  if (workSpaceWindow.isMaximized()) {

    workSpaceWindow.unmaximize();
    workSpaceWindow.send("UNMAXIMIZE");

  } else {

    workSpaceWindow.maximize();
    workSpaceWindow.send("MAXIMIZE");

  }
});

// Iconize button.
ipcMain.on("ICONIZE", (event, value) => {
  workSpaceWindow.minimize();
});

// This event save the database.
ipcMain.on("FILE-SAVE", (event, value) => {
  if (fileName == "") {
    dialog.showSaveDialog({
      title: "Guardar malla",
      filters: [
        {name: "Malla", extensions: ["umsh"]}
      ],
      propertries: [
        "createDirectory",
        "showOverwriteConfirmation"
      ]
    }).then(result => {
      if(!result.canceled) {
        fileName = result.filePath;

        if (fileName.substring(fileName.length-5) != ".umsh") {
          fileName += ".umsh";
        }

        processor.send("FILE-SAVE", [tempDir, fileName]);
      }
    }).catch(err => {
      console.log(err);
    });
  } else {
    processor.send("FILE-SAVE", [tempDir, fileName]);
  }
});
