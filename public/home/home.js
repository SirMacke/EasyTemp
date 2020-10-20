"use strict";

// Temperature constants
let MAX_TEMP;
let MIN_TEMP;
let TEMP_BIAS;
// Humidity letants
let MAX_HUMID;
let MIN_HUMID;
let HUMID_BIAS;
// Jquery DOM elements
const thermometer = $('.thermometer');
const tempText = $('#temperature-text');
const thermoMarker = $('#thermo-marker');
const tempButton = $('#temp-button');
const humidButton = $('#humid-button');
const range = $('.range');
const minValueSlider = $('#min-val-slider');
const maxValueSlider = $('#max-val-slider');
const biasValueSlider = $('#bias-slider');
const minValText = $('#min-val-text');
const maxValText = $('#max-val-text');
const biasText = $('#bias-text');
const placeholderText = $('.placeholder');
// Global varibles
let cursorInsideThermometer = false;
let view;

let roomsArray = [
    { temperature: 22, humidity: 35 },
    { temperature: 18, humidity: 42 },
    { temperature: 21, humidity: 25 },
    { temperature: 20, humidity: 30 },
    { temperature: 19, humidity: 40 },
];

const interval = setInterval(function() {
    var url = window.location.href + "live";

    function updateRoomLiveData(data) {
        var newData = JSON.parse(data);

        for (let i in newData) {
            $(`#room${newData[i].arduinoId - 1}>div>.temp>span`).html(newData[i].temperature.toString());
            $(`#room${newData[i].arduinoId - 1}>div>.humid>span`).html(newData[i].humidity.toString());

            roomsArray[newData[i].arduinoId - 1].temperature = newData[i].temperature;
            roomsArray[newData[i].arduinoId - 1].humidity = newData[i].humidity;
        }
    }

    httpGetAsync(url, updateRoomLiveData);

    function httpGetAsync(theUrl, callback) {
        var xmlHttp = new XMLHttpRequest();

        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                callback(xmlHttp.responseText);
        }

        xmlHttp.open("GET", theUrl, true); // true for asynchronous 
        xmlHttp.send(null);
    }
}, 1000);

/*
    Maps number range to another number range
    0..100 -> 0..30 etc
 */
