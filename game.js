"use strict";

var Splat = require("splatjs");
var canvas = document.getElementById("canvas");

var manifest = {
	"images": {
	},
	"sounds": {
	},
	"fonts": {
	},
	"animations": {
		"roadFourWay": {
			"strip": "assets/images/Road_FourWay.png",
			"frames": 1,
			"msPerFrame": 100
		}
	}
};

var game = new Splat.Game(canvas, manifest);

function drawPlayer(context, drawable){
	context.fillStyle = drawable.color;
	context.fillRect(drawable.x, drawable.y, drawable.height, drawable.width);
}

function drawBuilding(context, drawable){
	context.fillStyle = drawable.color;
	context.fillRect(drawable.x, drawable.y, drawable.height, drawable.width);
}

function centerText(context, text, offsetX, offsetY) {
	var w = context.measureText(text).width;
	var x = offsetX + (canvas.width / 2) - (w / 2) | 0;
	var y = offsetY | 0;
	context.fillText(text, x, y);
}

game.scenes.add("title", new Splat.Scene(canvas, function() {
	// initialization
	var scene = this;

	var fourWayRoad = game.animations.get("roadFourWay");
	scene.road = new Splat.AnimatedEntity(0,0, canvas.width, canvas.height, fourWayRoad, 0, 0);
	scene.drawables = [];
	scene.player = new Splat.Entity(canvas.width/2, canvas.height/2, 32, 32);
	scene.player.color = "red";

	scene.camera = new Splat.EntityBoxCamera(scene.player, 32, 32, canvas.width/2, canvas.height/2);

	var building = new Splat.Entity(100, 100, 32, 32);
	building.color = "blue";
	scene.drawables.push(building);

	building = new Splat.Entity(100, 164, 32, 32);
	building.color = "blue";
	scene.drawables.push(building);

	scene.building3 = new Splat.Entity(164, 100, 32, 32);
	scene.building3.color = "blue";
	scene.drawables.push(scene.building3);

	scene.building4 = new Splat.Entity(164, 164, 32, 32);
	scene.building4.color = "blue";
	scene.drawables.push(scene.building4);

}, function() {
	// simulation
	if (game.keyboard.isPressed("left")) {
		this.player.x -= 1;
		this.camera.x -= 1;
	}
	if (game.keyboard.isPressed("right")) {
		this.player.x += 1;
		this.camera.x += 1;
	}
	if (game.keyboard.isPressed("up")) {
		this.player.y -= 1;
		this.camera.y -= 1;
	}
	if (game.keyboard.isPressed("down")) {
		this.player.y += 1;
		this.camera.y += 1;
	}
	//collision detection
	for (var x = 0; x < this.drawables.length; x++){
		if(this.drawables[x].collides(this.player)){
			this.player.resolveCollisionWith(this.drawables[x]);
		}
	}
	

}, function(context) {
	// draw
	context.fillStyle = "#092227";
	context.fillRect(0, 0, canvas.width, canvas.height);

	context.fillStyle = "#fff";
	context.font = "25px helvetica";
	centerText(context, "Blank SplatJS Project", 0, canvas.height / 2 - 13);

	for (var x = 0 ; x < this.drawables.length; x ++){
		drawBuilding(context, this.drawables[x]);
	}

	this.road.draw(context);

	drawPlayer(context, this.player);

}));

game.scenes.switchTo("loading");
