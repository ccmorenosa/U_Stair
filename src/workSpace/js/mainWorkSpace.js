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
const fs = require("fs-extra");
const path = require("path");
const url = require("url");

// Modify flag.
var modify = false;

// Close button.
ipcMain.on("CLOSE", (event, value) => {

  if (modify) {
    var buttonClicked = dialog.showMessageBoxSync({
      title: "Cambios sin guardar",
      type: "question",
      buttons: ["Cancelar", "No guardar", "Guardar"],
      message: "Seguro desea continuar, se perderán los cambios no guardados."
    });

    if (buttonClicked == 1) {
    } else if (buttonClicked == 2 ) {
      if(saveDataBase()) {
        return;
      }
    } else {
      return;
    }

  }

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

// This event open a database.
ipcMain.on("FILE-NEW", (event, value) => {

  if (modify) {
    var buttonClicked = dialog.showMessageBoxSync({
      title: "Cambios sin guardar",
      type: "question",
      buttons: ["Cancelar", "No guardar", "Guardar"],
      message: "Seguro desea continuar, se perderán los cambios realizados."
    });

    if (buttonClicked == 1) {
    } else if (buttonClicked == 2 ) {
      if(saveDataBase()) {
        return;
      }
    } else {
      return;
    }

  }

  fs.removeSync(path.join(tempDir, "u_stair/temp.db"), {}, (err) => {
    if (err) {
      console.error(err);
    }
    console.log("suc");
  });

  welcomeWin.hide();

  processor.send("NEW", tempDir);
});

// This event open a database.
ipcMain.on("FILE-OPEN", (event, value) => {

  if (modify) {
    var buttonClicked = dialog.showMessageBoxSync({
      title: "Cambios sin guardar",
      type: "question",
      buttons: ["Cancelar", "No guardar", "Guardar"],
      message: "Seguro desea continuar, se perderán los cambios realizados."
    });

    if (buttonClicked == 1) {
    } else if (buttonClicked == 2 ) {
      if(saveDataBase()) {
        return;
      }
    } else {
      return;
    }

  }

  dialog.showOpenDialog({
    title: "Abrir malla",
    multiSelections: false,
    propertries: [
      "openFile"
    ]
  }).then( result => {
    if(!result.canceled) {
      fileName = result.filePaths[0];

      processor.send("OPEN", [tempDir, fileName]);

      welcomeWin.hide();
    }
  }).catch( err => {
    console.log(err);
  });

});

// This event save the database.
ipcMain.on("FILE-SAVE", (event, value) => {
  saveDataBase();
});

ipcMain.on("MODIFY", (event, value) => {
  modify = true;
});


/**
* This function save the database.
*/
function saveDataBase() {

  if (fileName == "") {
    var result = dialog.showSaveDialogSync({
      title: "Guardar malla",
      filters: [
        {name: "Malla", extensions: ["umsh"]}
      ],
      properties: [
        "createDirectory",
        "showOverwriteConfirmation"
      ]
    });

    if(result) {
      fileName = result;

      if (fileName.substring(fileName.length-5) != ".umsh") {
        fileName += ".umsh";
      }

      processor.send("FILE-SAVE", [tempDir, fileName]);
      modify = false;
    } else {
      console.log(result);
      return true;
    }

  } else {
    processor.send("FILE-SAVE", [tempDir, fileName]);
    modify = false;
  }

}
