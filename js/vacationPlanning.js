"use strict"
/*
* File Name : vacationPlanning.js
* Description : Vacation Planning and Map Display
* Organization/Team: Team 145, Monash University, ENG1003 - Engineering Mobile Apps
* Author: Gan Ting You, Sebastian Lim Yu Fan
* Last Modified: 13/10/2021
*/

//Define the location for the default map location
let monashMalaysia = [101.600682, 3.064411];

//Access Token
mapboxgl.accessToken = MAPBOX_KEY;

//Create Map
let map = new mapboxgl.Map({
    container: 'map',
    center: monashMalaysia,
    zoom: 14,
    style: 'mapbox://styles/mapbox/streets-v11'
});

//Pre-define marker and pop-up
let marker = new mapboxgl.Marker({
    "color": "#FF8C00",
    draggable: true
});
let popup = new mapboxgl.Popup({ offset: 40 });

//Navigation of the Map
map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

//Set Starting Marker
marker.setLngLat(monashMalaysia);
marker.setPopup(popup);
popup.setHTML("Pan Me to Desire Location!");
marker.addTo(map);
popup.addTo(map);

//Global Variables
let currentLat = "";
let currentLng = "";
let address = "";
let startingLocationArr = [];
let markers = [];
let selectedMarkers = [];
let selectedPopUps = [];
let popUps = [];
let locationInfo = new Location();
let locations = [];
let chosenPOI;
let totalDistance = 0;
let remainingEndurance = 0;
let vehicleType = [
    {
        name: "MiniBus",
        range: 450
    },
    {
        name: "Van",
        range: 600
    },
    {
        name: "SUV",
        range: 850
    },
    {
        name: "Sedan",
        range: 1000
    },
];
let lineObject = {
    type: 'geojson',
    data: {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'LineString',
            coordinates: []
        }
    }
}


/**
 * @function getSearchData
 * Get user search input of city choose for starting location when search button is pressed
 * Pass the input value into forwardGeocoding function to get coordinate of the city
 */
function getSearchData() {
    // Retrieved Value
    let cityRef = document.getElementById("city");
    let city = cityRef.value;

    // Transform address into coordinate
    sendWebServiceRequestForForwardGeocoding(city, "showLngLat");

    // Reset dropdown list and markers
    let POICategoryRef = document.getElementById("POICategory");
    let POIAvailableRef = document.getElementById("POIAvailable")
    POICategoryRef.value = null;
    POIAvailableRef.value = null;

    // Remove all POI markers on map
    removeMarker();
}

/**
 * @function onDragEnd
 * get coordinate of marker when user fine tune it
 */
function onDragEnd() {
    // get the coordinate of the marker after fine tune
    let lngLat = marker.getLngLat();

    // reset global variables
    currentLng = lngLat.lng;
    currentLat = lngLat.lat;

    console.log(lngLat);

    // transform coordinate to address
    sendWebServiceRequestForReverseGeocoding(currentLat, currentLng, "panLocationInfo")

    // renew the global variable and push the starting location coordinate into it
    startingLocationArr.length = 0;
    startingLocationArr.push(currentLng);
    startingLocationArr.push(currentLat);

    // remove initial pop up
    popup.remove();
    console.log(`Longitude: ${lngLat.lng}  Latitude: ${lngLat.lat}`);
}

/**
 * @function panLocationInfo
 * @param {any} data
 * get coordinate of marker when user fine tune it
 */
function panLocationInfo(data) {
    console.log(data);

    // retrieved address for popup
    address = data.results[0].formatted;

    // set popup and marker
    popup.setHTML(`${address}`);
    marker.setPopup(popup);
    popup.addTo(map);
}

// Run onDragEnd funtion to renew the coordinate when user fine tune marker
marker.on('dragend', onDragEnd);

/**
 * @function showLngLat  
 * @param {any} result data return by the OpenCage Api 
 * Retrieve  a particular place longitude and latitude and 
 * Display and set the location as center of map
 */
