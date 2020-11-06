// gör att man kan skala
const change = 2.5;
// number som används på många ställen
   const width = 344 * change;
   const height = width * 85 / 172;
   const marginTop = height / 34;
   const marginLeft = width / 10;

// Sätter längden och breden till den korrekta 
   document.getElementById("graf").setAttribute('width', width); 
   document.getElementById("graf").setAttribute('height', height);

// graph-objektet får en referens till canvas tagen
   var canvas = document.getElementById("graf");
   var graph = canvas.getContext("2d");

// Läser av data från cookies
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

// fyller variablerna ovan med korrekt data
dataFiller();

function dataFiller() {
    hour.temp = hourDataPack[0];
    hour.humidity = hourDataPack[1];

    day.temp = dayDataPack[0];
    day.humidity = dayDataPack[1];

    week.temp = weekDataPack[0];
    week.humidity = weekDataPack[1];
}

// Ser till att det står rätt rum namn
var rum = ['Terrariet', 'Labbet', 'Hallen', 'Vardagsrummet', 'Klassrummet'];
document.querySelector("h1").innerHTML = rum[arduinoId - 1];

// Ser till att temperaturen och luftfuktigheten skrivs ut
document.getElementById("temp").innerHTML = hourDataPack[0][hourDataPack[0].length - 1] + " C°";
document.getElementById("humidity").innerHTML = hourDataPack[1][hourDataPack[1].length - 1] + " %";

// Funktion som frågar API efter live data
const interval = setInterval(function() {
    var url = window.location.href + "/live";

    // Callback funktion
    function updateRoomLiveData(data) {
        // Samlar ihop datan
        var newData = JSON.parse(data);

        // Skriver in det i HTML filen
        document.getElementById("temp").innerHTML = newData.temperature + " C°";
        document.getElementById("humidity").innerHTML = newData.humidity + " %";
    }

    // Skicka data request
    httpGetAsync(url, updateRoomLiveData);

    function httpGetAsync(theUrl, callback) {
        var xmlHttp = new XMLHttpRequest();

        xmlHttp.onreadystatechange = function() {
            // Om den får tillbaka data kör callback funktion
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                callback(xmlHttp.responseText);
        }

        xmlHttp.open("GET", theUrl, true); // true for asynchronous 
        xmlHttp.send(null);
    }
}, 1000);

// Startar igång grafen och axels del börjar
graphUpdate(day, "day");

function graphUpdate(timespan, timespanString) { // allt som ska köras när grafen ska visas
    graph.fillStyle = "#1a1b1c";
    graph.font = "bold 16px Roboto";
    graph.fillRect(0, 0, width, height); // tömmer grafen

    drawNet();
    x_axies(timespanString);

    y_axies(getMax_Diff(timespan.temp, 1)/* 1 betyder getMax, undefined betyder getDiff*/, "#FF2618", getMax_Diff(timespan.temp), " C°", 0);
    y_axies(getMax_Diff(timespan.humidity, 1), "#1892FF", getMax_Diff(timespan.humidity), " %", 315);

    drawline(getMax_Diff(timespan.temp, 1), "#FF2618", timespan.temp, getMax_Diff(timespan.temp));
    drawline(getMax_Diff(timespan.humidity, 1), "#1892FF", timespan.humidity, getMax_Diff(timespan.humidity));
}

function drawNet() { // ritar rutnät
    graph.strokeStyle = "white";
    graph.lineWidth = 0.5;
    graph.beginPath();
    for (i = 0; i <= 7; i++) {   //horisontell 
        graph.moveTo(marginLeft, marginTop + i * height / 6.8);
        graph.lineTo(width * 0.9, marginTop + i * height / 6.8);
    }
    for (i = 0; i <= 7; i++) {  //vertikal
        graph.moveTo(marginLeft + i * 45.9 * change, marginTop);
        graph.lineTo(marginLeft + i * 45.9 * change, height * 31 / 34);
    }
    graph.stroke();
}

