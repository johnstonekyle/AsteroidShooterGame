var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.font = "30px Arial";
var WIDTH = window.innerWidth-2;
var HEIGHT = window.innerHeight-2;
canvas.width = WIDTH;
canvas.height = HEIGHT;
ctx.canvas.addEventListener('click', onCanvasClick, false);
var idCounter = 0;
var score = 0;
var bullets = 3;
var mx = 0;
var my = 0;

var player = {
    x: WIDTH/2,
    y: HEIGHT/2,
    r: 15,
    vx: 0,
    vy: 0,
}

var bulletList = {};
function Bullet(id,x,y,vx,vy,r) {
    bullet = {
        id:id,
        x:x,
        y:y,
        vx:vx,
        vy:vy,
        r:r,
    }
    bulletList[id] = bullet;
}

var asteroidList = {};
function Asteroid(id,x,y,vx,vy,r){
    asteroid = {
        id:id,
        x:x,
        y:y,
        vx:vx,
        vy:vy,
        r:r,
    }
    asteroidList[id] = asteroid;
}

var arrowAngle = 0;
var arrow = new Image();
arrow.onload = function() {
	drawArrow(0);
};
arrow.src = 'https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_keyboard_arrow_down_48px-128.png';
arrow.height = 50;

function drawArrow(angle) {
    var dx = mx - player.x;
    var dy = my - player.y;
    var theta = Math.atan2(dy, dx);
    arrowAngle = theta;

	ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(-Math.PI / 2);   // correction for image starting position
    ctx.rotate(theta);
	ctx.drawImage(arrow, -arrow.width / 2, -arrow.height / 2);
    ctx.restore();
}

document.onmousemove = function(e) {
    mx = e.pageX;
    my = e.pageY;
    arrowAngle = theta;
};

function onCanvasClick(ev){
	var dx = ev.clientX - player.x;
	var dy = ev.clientY - player.y;
    var mag = Math.sqrt(dx * dx + dy * dy);
    var speed = 10;

    vx = (dx / mag) * speed;
    vy = (dy / mag) * speed;

    if (bullets > 0){
        bullets--;
        Bullet('bul'+idCounter++,player.x,player.y,vx,vy,5);
    }
}

function generateAsteroid(){
    var destinationX = WIDTH;
    var destinationY = Math.random()*HEIGHT;
    var startX = 0;
    var startY = destinationY;
    var dx = destinationX - startX;
	var dy = destinationY - startY;
    var mag = Math.sqrt(dx * dx + dy * dy);
    var speed = 5;

    vx = (dx / mag) * speed;
    vy = (dy / mag) * speed;

    if (Math.round(Math.random()*20) === 1){
        Asteroid('ast'+idCounter++,startX,startY,vx,vy,15);
    }
}

function drawCircle(x,y,r){
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.strokeStyle = "#FFFFFF";
    ctx.stroke();
}

function checkCollision(){
    for(var i in bulletList){
        var bullet = bulletList[i];
        for(var j in asteroidList){
            var asteroid = asteroidList[j];
            var vx = bullet.x - asteroid.x;
        	var vy = bullet.y - asteroid.y;
        	var dist = Math.sqrt(vx*vx+vy*vy);
            if (dist < 15){
                score++;
                bullets = 3;
                player.vx = asteroid.vx;
                player.vy = asteroid.vy;
                player.x = asteroid.x;
                player.y = asteroid.y;
                delete bulletList[bullet.id]
                delete asteroidList[asteroid.id]
            }
        }
    }
}

function drawObjects(){
    drawCircle(player.x,player.y,player.r)
    player.x += player.vx;
    player.y += player.vy;

    for(var i in bulletList){
        var bullet = bulletList[i];
        drawCircle(bullet.x,bullet.y,bullet.r)
        bullet.x += bullet.vx;
        bullet.y += bullet.vy;
        if(bullet.x < 0 || bullet.x > WIDTH || bullet.y < 0 || bullet.y > HEIGHT){
            delete bulletList[bullet.id];
        }
    }

    for(var i in asteroidList){
        var asteroid = asteroidList[i];
        drawCircle(asteroid.x,asteroid.y,asteroid.r)
        asteroid.x += asteroid.vx;
        asteroid.y += asteroid.vy;
        if(asteroid.x < 0 || asteroid.x > WIDTH || asteroid.y < 0 || asteroid.y > HEIGHT){
            delete asteroidList[asteroid.id];
        }
    }
}

function updateScore(){
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "30px Arial";
    ctx.fillText('score: ' + score + ", bullets: " + bullets,10,30);
}

function main(){
    ctx.clearRect(0,0,WIDTH,HEIGHT);
    checkCollision();
    drawObjects();
    generateAsteroid();
	drawArrow(arrowAngle);
    updateScore();
    if ((player.x < 0 || player.x > WIDTH || player.y < 0 || player.y > HEIGHT) && Object.keys(bulletList).length <= 0){
        ctx.fillText('Game Over',WIDTH/2-60,HEIGHT/2-15);
    }
}

setInterval(main,40);