function showLngLat(result) {
    console.log(result);
    // retrieved data 
    let data = result.results[0];

    // renew current location coordinates
    currentLng = data.geometry.lng;
    currentLat = data.geometry.lat;

    // renew the global variable and push the starting location coordinate into it
    startingLocationArr.length = 0;
    startingLocationArr.push(currentLng)
    startingLocationArr.push(currentLat)

    // retrieved address for popup
    address = data.formatted;

    // set marker and popup
    map.setCenter([currentLng, currentLat]);
    marker.setLngLat([currentLng, currentLat]);
    popup.setHTML(`${address}`);
    marker.setPopup(popup);
    marker.addTo(map);
    popup.addTo(map);
}


/**
 * @function getCurrentLocation
 * Track user current location
 */
function getCurrentLocation() {
    getUserCurrentLocationUsingGeolocation(showCurrentLocation);

    // Reset dropdown list
    let POICategoryRef = document.getElementById("POICategory");
    let POIAvailableRef = document.getElementById("POIAvailable");
    let startingLocationRef = document.getElementById("city");
    startingLocationRef.value = "";
    POICategoryRef.value = null;
    POIAvailableRef.value = null;

    // remove marker
    removeMarker();
}

/**
 * @function showCurrentLocation
 * @param {number} lat latitude coordinates return by the OpenCage Api
 * @param {number} lng longitude coordinates return by the OpenCage Api 
 * Display and set the user location as center of map
 */
function showCurrentLocation(lat, lng) {

    // renewing current location coordinates
    currentLng = lng;
    currentLat = lat;

    // transform coordinate into address
    sendWebServiceRequestForReverseGeocoding(currentLat, currentLng, "currentLocationInfo")

    // renew the global variable and push the starting location coordinate into it
    startingLocationArr.length = 0;
    startingLocationArr.push(currentLng)
    startingLocationArr.push(currentLat)

    // set center to the current location
    map.setCenter([currentLng, currentLat]);
    marker.setLngLat([currentLng, currentLat]);

    console.log(`lat: ${currentLat}\nlng: ${currentLng}`);
}

/**
 * @function currentLocationInfo
 * @param {any} data
 * get coordinate of marker when user fine tune it
 */
function currentLocationInfo(data) {
    console.log(data);

    // retrieved address
    address = data.results[0].formatted;

    // set marker and popup
    popup.setHTML(`${address}`);
    marker.setPopup(popup);
    marker.addTo(map);
    popup.addTo(map);
}


/**
 * @function disableInput
 * disable all the selection of starting location after confirm button clicked
 * fix and disable draggable of marker
 */
document.getElementById('confirmStartingLocation').onclick = function disableInput() {
    if (currentLng === "" && currentLat === "") {
        alert("Please Choose Starting Location!")
    }
    else {
        document.getElementById("searchBtn").disabled = true;
        document.getElementById("currentLocationBtn").disabled = true;
        document.getElementById("confirmStartingLocation").disabled = true;
        document.getElementById("city").disabled = true;
        document.getElementById("confirmVehicleType").disabled = false;

        // fix marker and change marker color when confirmed
        marker.setDraggable(false);
        setMarkerColor(marker, "#FF0000");

        // Add the starting location info into the locationInfo class and store the marker and popup
        locationInfo.addPOIName(address);
        locationInfo.addPOIAddress(address);
        locationInfo.addLocationCoordinate(startingLocationArr);
        locationInfo.addPOICategory(["startinglocation"]);
        selectedMarkers.push(marker);
        selectedPopUps.push(popup);
    }
}

/**
 * @function displayVehicleType
 * display the vehicle type when the page onload
 */
window.onload = function displayVehicleType() {
    let vehicleTypeRef = document.getElementById("vehicleType")

    //displaying the vehicle type option list
    let displayVehicle = `<option value="null" disabled selected>Choose Your Vehicle (Range)</option>`
    for (let i in vehicleType) {
        displayVehicle += `<option value="${vehicleType[i].name}">${vehicleType[i].name} (${vehicleType[i].range}km)</option>`
    }
    vehicleTypeRef.innerHTML = displayVehicle;
}

/**
 * @function storeVehicleType
 * store the vehicle type chosen into the class
 */
