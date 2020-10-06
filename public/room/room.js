var canvas = document.getElementById("graf");
var ctx = canvas.getContext("2d")
var temp = [21, 30, 23, 25, 19, 23, 24, 20]
grafupdate(46,7)
function grafupdate(x,y){
   ctx.fillStyle = "white";
   ctx.fillRect(34,5,310,155)
   ctx.beginPath();
      for(i=0; i<=7; i++){
         ctx.moveTo(34,5+i*25);
         ctx.lineTo(310,5+i*25);
      //horisontell
      }
      for(i=0; i<=y; i++){
         ctx.moveTo(34+i*x,5);
         ctx.lineTo(34+i*x,155);
         //vertikal
      }
   ctx.strokeStyle= "black";
   ctx.lineWidth=1;
      ctx.fillStyle = "red"
      ctx.font = "10px Arial";
      for(i=0; i<=7; i++){
      ctx.fillText(30-i*2.5+"C°", 0, 10+i*25)
      // temperatur axel
    }
      ctx.fillStyle = "green";
      for(i=0; i<=7; i++){
         ctx.fillText(50-i*5+"%", 315, 10+i*25)
        // fuktighet axel
        }



        // datums axe
   ctx.stroke();
   ctx.beginPath();
for(i=0; i<=y-2; i++){
   ctx.moveTo(34+i*x,5+(temp[i]-30)*-10);
   ctx.lineTo(34+(i+1)*x,5+(temp[i+1]-30)*-10);
}
ctx.lineWidth = 2;
ctx.strokeStyle = "red";
ctx.stroke(); 
var humidity = [21, 36, 32, 42, 50, 35, 40, 45]
ctx.beginPath();
for(i=0; i<=y-2; i++){
   ctx.moveTo(34+i*x,5+(humidity[i]-50)*-5);
   ctx.lineTo(34+(i+1)*x,5+(humidity[i+1]-50)*-5);
}
ctx.strokeStyle = "green";
ctx.stroke(); 
}