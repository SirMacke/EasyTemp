const change = 2.5;
const width = 344 * change;
const height = width * 85 / 172;
const margin = height / 34;
document.getElementById("graf").setAttribute('width', width);
document.getElementById("graf").setAttribute('height', height);
var canvas = document.getElementById("graf");
var ctx = canvas.getContext("2d");

var arduinoId = decodeURIComponent(document.cookie).split('; ').find(row => row.startsWith('arduinoId')).split('=')[1];
arduinoId = JSON.parse(arduinoId);

var hourDataPack = decodeURIComponent(document.cookie).split('; ').find(row => row.startsWith('hourDataPack')).split('=')[1];
hourDataPack = JSON.parse(hourDataPack);

var dayDataPack = decodeURIComponent(document.cookie).split('; ').find(row => row.startsWith('dayDataPack')).split('=')[1];
dayDataPack = JSON.parse(dayDataPack);

var weekDataPack = decodeURIComponent(document.cookie).split('; ').find(row => row.startsWith('weekDataPack')).split('=')[1];
weekDataPack = JSON.parse(weekDataPack);

const week = {
    temp: [],
    humidity: []
}
const day = {
    temp: [],
    humidity: []
}
const hour = {
    temp: [],
    humidity: []
}

dataFiller();

function dataFiller() {
    hour.temp = hourDataPack[0];
    hour.humidity = hourDataPack[1];

    day.temp = dayDataPack[0];
    day.humidity = dayDataPack[1];

    week.temp = weekDataPack[0];
    week.humidity = weekDataPack[1];
}

var rum = ['Terrariet', 'Labbet', 'Hallen', 'Vardagsrummet', 'Klassrummet'];
document.querySelector("h1").innerHTML = rum[arduinoId - 1];

document.getElementById("temp").innerHTML = hourDataPack[0][hourDataPack[0].length - 1] + " C°";
document.getElementById("humidity").innerHTML = hourDataPack[1][hourDataPack[1].length - 1] + " %";

graphUpdate(day, "day");

const interval = setInterval(function() {
    var url = window.location.href + "/live";

    function updateRoomLiveData(data) {
        var newData = JSON.parse(data);

        document.getElementById("temp").innerHTML = newData.temperature + " C°";
        document.getElementById("humidity").innerHTML = newData.humidity + " %";
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

function graphUpdate(timespan, btn) {
    ctx.fillStyle = "#1a1b1c";
    ctx.font = "bold 16px Roboto";
    ctx.fillRect(0, 0, width, height);

    drawNet();
    x_axies(timespan, btn);
    y_axies(order(timespan.temp, 1), "#FF2618", order(timespan.temp), " C°", 0);
    y_axies(order(timespan.humidity, 1), "#1892FF", order(timespan.humidity), " %", 315);
    drawline(order(timespan.temp, 1), "#FF2618", timespan.temp, order(timespan.temp));
    drawline(order(timespan.humidity, 1), "#1892FF", timespan.humidity, order(timespan.humidity));
}

function drawNet() {
    ctx.strokeStyle = "white";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    for (i = 0; i <= 7; i++) {
        ctx.moveTo(width / 10, margin + i * height / 6.8);
        ctx.lineTo(width * 0.9, margin + i * height / 6.8);
        //horisontell
    }
    for (i = 0; i <= 7; i++) {
        ctx.moveTo(width / 10 + i * 45.9 * change, margin);
        ctx.lineTo(width / 10 + i * 45.9 * change, height * 31 / 34);
        //vertical
    }
    ctx.stroke();
}

function x_axies(timespan, btn) {
    ctx.fillStyle = "white";
    var time = new Date;
    if (btn == "day") {
        var hourMinutes = time.getMinutes();
        if (CheckLength(time.getMinutes(), 0) == 1) {
            hourMinutes = "0" + time.getMinutes();
        }
        for (i = 0; i <= 6; i++) {
            var hour = new Date
            hour.setUTCHours(time.getHours() - i * 4);
            if (CheckLength(hour.getHours(), 2) == 1) {
                ctx.fillText("0" + hour.getUTCHours() + ":" + hourMinutes, width * 0.86 - i * 46 * change, height - 2);
            } else {
                ctx.fillText(hour.getUTCHours() + ":" + hourMinutes, width * 0.86 - i * 46 * change, height - 2);
            }
        }
    } else if (btn == "hour") {
        for (i = 0; i <= 6; i++) {
            var minutes = new Date;
            minutes.setUTCMinutes(time.getMinutes() - i * 10);
            if (CheckLength(minutes.getMinutes(), 0) == 1) {
                ctx.fillText(minutes.getHours() + ":0" + minutes.getMinutes(), width * 0.86 - i * 46 * change, height - 2);
            } else {
                ctx.fillText(minutes.getHours() + ":" + minutes.getMinutes(), width * 0.86 - i * 46 * change, height - 2);
            }
        }
    } else {
        for (i = 0; i <= 6; i++) {
            var month = time.getMonth() + 1;
            ctx.fillText(time.getDate() - i + "/" + month, width * 0.86 - i * 46 * change, height - 2);
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
    decimals = 10;
    if (diff < 1 && diff > 0) {
        decimals = 100;
    }
    if (diff) {
        for (i = 0; i <= 4; i++) {
            ctx.fillText(Math.round((max - i * diff / 4) * decimals) / decimals + unit, width * type / 344, height / 5 + i * height / 6.8);
        }
        ctx.fillText(Math.round((max + diff / 4) * decimals) / decimals + unit, width * type / 344, height / 16.5);
        ctx.fillText(Math.round((max - diff - diff / 4) * decimals) / decimals + unit, width * type / 344, height / 16.5 + 6 * height / 6.8);
    } else {
        for (i = 0; i <= 6; i++) {
            ctx.fillText(Math.round((max + 0.3 - i * 0.1) * decimals) / decimals + unit, width * type / 344, height / 16.5 + i * height / 6.8);
        }
    }
}

function order(type, order) {
    let orded = type.slice(0, type.length);
    sorter(orded);
    let max, diff;
    if (order) {
        return max = orded[orded.length - 1];
        //skickar största värdet av arrayen
    } else {
        return diff = (orded[orded.length - 1] - orded[0]);
        //skickar differansen av arrayen
    }
}

function sorter(sort) {
    sort.sort(function(a, b) { return a - b });
    // sorterar i storleksordning
}

function drawline(max, color, type, diff) {
    ctx.beginPath();
    if (!diff) {
        ctx.moveTo(width / 10, margin + 75 * change);
        ctx.lineTo(width / 10 + 276 * change, margin + 75 * change);
        // ritar en rak line när värdet inte varierar
    }

    for (i = 0; i < type.length; i++) {
        if (type.length < 150) {
            ctx.moveTo(width / 10 + i * (280 * change) / type.length, margin * 6 + (type[i] - max) * -height * 14 / 24 / diff);
            ctx.lineTo(width / 10 + (i + 1) * (280 * change) / type.length, margin * 6 + (type[i + 1] - max) * -height * 14 / 24 / diff);
        } else {
            ctx.moveTo(width / 10 + i * (276.5 * change) / type.length, margin * 6 + (type[i] - max) * -height * 14 / 24 / diff);
            ctx.lineTo(width / 10 + (i + 1) * (276.5 * change) / type.length, margin * 6 + (type[i + 1] - max) * -height * 14 / 24 / diff);
        }
        // ritar ut grafen
    }
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.stroke();
}

function miniMap(location) {
    window.location.href = 'http://' + window.location.host + `/room/${location}`;
}