function storeVehicleType() {
    let vehicleTypeRef = document.getElementById("vehicleType")

    // chosen vehicle type from option list
    let chosenVehicleRef = (vehicleTypeRef.options[vehicleTypeRef.selectedIndex].value);

    // check if option has been chose
    if (chosenVehicleRef === "null") {
        alert("Please Choose Vehicle Type!")
    }
    else {
        // disabling button
        document.getElementById("vehicleType").disabled = true;
        document.getElementById("confirmVehicleType").disabled = true;

        // find chosen vehicle index
        let vehicleIndex = vehicleType.findIndex(function index(vehicleType) {
            return vehicleType.name === chosenVehicleRef;
        })

        // find chosen vehicle
        let chosenVehicle = {
            name: vehicleType[vehicleIndex].name,
            range: vehicleType[vehicleIndex].range
        }

        // enable the following button
        document.getElementById("searchPOIAreaBtn").disabled = false;
        document.getElementById("addToRoute").disabled = false;

        // add chosen vehicle type into locationInfo class
        locationInfo.addVehicleType(chosenVehicle)
    }
}


/**
 * @function searchPOIArea
 * Get user search input of POI Address to search the POI when search button is pressed
 * Pass the input value into forwardGeocoding function to get coordinate of the city
 */
function searchPOIArea() {

    // transfrom address into coordinate
    let POIAreaRef = document.getElementById("searchPOIArea");
    let POIArea = POIAreaRef.value;
    sendWebServiceRequestForForwardGeocoding(POIArea, "showPOILngLat");

    // reset dropdown list and markers
    let POICategoryRef = document.getElementById("POICategory");
    let POIAvailableRef = document.getElementById("POIAvailable");
    POIAreaRef.value = null;
    POICategoryRef.value = null;
    POIAvailableRef.options.length = 1;

    // remove all POI's marker
    removeMarker();
}

/**
 * @function showPOILngLat  
 * @param {any} result data return by the OpenCage Api 
 * Retrieve  a POI a longitude and latitude and 
 * Display and set the location as center of map
 */
function showPOILngLat(result) {
    console.log(result);

    // renew coordinate
    let data = result.results[0];
    currentLng = data.geometry.lng;
    currentLat = data.geometry.lat;

    // set the location searched as map center
    map.setCenter([currentLng, currentLat]);
}

/**
 * @function POIData
 * Get the nearby POI data around the selected location 
 */
function POIData() {

    // find category selected from option list
    let POICategoryRef = document.getElementById("POICategory");
    let POICategory = POICategoryRef.options[POICategoryRef.selectedIndex].value;

    // get POI data from web services
    sendXMLRequestForPlaces(POICategory, currentLng, currentLat, showPOICallback)
}

/**
 * @function showPOICallback
 * @param {any} data POI data retrieved 
 * Display the POI available around the location
 */
function showPOICallback(data) {

    // remove all POI marker
    removeMarker()

    // make sure the global variables that store poi is empty
    locations.length = 0;
    let POIAvailableRef = document.getElementById("POIAvailable");

    // generating Dropdown List 
    let POIAvailableList = `<option value="null" disabled selected>Choose POI</option>`;
    let category = data.query;

    // get and store the poi information
    for (let i in data.features) {
        let eachFeature = data.features[i]
        let coordinates = eachFeature.geometry.coordinates
        let placeName = eachFeature.text
        let placeAddress = eachFeature.place_name
        let obj = {
            coordinates: coordinates,
            placeName: placeName,
            placeAddress: placeAddress,
            category: category
        }
        if (locationInfo.name.includes(placeName)) {
            console.log("Repeated POI")
        }
        else {
            POIAvailableList += `<option value="${obj.placeName}">${placeName}</option>`
            locations.push(obj)
        }
    }
    POIAvailableRef.innerHTML = POIAvailableList;
    console.log(locations)

    // pan the map to the first poi on map
    map.panTo(locations[0].coordinates)

    // display nearby poi marker 
    showMarker(locations)
}

/**
 * @function setMarkerColor
 * @param {any} marker marker chosen to change color
 * @param {string} color color wishes to change
 * changing marker color
 */
