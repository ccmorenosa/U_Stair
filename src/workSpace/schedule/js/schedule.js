/*
** UStair.  Grade curriculum schedule.
** Copyright (C) 2020  Cindy Catalina Moreno Sarria
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

// Activate subject tab tools.
var scheduleTools = ["ADD-SEMESTER"];
activateButtons(scheduleTools);

// Color pallete
var colors;

// Week days

weekDays = {
  "Lunes": document.getElementById("Lunes"),
  "Martes": document.getElementById("Martes"),
  "Miercoles": document.getElementById("Miercoles"),
  "Jueves": document.getElementById("Jueves"),
  "Viernes": document.getElementById("Viernes"),
  "Sabado": document.getElementById("Sabado"),
  "Domingo": document.getElementById("Domingo")
};

ipcRenderer.send("GET-TIMETABLE");

// This event will add the timetable.
ipcRenderer.on("UPDATE-TIMETABLE", (event, value) => {
  colors = value[0];

  for (var weekDay in weekDays) {
    weekDays[weekDay].innerHTML = "";
  }

  var timetable = JSON.parse(value[1][0].Info);

  var count = 0;

  for (var subject in timetable) {
    var subjectName = timetable[subject][0];

    for (var i = 1; i < timetable[subject].length; i++) {
      var weekDayUl = weekDays[timetable[subject][i][0]];

      var width = weekDayUl.offsetWidth;

      weekDayUl.innerHTML += "<li class=\"text-weight-bold\" style=\"width:" + width +
      "px; height: " + (50 * (parseInt(timetable[subject][i][2]) - parseInt(timetable[subject][i][1]))) + "px; " +
      "top: " + (50 * (1 + parseInt(timetable[subject][i][1]))) + "px; " +
      "background:" + colors[count%10] + "\">" +
      subjectName + "<br />" + "Código:" + subject +
      "</li>";
    }

    count++;
  }

});
