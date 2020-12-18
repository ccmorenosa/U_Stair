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

const {app} = require("electron").remote;
const $ = require("jquery");
const path = require("path");
const url = require("url");

require("bootstrap");

let head = document.head;

let bootstrapLink = document.createElement("link");
let flatLink = document.createElement("link");

bootstrapLink.type = "text/css";
bootstrapLink.rel = "stylesheet";
bootstrapLink.href = url.format({
  pathname: path.join(app.getAppPath(), "node_modules/bootstrap/dist/css/bootstrap.min.css"),
  protocol: "file:",
  slashes: true
});

head.appendChild(bootstrapLink);

flatLink.type = "text/css";
flatLink.rel = "stylesheet";
flatLink.href = url.format({
  pathname: path.join(app.getAppPath(), "node_modules/designmodo-flat-ui/dist/css/flat-ui.min.css "),
  protocol: "file:",
  slashes: true
});

head.appendChild(flatLink);
