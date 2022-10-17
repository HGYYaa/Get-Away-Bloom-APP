"use strict"
/*
* File Name : shared.js
* Description : All classes used in the assignment
* Organization/Team: Team 145, Monash University, ENG1003 - Engineering Mobile Apps
* Author: Gan Ting You, Sebastian Lim, Huang Guo Yue Yang
* Last Modified: 14/10/2021 
*/

class Location {
    constructor() {
        this._vehicleType = [];
        this._name = [];
        this._coordinate = [];
        this._address = [];
        this._category = [];
    }
    // Accessor
    get type() { return this._vehicleType; }
    get name() { return this._name; }
    get coordinate() { return this._coordinate; }
    get address() { return this._address; }
    get category() { return this._category; }

    // Method
    addVehicleType(newVehicleType) {
        this._vehicleType.push(newVehicleType)
    }
    addPOIName(newName) {
        this._name.push(newName)
    }
    addLocationCoordinate(newLocationCoordinate) {
        this._coordinate.push(newLocationCoordinate)
    }
    addPOIAddress(newAddress) {
        this._address.push(newAddress)
    }
    addPOICategory(newCategory) {
        this._category.push(newCategory)
    }
    fromData(data) {
        this._vehicleType = data._vehicleType;
        this._name = data._name;
        this._coordinate = data._coordinate;
        this._address = data._address;
        this._category = data._category;
    }
    moveData(index, newIndex) {
        console.log('index: ' + index, 'new index' + newIndex);
        let tempLocation = {
            name: this._name[index],
            address: this._address[index],
            category: this._category[index],
            coordinate: this._coordinate[index]
        }
        this._name[index] = this._name[newIndex];
        this._address[index] = this._address[newIndex];
        this._category[index] = this._category[newIndex];
        this._coordinate[index] = this._coordinate[newIndex];

        this._name[newIndex] = tempLocation.name;
        this._address[newIndex] = tempLocation.address;
        this._category[newIndex] = tempLocation.category;
        this._coordinate[newIndex] = tempLocation.coordinate;
    }
}

class VacationPlan {
    constructor() {
        this._vehicleType = null;
        this._vacationName = "";
        this._vacationDate = "";
        this._numberOfStops = 0;
        this._remainingEndurance = 0;
        this._totalDistance = 0;
        this._startLocation = "";
        this._destination = "";
        this._selectedMarker = [];
        this._selectedPopUps = [];
        this._lineObject = [];
        this._locationInfo = [];
    }

    // Accessor
    get vehicleType() { return this._vehicleType; }
    get vacationName() { return this._vacationName; }
    get vacationDate() { return this._vacationDate; }
    get numberOfStops() { return this._numberOfStops; }
    get remainingEndurance() { return this._numberOfStops; }
    get totalDistance() { return this._totalDistance; }
    get startLocation() { return this._startLocation; }
    get destination() { return this._destination; }
    get selectedMarker() { return this._selectedMarker; }
    get selectedPopUps() { return this._selectedPopUps; }
    get lineObject() { return this._lineObject; }
    get locationInfo() { return this._locationInfo; }

    // Mutator
    set vehicleType(newVehicleType) {
        this._vehicleType = newVehicleType;
    }
    set vacationName(newVacationName) {
        this._vacationName = newVacationName;
    }
    set vacationDate(newVacationDate) {
        this._vacationDate = newVacationDate;
    }
    set numberOfStops(newNumberOfStops) {
        this._numberOfStops = newNumberOfStops;
    }
    set remainingEndurance(newRemainingEndurance) {
        this._remainingEndurance = newRemainingEndurance;
    }
    set totalDistance(newTotalDistance) {
        this._totalDistance = newTotalDistance;
    }
    set startLocation(newStartLocation) {
        this._startLocation = newStartLocation;
    }
    set destination(newDestination) {
        this._destination = newDestination;
    }
    set locationInfo(newLocationInfo) {
        this._locationInfo = newLocationInfo;
    }

    //Method
    addSelectedMarker(newSelectedMarker) {
        this._selectedMarker.push(newSelectedMarker)
    }

    addSelectedPopUps(newSelectedPopUps) {
        this._selectedPopUps.push(newSelectedPopUps)
    }

    addLineObject(newLineObject) {
        this._lineObject.push(newLineObject)
    }

    addLocationInfo(newLocationInfo) {
        this._locationInfo.push(newLocationInfo);
    }

    fromData(data) {
        this._vehicleType = data._vehicleType;
        this._vacationName = data._vacationName;
        this._vacationDate = data._vacationDate;
        this._numberOfStops = data._numberOfStops;
        this._remainingEndurance = data._remainingEndurance;
        this._totalDistance = data._totalDistance;
        this._startLocation = data._startLocation;
        this._destination = data._destination;
        this._selectedMarker = data._selectedMarker;
        this._selectedPopUps = data._selectedPopUps;
        this._lineObject = data._lineObject;
    }
}

class VacationList {
    constructor() {
        this._vacationList = [];
    }

    // Accessor
    get vacationList() {
        return this._vacationList;
    }

    // Method
    addVacationPlan(vacationPlan) {
        if (vacationPlan instanceof VacationPlan) {
            this._vacationList.push(vacationPlan)
        }
    }

    getVacationPlan(vacationPlan) {
        return this._vacationList[vacationPlan];
    }

    fromData(data) {
        this._vacationList = [];
        for (let i in data._vacationList) {
            let vacationPlan = new VacationPlan();
            vacationPlan.fromData(data._vacationList[i])
            this._vacationList.push(vacationPlan);
        }
    }
}