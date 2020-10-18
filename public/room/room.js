const change = 1.5;
const width = 344 * change;
const height = width * 85 / 172;
const margin = height / 34;
document.getElementById("graf").setAttribute('width', width);
document.getElementById("graf").setAttribute('height', height);
var canvas = document.getElementById("graf");
var ctx = canvas.getContext("2d");

var hourDataPack = decodeURIComponent(document.cookie).split('; ').find(row => row.startsWith('hourDataPack')).split('=')[1];
hourDataPack = JSON.parse(hourDataPack);

var dayDataPack = decodeURIComponent(document.cookie).split('; ').find(row => row.startsWith('dayDataPack')).split('=')[1];
dayDataPack = JSON.parse(dayDataPack);

var weekDataPack = decodeURIComponent(document.cookie).split('; ').find(row => row.startsWith('weekDataPack')).split('=')[1];
weekDataPack = JSON.parse(weekDataPack);

const week = {
    temp: [],
    humidity: [],
    x: 46
}
const day = {
    temp: [],
    humidity: [],
    x: 12
}
const hour = {
    temp: [],
    humidity: [],
    x: 55.2
}

dataFiller();

function dataFiller() {
    for (let i = 0; i < hourDataPack.length; i++) {
        hour.temp.push(hourDataPack[i].temperature);
        hour.humidity.push(hourDataPack[i].humidity);
    }
    for (let i = 0; i < dayDataPack.length; i++) {
        day.temp.push(dayDataPack[i].temperature);
        day.humidity.push(dayDataPack[i].humidity);
    }
    for (let i = 0; i < weekDataPack.length; i++) {
        week.temp.push(weekDataPack[i].temperature);
        week.humidity.push(weekDataPack[i].humidity);
    }
}

var rum = ['Pingisrum', 'Terrariet', 'Hallen', 'Klassrummet', 'Vardagsrummet'];
document.querySelector("h1").innerHTML = rum[hourDataPack[0].arduinoId - 1];

graphUpdate(day);

const interval = setInterval(function() {
    var url = window.location.href + "/live";
    function updateRoomLiveData(data) {
        newData = JSON.parse(data);

        document.getElementById("temp").innerHTML = newData.temperature + "C°";
        document.getElementById("humidity").innerHTML = newData.humidity + "%";
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

function graphUpdate(timespan) {
    document.getElementById("temp").innerHTML = hourDataPack[hourDataPack.length - 1].temperature + "C°";
    document.getElementById("humidity").innerHTML = hourDataPack[hourDataPack.length - 1].humidity + "%";
    let y;
    if (timespan.x == 12) {
        y = 276 / timespan.x;
    } else {
        y = 276 / timespan.x + 1;
    }
    let x = timespan.x * change;
    y = y * change;
    ctx.fillStyle = "black";
    ctx.font = "bold 20px Annie Use Your Telescope";
    ctx.fillRect(0, 0, width, height);
    drawNet(x, y); // ritar ut rutnät
    x_axies(x); // sriver ut rätt tid
    y_axies(order(timespan.temp, 1), "red", order(timespan.temp), "C°", 0); // skriver ut skalan
    y_axies(order(timespan.humidity, 1), "green", order(timespan.humidity), "%", 315); // skriver ut humidity skalan
    drawline(x, y, order(timespan.temp, 1), "red", timespan.temp, order(timespan.temp)); //  ritar temp grafen
    drawline(x, y, order(timespan.humidity, 1), "green", timespan.humidity, order(timespan.humidity)); // ritar humidity grafen
}

function drawNet(x, y) {
    ctx.strokeStyle = "white";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    for (i = 0; i <= 7; i++) {
        ctx.moveTo(width / 10, margin + i * height / 6.8);
        ctx.lineTo(width * 0.9, margin + i * height / 6.8);
        //horisontell
    }
    if (x == 12 * change) {
        for (i = 0; i <= 6; i++) {
            ctx.moveTo(width / 10 + i * y * 2, margin);
            ctx.lineTo(width / 10 + i * y * 2, height * 31 / 34);
        }
    } else {
        for (i = 0; i <= y; i++) {
            ctx.moveTo(width / 10 + i * x, margin);
            ctx.lineTo(width / 10 + i * x, height * 31 / 34);
            //vertical
        }
    }
    ctx.stroke();
}

function x_axies(x) {
    ctx.fillStyle = "white";
    var time = new Date();
    if (x == 12 * change) {
        var hourMinutes = time.getMinutes();
        if (CheckLength(time.getMinutes(), 0) == 1) {
            hourMinutes = "0" + time.getMinutes();
            // kollar om minutvärdet består av en siffra och om den gör det 
        }
        for (i = 0; i <= 6; i++) {
            var hour = new Date
            hour.setUTCHours(time.getHours() - i * 4);
            if (CheckLength(hour.getHours(), 2) == 1) {
                ctx.fillText("0" + hour.getUTCHours() + ":" + hourMinutes, width * 0.84 - i * x * 3.6, height - 2);
            } else {
                ctx.fillText(hour.getUTCHours() + ":" + hourMinutes, width * 0.84 - i * x * 3.6, height - 2);
            }
        }
    } else if (x == 55.2 * change) {
        for (i = 0; i <= 5; i++) {
            var minutes = new Date;
            minutes.setUTCMinutes(time.getMinutes() - i * 10);
            if (CheckLength(minutes.getMinutes(), 0) == 1) {
                ctx.fillText(minutes.getHours() + ":0" + minutes.getMinutes(), width * 0.86 - i * x, height - 2);
            } else {
                ctx.fillText(minutes.getHours() + ":" + minutes.getMinutes(), width * 0.86 - i * x, height - 2);
            }
        }
    } else {
        for (i = 0; i <= 6; i++) {
            var month = time.getMonth() + 1;
            ctx.fillText(time.getDate() - i + "/" + month, width * 0.85 - i * x * 0.95, height - 2);
        }
    }
}

function CheckLength(firstNumber, v) {
    firstNumber = firstNumber - v;
    firstNumber = firstNumber.toString();
    firstNumber = firstNumber.split("");
    return firstNumber.length;
}

function y_axies(max, color, diff, unit, type) {
    ctx.fillStyle = color;
    for (i = 0; i <= 7; i++) {
        ctx.fillText(Math.round((max - i * diff / 6) * 10) / 10 + unit, width * type / 344, height / 16.5 + i * height / 6.8);
    }
}

function order(type, order) {
    let orded = type.slice(0, type.length - 1);
    sorter(orded);
    let max, diff;
    if (order) {
        return max = orded[orded.length - 1];
    } else {
        return diff = orded[orded.length - 1] - orded[0];
    }
}

function sorter(tempSort) {
    tempSort.sort(function(a, b) { return a - b });
}

function drawline(x, y, max, color, type, diff) {
    ctx.beginPath();
    for (i = 0; i <= y / change - 2; i++) {
        ctx.moveTo(width / 10 + i * x, margin + (type[i] - max) * -height * 15 / 17 / diff);
        ctx.lineTo(width / 10 + (i + 1) * x, margin + (type[i + 1] - max) * -height * 15 / 17 / diff);
    }
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.stroke();
}