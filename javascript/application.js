function Planet(ctx) {
    this.ctx = ctx;
    this.radius = Planet.RADIUS;
    this.x = 0;
    this.y = 0;
    this.remove = false;
}

Planet.RADIUS = 50;

Planet.prototype.update = function() {

}

Planet.prototype.draw = function() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    this.ctx.closePath();
    this.ctx.fillStyle = "red";
    this.ctx.fill();
}

function Tower(ctx, x, y) {
    this.radius = 10;
    this.radial_distance = Math.sqrt((x*x) + (y*y)); // distance from 0,0
    this.angle = Math.atan(y / x);
    if (x < 0) {
        this.angle += Math.PI;
    }
    // fix angle when x < 0
    this.x = x;
    this.y = y;
    this.ctx = ctx;
    this.speed = 4 / this.radial_distance;
    this.remove = false;
}

Tower.prototype.update = function() {
    this.x = this.radial_distance * Math.cos(this.angle);
    this.y = this.radial_distance * Math.sin(this.angle);
    this.angle += this.speed;
    if (this.angle > 6.28318531) this.angle = 0;
}

Tower.prototype.draw = function() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    this.ctx.closePath();
    this.ctx.fillStyle = "blue";
    this.ctx.fill();
}

function Alien(ctx, radial_distance, angle) {
    this.ctx = ctx;
    this.x = null;
    this.y = null;
    this.radius = 5;
    this.radial_distance = radial_distance;
    this.angle = angle;
    this.speed = Math.random() * 10;
    this.remove = false;
}

Alien.prototype.update = function() {
    this.x = this.radial_distance * Math.cos(this.angle);
    this.y = this.radial_distance * Math.sin(this.angle);
    this.radial_distance -= this.speed;

    if (this.hitPlanet()) {
        this.remove = true;
    }
}

Alien.prototype.hitPlanet = function() {
    var distance_squared = ((this.x * this.x) + (this.y * this.y));
    var radii_squared = (this.radius + Planet.RADIUS) * (this.radius + Planet.RADIUS);
    return distance_squared < radii_squared;
}

Alien.prototype.draw = function() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    this.ctx.fillStyle = "green";
    this.ctx.fill();
}

function Game(ctx) {
    this.entities = [];
    this.ctx = ctx;
    this.entities.push(new Planet(ctx));
    this.addAliens();

    var that = this;

    this.ctx.canvas.addEventListener("click", function(e) {
        var x =  event.clientX - that.ctx.canvas.offsetLeft - (that.ctx.canvas.width/2);
        var y = event.clientY - that.ctx.canvas.offsetTop - (that.ctx.canvas.height/2);
        that.click = {x:x, y:y};
    });
}

Game.prototype.addAliens = function() {
    for (var i = 0; i < 10; i++) {
        this.entities.push(new Alien(this.ctx, this.ctx.canvas.width, Math.random() * 180));
    }
}

Game.prototype.loop = function() {
    this.update();
    this.draw();
    this.click = null;
}

Game.prototype.update = function() {
    var removable = [];

    for (var i = 0; i < this.entities.length; i++) {
        var entity = this.entities[i];
        entity.update();
        if (entity.remove == true) {
            removable.push(i);
        }
    }

    for (var i = 0; i < removable.length; i++) {
        this.entities.splice(removable[i], 1);
    }

    if (this.click != null) {
        this.entities.push(new Tower(this.ctx, this.click.x, this.click.y));
    }
}

Game.prototype.draw = function() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.save();
    this.ctx.translate(this.ctx.canvas.width/2, this.ctx.canvas.height/2);
    for (var i = 0; i < this.entities.length; i++) {
        var entity = this.entities[i];
        entity.draw();
    }
    this.ctx.restore();
}

var canvas = document.getElementById("game-surface");
var ctx = canvas.getContext("2d");
var game = new Game(ctx);

(function gameLoop() {
    game.loop();
    window.webkitRequestAnimationFrame(gameLoop);
})();
