const change = 1.5;
const width = 344 * change;
const height = width * 85 / 172;
const margin = height / 34;
document.getElementById("graf").setAttribute('width', width);
document.getElementById("graf").setAttribute('height', height);
var canvas = document.getElementById("graf");
var ctx = canvas.getContext("2d");

var dataPack = decodeURIComponent(document.cookie).replace('dataPack=', '');

dataPack = JSON.parse(dataPack);

console.log(dataPack);

console.log(hourData());

const week = {
    temp: [23, 21, 23, 25, 23.45, 18.96, 24, 26], // 8
    humidity: [39, 36, 47, 42, 75, 68, 40, 45],
    x: 46
}
const day = {
    temp: [23, 21, 23, 25, 23.45, 18.96, 24, 26], // 24
    humidity: [39, 36, 47, 42, 75, 68, 40, 45],
    x: 12
}
const hour = {
    temp: [23, 21, 23, 25, 23.45, 18.96, 24, 26], // 7
    humidity: [39, 36, 47, 42, 75, 68, 40, 45],
    x: 55.2
}

function hourData() {
    var result = [];
    var date = new Date().toString();
    var hourNow = date.getHours();
    var minuteNow = date.getMinutes();

    for (let i = 0; i < dataPack.length; i++) {
        //var hourData =
          //  if (dataPack[i].date[16])
    }

    return [date, date[16], date[17], date[19], date[20]];
}

var rum = "pingisrum";
document.querySelector("h1").innerHTML = rum;
graphUpdate(week);

function graphUpdate(timespan) {
    document.getElementById("temp").innerHTML = timespan.temp[7] + "C°";
    document.getElementById("humidity").innerHTML = timespan.humidity[7] + "%";
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
    var img = document.getElementById("img")
    ctx.drawImage(img, 0, 0, width, height)
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