let mapRange = (numToMap, inMin, inMax, outMin, outMax) => (numToMap - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;

// Sets gradient of thermometer
let setGradient = () => {
    let gradientString = '';
    if (view === 'temperature') {
        tempText.removeClass();
        tempText.addClass('celsius');
        for (let i = 1; i <= 100; i++) {
            let percentageString = `${temperatureExponentiateFloat(i / 100, TEMP_BIAS)} ${(i / 100) * 100}%`;
            if (i === 100) {
                gradientString += percentageString;
            } else {
                gradientString += percentageString + ", ";
            }
        }
    } else {
        tempText.removeClass();
        tempText.addClass('humidity');
        for (let i = 1; i <= 100; i++) {
            let percentageString = `${humidityExponantiateFloat(i / 100, HUMID_BIAS)} ${(i / 100) * 100}%`;
            if (i === 100) {
                gradientString += percentageString;
            } else {
                gradientString += percentageString + ", ";
            }
        }
    }
    thermometer.css('background', `linear-gradient(to top, ${gradientString})`);
};

let temperatureExponentiate = (currentTemp, minTemp, maxTemp, bias) => {
    let float = (currentTemp - minTemp) / (maxTemp - minTemp);
    if (currentTemp < minTemp)
        float = 0;
    if (currentTemp > maxTemp)
        float = 1;
    let exponentFunction = (x, b) => {
        let rX;
        let bX;
        if (bias === 0) {
            rX = x;
            bX = -x + 1;
        } else {
            rX = ((Math.exp(b) ** x) - 1) / (Math.exp(b) - 1);
            bX = -(((Math.exp(b) ** x) - 1) / (Math.exp(b) - 1)) + 1;
        }
        return { b: bX, r: rX };
    };
    let exponentiatedFloat = exponentFunction(float, bias);
    return `rgb(${exponentiatedFloat.r * 255}, 0, ${exponentiatedFloat.b * 255})`;
};

let temperatureExponentiateFloat = (float, bias) => {
    let exponentFunction = (x, b) => {
        let rX;
        let bX;
        if (bias === 0) {
            rX = x;
            bX = -x + 1;
        } else {
            rX = ((Math.exp(b) ** x) - 1) / (Math.exp(b) - 1);
            bX = -(((Math.exp(b) ** x) - 1) / (Math.exp(b) - 1)) + 1;
        }
        return { b: bX, r: rX };
    };
    let exponentiatedFloat = exponentFunction(float, bias);
    return `rgb(${(exponentiatedFloat.r * 255)}, 0, ${(exponentiatedFloat.b * 255)})`;
};

let humidityExponantiate = (currentTemp, minTemp, maxTemp, bias) => {
    let float = (currentTemp - minTemp) / (maxTemp - minTemp);
    if (currentTemp < minTemp)
        float = 0;
    if (currentTemp > maxTemp)
        float = 1;
    if (bias === 0) {
        return `rgb(0, 0, ${float * 255})`;
    } else {
        let exponentFunction = (x, b) => ((Math.exp(b) ** x) - 1) / (Math.exp(b) - 1);
        return `rgb(0, 0, ${exponentFunction(float, bias) * 255})`;
    }
};
let humidityExponantiateFloat = (float, bias) => {
    if (bias === 0) {
        return `rgb(0, 0, ${float * 255})`;
    } else {
        let exponentFunction = (x, b) => ((Math.exp(b) ** x) - 1) / (Math.exp(b) - 1);
        return `rgb(0, 0, ${exponentFunction(float, bias) * 255})`;
    }
};

let colorRooms = () => {
    if (view === 'temperature') {
        for (let i in roomsArray) {
            if (roomsArray[i].temperature) {
                $(`#room${i}`).css('background-color', temperatureExponentiate(roomsArray[i].temperature, MIN_TEMP, MAX_TEMP, TEMP_BIAS));
            } else {
                $(`#room${i}`).css('background-color', "#333");
            }
        }
    } else {
        for (let i in roomsArray) {
            if (roomsArray[i].temperature) {
                $(`#room${i}`).css('background-color', humidityExponantiate(roomsArray[i].humidity, MIN_HUMID, MAX_HUMID, HUMID_BIAS));
            } else {
                $(`#room${i}`).css('background-color', "#333");
            }
        }
    }
    setGradient();
};

let getValues = (startup) => {
    if (view === 'temperature') {
        if (startup) {
            minValText.html('' + MIN_TEMP);
            maxValText.html('' + MAX_TEMP);
            biasText.html('' + TEMP_BIAS);
            return;
        }
        MAX_TEMP = +maxValueSlider.val() || 30;
        MIN_TEMP = +minValueSlider.val() || 10;
        TEMP_BIAS = +biasValueSlider.val() || -2;
        localStorage.setItem('max-temperature', '' + MAX_TEMP);
        localStorage.setItem('min-temperature', '' + MIN_TEMP);
        localStorage.setItem('temperature-bias', '' + TEMP_BIAS);
        minValText.html('' + MIN_TEMP);
        maxValText.html('' + MAX_TEMP);
        biasText.html('' + TEMP_BIAS);
        colorRooms();
        setGradient();
    } else {
        if (startup) {
            minValText.html('' + MIN_HUMID);
            maxValText.html('' + MAX_HUMID);
            biasText.html('' + HUMID_BIAS);
            return;
        }
        MAX_HUMID = +maxValueSlider.val() || 50;
        MIN_HUMID = +minValueSlider.val() || 1;
        HUMID_BIAS = +biasValueSlider.val() || -8;
        localStorage.setItem('max-temperature', '' + MAX_HUMID);
        localStorage.setItem('min-temperature', '' + MIN_HUMID);
        localStorage.setItem('temperature-bias', '' + HUMID_BIAS);
        minValText.html('' + MIN_HUMID);
        maxValText.html('' + MAX_HUMID);
        biasText.html('' + HUMID_BIAS);
        colorRooms();
        setGradient();
    }
};

thermometer.on('mouseenter', (e) => {
    cursorInsideThermometer = true;
});
thermometer.on('mouseleave', (e) => {
    cursorInsideThermometer = false;
});
thermometer.on('mousemove', (e) => {
    if (cursorInsideThermometer) {
        let top = thermometer.offset().top; // y value of top of thermometer
        let bottom = thermometer.offset().top + thermometer.height(); // y value of bottom of thermometer
        let percentage = ((e.pageY - bottom) / (top - bottom)) * 100; // mouse cursor percentage from bottom to top of thermometer
        if (percentage < 0)
            percentage = 0;
        if (percentage > 100)
            percentage = 100;
        let mappedPercentage; // mappedpercentage is the percentage mapped onto min_temp..max_temp range
        if (view === 'temperature') {
            mappedPercentage = mapRange(percentage, 0, 100, MIN_TEMP, MAX_TEMP);
        } else {
            mappedPercentage = mapRange(percentage, 0, 100, MIN_HUMID, MAX_HUMID);
        }
        thermoMarker.css('top', e.pageY - top - 4);
        tempText.css('top', e.pageY - top - 6);
        tempText.html(mappedPercentage.toFixed(1).toString());
    } else {
        return;
    }
});

tempButton.on('click', () => {
    view = "temperature";
    placeholderText.html('Temperature');
    colorRooms();
    getValues(true);
});

humidButton.on('click', () => {
    view = "humidity";
    placeholderText.html('Humidity');
    colorRooms();
    getValues(true);
});

range.on('change', () => {
    getValues();
});

window.onload = () => {
    if (typeof(Storage) !== "undefined") {
        MIN_TEMP = +localStorage.getItem("min-temperature") || 30;
        MAX_TEMP = +localStorage.getItem("max-temperature") || 10;
        TEMP_BIAS = +localStorage.getItem("temperature-bias") || -2;
        MIN_HUMID = +localStorage.getItem("min-humidity") || 50;
        MAX_HUMID = +localStorage.getItem("max-humidity") || 1;
        HUMID_BIAS = +localStorage.getItem("humidity-bias") || -8;
    } else {
        MIN_TEMP = 30;
        MAX_TEMP = 10;
        TEMP_BIAS = -2;
        MIN_HUMID = 50;
        MAX_HUMID = 1;
        HUMID_BIAS = -8;
    }
    view = "temperature"; // Default view
    placeholderText.html('Temperature');
    colorRooms();
    setGradient();
    writeRoomData();
    getValues(true);
};