function Planet(ctx) {
    this.radius = 50;
    this.x = ctx.canvas.width / 2;
    this.y = ctx.canvas.height / 2;
}

Planet.prototype.update = function() {
    
}

Planet.prototype.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
    ctx.closePath();
    ctx.fillStyle = "red";
    ctx.fill();
}

function Tower(ctx, radial_distance, angle) {
    this.radius = 10;
    this.radial_distance = radial_distance;
    this.angle = angle;
    this.x = 0;
    this.y = this.radial_distance;
    this.ctx = ctx;
    this.speed = 3 / this.radial_distance;
}

Tower.prototype.update = function() {
    this.x = (this.ctx.canvas.width / 2) + this.radial_distance * Math.cos(this.angle);
    this.y = (this.ctx.canvas.height / 2) + this.radial_distance * Math.sin(this.angle);
    this.angle += this.speed;
}

Tower.prototype.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
    ctx.closePath();
    ctx.fillStyle = "blue";
    ctx.fill();
}

function Game(ctx) {
    this.entities = [];
    this.ctx = ctx;
    this.entities.push(new Planet(ctx));
    this.buildTowers();
}

Game.prototype.buildTowers = function() {
    for (var i = 0; i < 5; i++) {
        this.entities.push(new Tower(ctx, (Math.random()*100) + ((i+1)*50), Math.random()*180));
    }
}

Game.prototype.loop = function() {
    this.update();
    this.draw();
}

Game.prototype.update = function() {
    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].update();
    }
}

Game.prototype.draw = function() {
    this.ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].draw();
    }
}

var canvas = document.getElementById("game-surface");
var ctx = canvas.getContext("2d");
var game = new Game(ctx);

(function gameLoop() {
    game.loop();
    window.webkitRequestAnimationFrame(gameLoop);
})();
