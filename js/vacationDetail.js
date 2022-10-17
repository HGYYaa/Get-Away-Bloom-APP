"use strict"
/*
* File Name : vacationDetail.js
* Description : Vacation Planned Details and Route Display
* Organization/Team: Team 145, Monash University, ENG1003 - Engineering Mobile Apps
* Author: HuangGuoYueYang
* Last Modified: 14/10/2021
*/

// Initialization
let POIMarker = null;
let POIPopup = null;

// Retrieve the data from vacationPlan
let vacationPlan = retrieveLSData("vacationPlan");
console.log(vacationPlan);

// Retrieve index and all vacation information, store in locationInfo for 1 vacation
let detailIndex = retrieveLSData("detailIndex");
let allLocationInfo = retrieveLSData("allLocationInfo");
let locationInfo = allLocationInfo[detailIndex];
console.log("locationInfo");
console.log(locationInfo);

// The coordinates on the route
let lineObject = vacationPlan._lineObject[0];
console.log(lineObject);

//Define starting Position
let startingLocation = lineObject.data.geometry.coordinates[0];

/**
 * @function displayInfo
 * retrieve all the detail information which user key in before
 * display all the info in page
 */
function displayInfo(vacationPlan) {
    let vacationName = vacationPlan["_vacationName"];
    document.getElementById("vacationName").innerHTML = vacationName;

    let startLocation = vacationPlan["_startLocation"];
    document.getElementById("startingLocation").innerHTML = startLocation;

    let destination = vacationPlan["_destination"];
    document.getElementById("destination").innerHTML = destination;

    let vehicleType = vacationPlan["_vehicleType"]["name"] + " (" + vacationPlan["_vehicleType"]["range"] + " km)";
    document.getElementById("vehicleRange").innerHTML = vehicleType;

    let numberOfStops = vacationPlan["_numberOfStops"];
    document.getElementById("totalNumberOfStops").innerHTML = numberOfStops;

    let totalDistance = vacationPlan["_totalDistance"];
    document.getElementById("totalDistance").innerHTML = totalDistance;
}

//Access Token
mapboxgl.accessToken = MAPBOX_KEY;

//Create Map
let map = new mapboxgl.Map({
    container: 'map',
    center: startingLocation,
    zoom: 12,
    style: 'mapbox://styles/mapbox/streets-v11'
});

// Pre-define marker and pop-up
let marker = new mapboxgl.Marker({
    "color": "#FF8C00",
    draggable: false
});
let popup = new mapboxgl.Popup({ offset: 40 });

// Navigation of the Map
map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

/**
 * @function displayRoutePath
 * display the driving routing directions for the POI chosen
 */
function displayRoutePath() {
    if (map.getSource("routes")) {
        map.getSource("routes").setData(lineObject.data)
    }
    else {
        if (map.getLayer("routes")) {
            map.removeLayer("routes")
        }

        map.addLayer({
            id: "routes",
            type: "line",
            source: lineObject,
            layout: { "line-join": "round", "line-cap": "round" },
            paint: { "line-color": "#4169E1", "line-width": 6 }
        });
    }
}

/**
 * @function showMarker
 * @param {array} locations POI list 
 * Set markers for each POI
 */
function showPOIMarker() {
    let startColor = ""
    for (let i = 0; i < locationInfo._coordinate.length; i++) {
        if (i == 0) {
            startColor = "#FF0000"
        } else {
            startColor = "#3FB1CE"
        }
        POIMarker = new mapboxgl.Marker({
            "color": startColor,
            draggable: false
        });
        POIPopup = new mapboxgl.Popup({ offset: 40 });

        POIMarker.setLngLat(locationInfo._coordinate[i]);

        POIPopup.setHTML(locationInfo._name[i]);

        POIMarker.setPopup(POIPopup);
        POIMarker.addTo(map);
        POIPopup.addTo(map);
    }
}

/**
 * @function display
 * display the markers when page is onload
 */
window.onload = function display() {
    showPOIMarker();
}

// Display the route path
map.on("load", function () {
    displayRoutePath(locationInfo);
});

// Display the information in page
displayInfo(vacationPlan);