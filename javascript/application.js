var LinkedList = function() {
    this._head = null;
    this._tail = null;
}

LinkedList.prototype = {
    push: function (obj) {
        var node = {
            obj: obj,
            next: null
        };

        if (this._head === null) {
            this._head = node;
            this._tail = node;
        } else {
            this._tail.next = node;
            this._tail = node;
        }
    },
    iter: function() {
        return new LinkedList.Iterator(this);
    }
}

LinkedList.Iterator = function(linkedList) {
    this.current = linkedList._head;
}

LinkedList.Iterator.prototype.next = function() {
    var obj = this.current.obj;
    this.current = this.current.next;
    return obj;
}

LinkedList.Iterator.prototype.hasNext = function() {
    return this.current != null && this.current.obj != null;
}

LinkedList.Iterator.prototype.remove = function() {
    var obj = this.current;
    this.current = obj.next;
    obj.remove();
}

function Planet(ctx) {
    this.ctx = ctx;
    this.radius = 50;
    this.x = this.ctx.canvas.width / 2;
    this.y = this.ctx.canvas.height / 2;
}

Planet.prototype.update = function() {

}

Planet.prototype.draw = function() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    this.ctx.closePath();
    this.ctx.fillStyle = "red";
    this.ctx.fill();
}

function Tower(ctx, radial_distance, angle) {
    this.radius = 10;
    this.radial_distance = radial_distance;
    this.angle = angle;
    this.x = 0;
    this.y = this.radial_distance;
    this.ctx = ctx;
    this.speed = 4 / this.radial_distance;
}

Tower.prototype.update = function() {
    this.x = (this.ctx.canvas.width / 2) + this.radial_distance * Math.cos(this.angle);
    this.y = (this.ctx.canvas.height / 2) + this.radial_distance * Math.sin(this.angle);
    this.angle += this.speed;
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
    this.speed = 1;
}

Alien.prototype.update = function() {
    this.x = (this.ctx.canvas.width / 2) + this.radial_distance * Math.cos(this.angle);
    this.y = (this.ctx.canvas.height / 2) + this.radial_distance * Math.sin(this.angle);
    this.radial_distance -= this.speed;
}

Alien.prototype.draw = function() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    this.ctx.fillStyle = "green";
    this.ctx.fill();
}

function Game(ctx) {
    this.entities = new LinkedList();
    this.ctx = ctx;
    this.entities.push(new Planet(ctx));
    this.buildTowers();
    this.addAliens();
}

Game.prototype.buildTowers = function() {
    for (var i = 0; i < 5; i++) {
        this.entities.push(new Tower(this.ctx, (Math.random() * 100) + ((i + 1) * 50), Math.random() * 180));
    }
}

Game.prototype.addAliens = function() {
    for (var i = 0; i < 10; i++) {
        this.entities.push(new Alien(this.ctx, this.ctx.canvas.width, Math.random() * 180));
    }
}

Game.prototype.loop = function() {
    this.update();
    this.draw();
}

Game.prototype.update = function() {
    for (var i = this.entities.iter(); i.hasNext();) {
        var entity = i.next();
        entity.update();
    }
}

Game.prototype.draw = function() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    for (var i = this.entities.iter(); i.hasNext();) {
        var entity = i.next();
        entity.draw();
    }
}

var canvas = document.getElementById("game-surface");
var ctx = canvas.getContext("2d");
var game = new Game(ctx);

(function gameLoop() {
    game.loop();
    window.webkitRequestAnimationFrame(gameLoop);
})();
