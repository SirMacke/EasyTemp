"use strict";
let cookies = document.cookie;

let bias = 0.008;
let roomsArray = [
    { room: "hallway", temperature: 20 },
    { room: "room1", temperature: 18 },
    { room: "room2", temperature: 21 },
    { room: "room3", temperature: 20 },
    { room: "room4", temperature: 19 },
    { room: "room5", temperature: 18 },
    { room: "room6", temperature: 21 },
];

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
let calculateColor = (currentTemp, maxTemp, minTemp) => {
    let b = bias; // Bias är 0.15
    let exponentionateRgb = (x, b) => {
        let f = (b ** x - 1) / (b - 1);
        let g = -((b ** x - 1) / (b - 1)) + 1;
        return { red: f, blue: g };
    };
    let float = (currentTemp - minTemp) / (maxTemp - minTemp);
    let redValue = exponentionateRgb(float, b).red * 255;
    let blueValue = exponentionateRgb(float, b).blue * 255;
    return `rgb(${redValue}, 0, ${blueValue})`;
};

function colorRooms() {
    for (let i = 0; i < roomsArray.length; i++) {
        let room = document.getElementById(roomsArray[i].room);
        room.style.backgroundColor = calculateColor(roomsArray[i].temperature, 30, 15);
    }
}
window.onload = () => {
    colorRooms();
};


console.log(cookies);