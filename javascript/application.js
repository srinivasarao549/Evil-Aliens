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
    this.x = x;
    this.y = y;
    this.ctx = ctx;
    this.speed = 4 / this.radial_distance;
    this.remove = false;
    this.fireRange = 30;
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

Tower.prototype.canShoot = function(alien) {
    var distance_squared = (((this.x - alien.x) * (this.x - alien.x)) + ((this.y - alien.y) * (this.y - alien.y)));
    var radii_squared = (this.radius + this.fireRange + alien.radius) * (this.radius + this.fireRange + alien.radius);
    return distance_squared < radii_squared;
}

function Alien(ctx, radial_distance, angle) {
    this.ctx = ctx;
    this.x = null;
    this.y = null;
    this.radius = 5;
    this.radial_distance = radial_distance;
    this.angle = angle;
    this.speed = Math.random() + 1;
    this.remove = false;
    this.health = 100;
    this.isHit = false;
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
    this.ctx.fillStyle = this.isHit ? "yellow" : "green";
    this.ctx.fill();
}

Alien.prototype.hit = function() {
    this.health -= 10;
    this.isHit = true;
    if (this.health <= 0) {
        this.remove = true;
    }
}

function LaserBeam(ctx, tower, alien) {
    this.ctx = ctx;
    this.tower = tower;
    this.alien = alien;
    this.remove = false;
}

LaserBeam.prototype.update = function() {
    var xDiff = this.tower.x - this.alien.x;
    var yDiff = this.tower.y - this.alien.y;
    if (Math.sqrt((xDiff*xDiff) + (yDiff*yDiff)) > 30) {
        this.remove = true;
    }
}

LaserBeam.prototype.draw = function() {
    this.ctx.moveTo(this.tower.x, this.tower.y);
    this.ctx.lineTo(this.alien.x, this.alien.y);
    this.ctx.strokeStyle = "red";
    this.ctx.stroke();
}

function Game(ctx) {
    this.entities = [];
    this.ctx = ctx;
    this.entities.push(new Planet(ctx));

    var that = this;

    this.ctx.canvas.addEventListener("click", function(e) {
        var x =  event.clientX - that.ctx.canvas.offsetLeft - (that.ctx.canvas.width/2);
        var y = event.clientY - that.ctx.canvas.offsetTop - (that.ctx.canvas.height/2);
        that.click = {x:x, y:y};
    });
}

Game.prototype.start = function() {
    var that = this;
    (function gameLoop() {
        that.loop();
        window.webkitRequestAnimationFrame(gameLoop);
    })();
}

Game.prototype.loop = function() {
    this.update();
    this.draw();
    this.click = null;
}

Game.prototype.update = function() {
    var removable = [];
    
    if (this.lastAlienAddedAt == null || (new Date().getTime() - this.lastAlienAddedAt) > 500) {
        this.entities.push(new Alien(this.ctx, this.ctx.canvas.width, Math.random() * Math.PI * 180));
        this.lastAlienAddedAt = new Date().getTime();
    }

    for (var i = 0; i < this.entities.length; i++) {
        var entity = this.entities[i];
        entity.update();

        if (entity instanceof Tower) {
            for (var x = 0; x < this.entities.length; x++) {
                var alien = this.entities[x];
                if (alien instanceof Alien) {
                    if (entity.canShoot(alien)) {
                        //other.hit();
                        this.entities.push(new LaserBeam(this.ctx, entity, alien));
                    }
                }
            }
        }

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
game.start();
