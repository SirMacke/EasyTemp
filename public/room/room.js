const change = 1.5;
const width = 344 * change;
const height = width * 85 / 172;
const margin = height / 34;
document.getElementById("graf").setAttribute('width', width);
document.getElementById("graf").setAttribute('height', height);
var canvas = document.getElementById("graf");
var ctx = canvas.getContext("2d")
const temp = [23, 30.45, 23, 25, 23.45, 18.96, 24, 26];
const humidity = [39, 36, 47, 42, 75, 68, 40, 45];
var rum = "pingisrum";
document.querySelector("h1").innerHTML = rum;
document.getElementById("temp").innerHTML = temp[7] + "C°";
document.getElementById("humidity").innerHTML = humidity[7] + "%";
grafupdate(46, 7);

function grafupdate(x, y) {
    x = x * change;
    y = y * change;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);
    drawNet(x, y);
    x_axies(x);
    y_axies(order(temp, 1), "red", order(temp), "C°", 0);
    y_axies(order(humidity, 1), "green", order(humidity), "%", 315);
    drawline(x, y, order(temp, 1), "red", temp, order(temp));
    drawline(x, y, order(humidity, 1), "green", humidity, order(humidity))
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
    ctx.font = "15px Arial";
    ctx.fillStyle = "white";
    ctx.border
    var time = new Date();
    if (x == 12 * change) {
        for (i = 0; i <= 6; i++) {
            var hour = new Date
            hour.setUTCHours(time.getHours() - i * 4);
            if (CheckLength(hour.getHours(), 2) == 1) {
                ctx.fillText("0" + hour.getUTCHours() + ":00", width * 0.84 - i * x * 3.6, height);
            } else {
                ctx.fillText(hour.getUTCHours() + ":00", width * 0.84 - i * x * 3.6, height);
            }
        }
    } else if (x == 55.2 * change) {
        for (i = 0; i <= 5; i++) {
            var minutes = new Date;
            minutes.setUTCMinutes(time.getMinutes() - i * 10);
            if (CheckLength(minutes.getMinutes(), 0) == 1) {
                ctx.fillText(minutes.getHours() + ":0" + minutes.getMinutes(), width * 0.86 - i * x, height);
            } else {
                ctx.fillText(minutes.getHours() + ":" + minutes.getMinutes(), width * 0.86 - i * x, height);
            }
        }
    } else {
        for (i = 0; i <= 6; i++) {
            var month = time.getMonth() + 1;
            ctx.fillText(time.getDate() - i + "/" + month, width * 0.85 - i * x * 0.95, height);
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