function setMarkerColor(marker, color) {
    let markerElement = marker.getElement();
    markerElement
        .querySelectorAll('svg g[fill="' + marker._color + '"]')[0]
        .setAttribute("fill", color);
    marker._color = color;
}

/**
 * @function showMarker
 * @param {array} locations POI list 
 * Set markers for each POI
 */
function showMarker(locations) {
    for (let i = 0; i < locations.length; i++) {
        // retrieved information
        let coordinates = locations[i].coordinates;
        let placeName = locations[i].placeName;

        // set up marker and popup
        let POImarker = new mapboxgl.Marker({ "color": "#FF8C00" });
        let popup = new mapboxgl.Popup({ offset: 45 });
        POImarker.setLngLat(coordinates);
        popup.setHTML(placeName);
        POImarker.setPopup(popup)

        // display the marker.
        POImarker.addTo(map);

        // display the popup.
        popup.addTo(map);

        // store the marker and popup
        markers.push(POImarker)
        popUps.push(popup)
        map.setZoom(10)
    }
}

/**
 * @function removeMarker
 * Remove the markers setted
 */
function removeMarker() {
    for (let j in markers) {
        markers[j].remove();
        popUps[j].remove();
    }
    markers.length = 0;
    popUps.length = 0;
}
console.log(locations)


/**
 * @function addToRoute
 * Add the POI selected to the POI watchlist when "Add to Route" button is clicked
 */
function addToRoute() {

    // find the poi chosen from the option list
    let POIChosenRef = document.getElementById("POIAvailable");
    let chosenPOIName = (POIChosenRef.options[POIChosenRef.selectedIndex]).value;

    if (chosenPOIName === "null") {
        alert("Please Choose POI!")
    }
    else {
        removeMarker();
        //debug
        console.log(chosenPOIName);

        // find the index of the chosenPOI that match the locations array that defined before to store the poi data
        let locationIndex = locations.findIndex(function index(locations) {
            return locations.placeName === chosenPOIName;
        })

        // add the location information into the locationInfo class
        console.log(locationIndex);
        chosenPOI = locations[locationIndex];
        locationInfo.addPOIName(chosenPOI.placeName);
        locationInfo.addPOIAddress(chosenPOI.placeAddress);
        locationInfo.addLocationCoordinate(chosenPOI.coordinates);
        locationInfo.addPOICategory(chosenPOI.category);

        // set up of marker, popup and map
        currentLng = chosenPOI.coordinates[0];
        currentLat = chosenPOI.coordinates[1];
        let marker = new mapboxgl.Marker();
        let popup = new mapboxgl.Popup({ offset: 40 });
        let place = chosenPOI.placeName;
        map.setCenter(chosenPOI.coordinates);
        marker.setLngLat(chosenPOI.coordinates);
        popup.setHTML(`${place}`);
        marker.setPopup(popup);
        marker.addTo(map);
        popup.addTo(map);
        marker.addTo(map);
        map.setZoom(10);

        // store marker and popup
        selectedMarkers.push(marker);
        selectedPopUps.push(popup);

        //debug
        console.log(chosenPOI.category);

        // keep showing the nearest 10 POIs after select a new POI
        let POICategoryRef = document.getElementById("POICategory");
        let POICategory = POICategoryRef.options[POICategoryRef.selectedIndex].value;
        sendXMLRequestForPlaces(POICategory, currentLng, currentLat, showPOICallback);

        // get route path directions
        getRoutePoint();
    }
}


/**
 * @function getRoutePoint
 * call the MapBox Direction API for driving routing directions
 */
function getRoutePoint() {
    console.log(locationInfo);
    lineObject.data.geometry.coordinates.length = 0;
    for (let i = 0; i < locationInfo.name.length - 1; i++) {
        let startLat = locationInfo.coordinate[i][1];
        let startLon = locationInfo.coordinate[i][0];
        let endLat = locationInfo.coordinate[i + 1][1];
        let endLon = locationInfo.coordinate[i + 1][0];
        sendXMLRequestForRoute(startLat, startLon, endLat, endLon, directionData);
    }
}


