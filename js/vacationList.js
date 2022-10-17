"use strict"
/*
* File Name : vacationList.js
* Description :Display all vacation plans from the VacationPlan class
* Organization/Team: Team 145, Monash University, ENG1003 - Engineering Mobile Apps
* Author: HuangGuoYueYang
* Last Modified: 14/10/2021
*/

// Retrieve the vacation list from LS and Update the number of vacations
let vacationList = retrieveLSData("vacationList");
console.log(vacationList);
updateLSData("vacationNum", vacationList._vacationList.length);

/**
 * @function displayVacationList
 * retrieve all the vacation plans in the vacationList in LS
 * display all the info in page
 */
function displayVacationList() {
  for (let i = vacationList._vacationList.length - 1; i >= 0; i--) {
    let plan = vacationList._vacationList[i];

    let name = plan["_vacationName"];
    let date = plan["_vacationDate"];
    let startingLocation = plan["_startLocation"];
    let vehicleType = plan["_vehicleType"]["name"] + " " + plan["_vehicleType"]["range"] + " km";
    let totalDistance = plan["_totalDistance"] + " km";
    let numberOfStops = plan["_numberOfStops"];

    // Store 1 set of data in an array
    let data = [name, date, startingLocation, vehicleType, totalDistance, numberOfStops];

    // Create table for the vacationList when a new plan is adding
    let table = document.getElementById("planList");
    let tr = document.createElement("tr");
    for (let j = 0; j < data.length + 1; j++) {
      let td = document.createElement("td");
      if (j < data.length) {
        td.innerHTML = data[j];
      } else {
        td.innerHTML = `<button class="detailBtn" id="btn_${i}" onclick="jumpToDetail(this);">show detail</button>`;
      }
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
};

/**
 * @function sortByDate
 * Sort all vacation plan based on starting date
 * @param {any} VacationList
 */
const sortByDate = vacationList => {
  const sorter = (a, b) => {
    return new Date(a._vacationDate).getTime() - new Date(b._vacationDate).getTime();
  }
  vacationList.sort(sorter);
}

/**
 * @function saveAllLineObjects
 * Save all the coordinates on the route
 */
function saveAllLineObjects() {
  let lineObjects = {};
  for (let i = 0; i < vacationList._vacationList.length; i++) {
    let obj = vacationList._vacationList[i]._lineObject[0];
    lineObjects[i] = obj;
  }
  console.log(lineObjects);
  // Update the data in LS
  updateLSData("lineObjects", lineObjects);
}

/**
 * @function jumpToDetail
 * Store the corresponding vacation information into LS
 * Retrieve the information and display when click on showDetail
 */
function jumpToDetail(obj) {
  let idx = parseInt(obj.id[obj.id.length - 1]);
  updateLSData("detailIndex", idx);
  updateLSData("vacationPlan", vacationList._vacationList[idx]);
  window.location = "vacationDetail.html";
}

// Display the vacation list
displayVacationList();