function x_axies(timespan) { // sriver ut rätt tid på x axeln
    graph.fillStyle = "white";
    var time = new Date;
    if (timespan == "day") { // senaste 24h
        var hourMinutes = time.getMinutes();
        if (CheckLength(time.getMinutes(), 0) == 1) { // läger till 0 om minuten är i ental. 2 -> 02
            hourMinutes = "0" + time.getMinutes();
        }
        for (i = 0; i <= 6; i++) {
            var hours = new Date; // tids objekt som ska modifieras
            hours.setUTCHours(time.getHours() + i * 4);
            if (CheckLength(hours.getHours(), 1) == 1) { // +0 om timmen är ental
                graph.fillText("0" + hours.getUTCHours() + ":" + hourMinutes, width / 13 + i * 45* change, height - 2);
            } else {
                graph.fillText(hours.getUTCHours() + ":" + hourMinutes, width / 13 + i * 45 * change, height - 2);
            }
        }
    } else if (timespan == "hour") { // senaste timmen
        for (i = 0; i <= 6; i++) {
            var minutes = new Date; // tids objekt som ska modifieras
            minutes.setUTCHours(time.getUTCHours() - 1); // börjar för en timme sen så den kan räkna uppåt
            minutes.setUTCMinutes(time.getUTCMinutes() + i * 10);
            if (CheckLength(minutes.getMinutes(), 0) == 1) { // +0 om minuten är ental
                graph.fillText(minutes.getHours() + ":0" + minutes.getMinutes(), width / 13 + i * 45* change, height - 2);
            } else {
                graph.fillText(minutes.getHours() + ":" + minutes.getMinutes(), width / 13 + i * 45 *change, height - 2);
            }
        }
    } else { // senaste veckan
        for (i = 0; i <= 6; i++) {
            let month = time.getMonth() + 1; // +1 för januari = 0
            graph.fillText(time.getDate() - 6 + i + "/" + month, width / 13 + i * 45 *change, height - 2);
        }
    }
   // den här delen hade kunnat förbättrats
}

function CheckLength(number, timeZone) { // skickar tillbaka längden av numret
    number = number - timeZone; // korrigerar till UTC. Svensk vinter tid blir 1 och sommar tid 2 (gäller bara timmar)
    number = number.toString();
    return number.length;
}

function y_axies(max, color, diff, unit, distanceFromLeft) { // skriver ut temp och humidity skalan
    graph.fillStyle = color;
    let decimals = 10; // skriver ut med 1 decimal
    if (diff < 0.5 && diff > 0) {
        decimals = 100;
        // om differansen är liten så ska den visa 2 decimaler
    }
    if (diff) {
        for (i = 0; i <= 4; i++) {
            graph.fillText(Math.round((max - i * diff / 4) * decimals) / decimals + unit, width * distanceFromLeft / 344, height / 5 + i *  height / 6.8);
            // skriver ut skalan
        }
        graph.fillText(Math.round((max + diff / 4) * decimals) / decimals + unit, width * distanceFromLeft / 344, height / 16.5);
        graph.fillText(Math.round((max - diff - diff / 4) * decimals) / decimals + unit, width * distanceFromLeft / 344, height / 16.5 + 6 * height / 6.8);
        // gör att grafen får en marginal
    } else {
        for (i = 0; i <= 6; i++) { // om differansen är 0 så vill jag också att den ska skriva ut en skala som stämmer
            graph.fillText(Math.round((max + 0.3 - i * 0.1) * decimals) / decimals + unit, width * distanceFromLeft / 344, height / 16.5 + i * height / 6.8);
      }
   }
}

function getMax_Diff(array, max) { // skickar diff/max av en array.
    let orded = array.slice(0, array.length); // kopierar arrayen
    orded.sort(function(a, b) { return a - b }); // sorterar i storleksordning
    if (max) {
        return orded[orded.length - 1];
        //skickar största värdet av arrayen
    } else {
        return (orded[orded.length - 1] - orded[0]);
        //skickar differansen av arrayen
    }
}

function drawline(max, color, type, diff) {    // ritar ut linjerna i grafen
    graph.beginPath();
    if (!diff) {        // ritar en rak line när värdet inte varierar 
        graph.moveTo(marginLeft, marginTop + 75 * change); // 276 är breden på grafen och 150 höjden, 75 = halva
        graph.lineTo(marginLeft + 276 * change, marginTop + 75 * change);
    } else { 
      for (i = 0; i < type.length; i++) { 
         if (type.length < 150) { // lite data gör att den inte ritar hela vägen, 280 istället för 276.5 i avstånd mellan punkterna
             graph.moveTo(marginLeft + i * (280 * change) / type.length, marginTop * 6 + (type[i] - max) * -height * 7 / 12 / diff);
             graph.lineTo(marginLeft + (i + 1) * (280 * change) / type.length, marginTop * 6 + (type[i + 1] - max) * -height * 7 / 12 / diff);
         } else {
             graph.moveTo(marginLeft + i * (276.5 * change) / type.length, marginTop * 6 + (type[i] - max) * -height * 7 / 12 / diff);
             graph.lineTo(marginLeft + (i + 1) * (276.5 * change) / type.length, margin * 6 + (type[i + 1] - max) * -height * 7 / 12 / diff);
         }
      }
   } 
    graph.lineWidth = 2;
    graph.strokeStyle = color;
    graph.stroke();
}

function miniMap(location) {
    window.location.href = 'http://' + window.location.host + `/room/${location}`;
}