/**
 * @function directionData
 * @param {any} data data requested from the web service on driving routing directions 
 * retrive driving routing directions from the wrapper and push all the coordinates into the geoJson data
 */
function directionData(data) {

    // retrived value
    let result = data.routes[0].geometry.coordinates;

    // push the coordinate of all point between two location into the array
    for (let i in result) {
        lineObject.data.geometry.coordinates.push(result[i]);

    }
    console.log(lineObject)

    // displaying POI watchlist table
    displayTable();

    // display route path 
    displayRoutePath();
}


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
 * @function calcDistance
 * @param {array} startingCoordinate first point to calculate
 * @param {array} destinationCoordinate second point to calculate
 * calc distance between two points using Haversine Formula
 */
function calcDistance(startingCoordinate, destinationCoordinate) {
    const RADIUS = 6371e3;
    let rad = Math.PI / 180;
    let latRad1 = startingCoordinate[1] * rad;
    let latRad2 = destinationCoordinate[1] * rad;
    let lonRad1 = startingCoordinate[0] * rad;
    let lonRad2 = destinationCoordinate[0] * rad;

    let z = Math.sin(latRad1) * Math.sin(latRad2) + Math.cos(latRad1) * Math.cos(latRad2) * Math.cos(lonRad2 - lonRad1)
    if (z > 1) {
        return 0;
    }
    let d = Math.acos(z) * RADIUS;
    return (d);
}

/**
 * @function calcTotalDistance
 * for the array of driving routing directions, calculate the total distance and remaining endurance
 * the remaining endurance reset when gas station poi chosen
 */
function calcTotalDistance() {

    // set remaining endurance to the vehicle fuel tank size
    remainingEndurance = locationInfo._vehicleType[0].range;

    for (let i = 0; i < lineObject.data.geometry.coordinates.length - 1; i++) {
        // if (pointsOnPath.length > 0 && i < pointsOnPath.length - 1) {
        let startCoor = lineObject.data.geometry.coordinates[i];
        let destCoor = lineObject.data.geometry.coordinates[i + 1];
        totalDistance += calcDistance(startCoor, destCoor);
        // }
    }
    totalDistance = (totalDistance / 1000).toFixed(2);

    // checking the feasibility of the route
    if (remainingEndurance < totalDistance || isNaN(remainingEndurance) || isNaN(totalDistance)) {
        // alert the user
        alert("The Route Isn't Feasible! Search Nearer POI Area Again to Continue");

        // remove the location from class for the unfeasible POI
        removePOIFromLocationClass(locationInfo.name.length - 1);

        // remove the marker and popup for the unfeasible POI
        selectedMarkers[selectedMarkers.length - 1].remove();
        selectedPopUps[selectedPopUps.length - 1].remove();

        // renew route path
        getRoutePoint();
    }

    // refuel if the chosen POI is a gas station
    if (chosenPOI.category[0] == "gas") {
        remainingEndurance = locationInfo._vehicleType[0].range;
    }
    else {
        remainingEndurance = (remainingEndurance - totalDistance).toFixed(2);
    }

    return [totalDistance, remainingEndurance];
}


/**
 * @function displayTable
 * display the table cointaining name and address of the POI chosen
 * display the total distance of the route and remaining endurance of the vehicle
 */
function displayTable() {

    totalDistance = 0;
    let POIWatchListRef = document.getElementById("POIWatchList");
    let distanceListRef = document.getElementById("distanceList");
    let display = ""
    let display2 = ""

    // calculate distance and remaining endurance
    let calculatedValue = calcTotalDistance();
    totalDistance = calculatedValue[0];
    remainingEndurance = calculatedValue[1];

    // table
    for (let i = 1; i < locationInfo.name.length; i++) {
        display +=
            `
            <tr>
                <td>${locationInfo.address[i]}</td>
                <td><button id="deleteBtn_${i}" onclick="deletePOI(this)" class="mdl-button mdl-js-button mdl-button--fab mdl-button--colored">
                    <i class="material-icons">delete</i>
                </button></td>
            </tr>
            `;
    }

    display2 +=
        `
            
                <p id="total_distance"><b>Total Distance</b>: <br> ${totalDistance} km</p> 
            
            
                <p id="remaining_endurance"><b>Remain Endurance:</b> <br> ${remainingEndurance} km</p>
            
        `;
    POIWatchListRef.innerHTML = display;
    distanceListRef.innerHTML = display2;

    // modify order purpose
    getSelectedRow();
    if (typeof (index) != 'undefined' && typeof (POIWatchList.rows[index]) != 'undefined') {
        POIWatchList.rows[index].classList.toggle("selected");
    }
}

