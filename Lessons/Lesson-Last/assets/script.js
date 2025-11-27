const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const width = window.innerWidth;
const height = window.innerHeight;

canvas.width = width;
canvas.height = height;

const size = 200;

let circlePos = height / 2;

function draw() {

    ctx.clearRect(0, 0, width, height);

   circlePos+=1,5;
   if (circlePos > height + 80){
         circlePos = -80;
   }

    circlePos += 0.9;

    ctx.beginPath();
    ctx.fillStyle = 'lightblue';
    ctx.fillRect(width/2-size/2, height/2-size/2, size, size);

    ctx.beginPath();
    ctx.fillStyle = 'pink';
    ctx.arc(width / 2, circlePos, 80, 0, Math.PI * 2);
    ctx.fill();


    requestAnimationFrame(draw);

}

draw();