/**
 * @function getDeletedPOIIndex
 * @param {any} obj retrieved from table 
 * get deleted index from the delete button id
 */
function getDeletedPOIIndex(obj) {
    let index = obj.id.split("_");
    return parseInt(index[index.length - 1]);
}

/**
 * @function removePOIFromLocationClass
 * @param {number} index deleted index 
 * remove the location information from the locationInfo class
 */
function removePOIFromLocationClass(index) {
    let n = locationInfo.name.length
    for (let i = 0; i < n; i++) {
        if (i == index) {
            for (let j = i; j < n; j++) {
                locationInfo.name[j] = locationInfo.name[j + 1];
                locationInfo.address[j] = locationInfo.address[j + 1];
                locationInfo.category[j] = locationInfo.category[j + 1];
                locationInfo.coordinate[j] = locationInfo.coordinate[j + 1];
            }
            locationInfo.name.length--;
            locationInfo.address.length--;
            locationInfo.category.length--;
            locationInfo.coordinate.length--;
            return;
        }
    }
}


/**
 * @function updateTotalDistance
 * renew the total distance and remaining endurance in the table
 */
function updateTotalDistance() {
    let totalDistanceRef = document.getElementById("total_distance");
    let remainingEnduranceRef = document.getElementById("remaining_endurance");
    remainingEnduranceRef.innerHTML = `Remain Endurance: ${locationInfo._vehicleType[0].range}.00 km`;
    totalDistanceRef.innerHTML = "Total Distance: 0.00 km";
}


/**
 * @function deletePOI
 * @param {any} obj retrieved from table 
 * remove the poi from the table
 * remove the deleted poi's marker and popup on the map
 * renew the route path on the map
 */
function deletePOI(obj) {

    let deletedIndex = getDeletedPOIIndex(obj);

    // removing the selected table row element
    obj.parentNode.parentNode.remove();

    // remove from the class
    removePOIFromLocationClass(deletedIndex);

    // renew route path
    getRoutePoint();

    // if there's only starting location with no POI, no route path will be shown and total distance will be renew
    if (locationInfo._name.length == 1) {
        console.log("only one point")
        updateTotalDistance();
        lineObject.data.geometry.coordinates.length = 0;
        displayRoutePath();
    }

    // remove the POI from map and storing purpose array
    selectedMarkers[deletedIndex].remove();
    selectedPopUps[deletedIndex].remove();
    selectedMarkers.splice(deletedIndex, 1)
    selectedPopUps.splice(deletedIndex, 1)
    console.log("===============");
}


// Registers the dialog box polyfill
let dialog = document.getElementById("addDialog");
if (!dialog.showModal) {
    dialogPolyfill.registerDialog(dialog);
}

// Open the dialog box when save button being clicked
function setVacationNameDate() {
    dialog.showModal();
}

/**
 * @function saveVacationPlan
 * save the information into the vacation plan class
 */
function saveVacationPlan() {
    // Creat New Vacation Plan
    let vacationPlan = new VacationPlan();

    let vehicleType = locationInfo.type[0];
    vacationPlan._vehicleType = vehicleType;

    let vacationName = document.getElementById("newVacationName").value;
    vacationPlan._vacationName = vacationName;

    let vacationDate = document.getElementById("newVacationDate").value;
    vacationPlan._vacationDate = vacationDate;

    let numberOfStops = locationInfo.name.length - 1;
    vacationPlan._numberOfStops = numberOfStops

    vacationPlan._remainingEndurance = remainingEndurance;

    vacationPlan._totalDistance = totalDistance;

    let startLocation = locationInfo.name[0];
    vacationPlan._startLocation = startLocation;

    let destination = locationInfo.name[locationInfo.name.length - 1];
    vacationPlan._destination = destination;

    // Adding line objects and location information into the vacation plan
    vacationPlan.addLineObject(lineObject);
    vacationPlan.addLocationInfo(locationInfo);

    // Update the vacation plan in LS
    updateLSData("vacationPlan", vacationPlan);

    // Add plan into plan list
    addToVacationList(vacationPlan);

    // Save all the vacation's location information
    let allLocationInfo = new Array();
    if (!checkLSData("allLocationInfo")) {
        allLocationInfo.push(locationInfo);
    } else {
        allLocationInfo = retrieveLSData("allLocationInfo");
        allLocationInfo.push(locationInfo);
    }

    let detailIndex = 0;
    if (checkLSData("vacationNum")) {
        detailIndex = retrieveLSData("vacationNum");
    }
    updateLSData("detailIndex", detailIndex);
    updateLSData("allLocationInfo", allLocationInfo);

    // direct to detail page
    window.location = "vacationDetail.html";
}

/**
 * @function cancelVacationPlan
 * cancel vacation plan inside dialog box
 */
function cancelVacationPlan() {
    // Alert message when user click on cancel
    let confirmAction = confirm("Keep Editting?");
    if (confirmAction) {
        dialog.close();
    }
    else {
        //direct to home
        window.location = "index.html";
    }
}

/**
 * @function cancelVacationPlan2
 * directly cancel vacation plan
 */
function cancelVacationPlan2() {
    //direct to home
    let confirmAction = confirm("Quit Planning?");
    if (confirmAction) {
        window.location = "index.html";
    }
}

/**
 * @function addToVacationList
 * @param {any} vacationPlan class storing each vacation planned
 * Add vacation plan to vacation list and update the info into vacation list
 */
function addToVacationList(vacationPlan) {
    let vacationList = null;
    let flag = checkLSData("vacationList");
    if (!flag) {
        vacationList = new VacationList();
        vacationList.addVacationPlan(vacationPlan);
        updateLSData("vacationList", vacationList);
    } else {
        let temp = retrieveLSData("vacationList");
        vacationList = new VacationList();
        vacationList.fromData(temp);
        vacationList.addVacationPlan(vacationPlan);

        updateLSData("vacationList", vacationList);
    }
}

/**
 * @function getSelectedRow
 * @param {any} selectedRow row selected by user on the interface
 * select any specific row in the POI Watchlist by clicking on the row
 */
let index;
function getSelectedRow() {
    let POIWatchList = document.getElementById("POIWatchList");
    for (let i = 0; i < POIWatchList.rows.length; i++) {
        POIWatchList.rows[i].onclick = function () {
            if (typeof index !== "undefined" && typeof(POIWatchList.rows[index])!== "undefined") {
                console.log(POIWatchList.rows[index]);
                POIWatchList.rows[index].classList.toggle("selected");
                console.log('toggle selected');
            }
            console.log(index, this.rowIndex);
            index = this.rowIndex;
            this.classList.toggle("selected");
            console.log('toggle selected');
        };
    }
}

/**
 * @function upNdown
 * @param {any} direction the direction chosen to modify by user
 * control the POI arrangements by clicking on the up and down button below the table
 */
function upNdown(direction) {
    let rows = document.getElementById("POIWatchList").rows,
        parent = rows[index].parentNode;

    console.log('upNdown', index, direction);
    let newIndex = null;
    let oldIndex = index;

    if (direction === "up") {
        if (index > 0) {
            newIndex = index - 1;
            parent.insertBefore(rows[index], rows[newIndex]);
            index--;
        }
    } else if (direction === "down") {
        if (index < rows.length - 1) {
            newIndex = index + 1;
            parent.insertBefore(rows[newIndex], rows[index]);
            index++;
        }
    }
    console.log('upNdown', oldIndex, 'new index: ' + newIndex);

    if (newIndex != null) {
        locationInfo.moveData(oldIndex + 1, newIndex + 1);
    }

    getRoutePoint();
}