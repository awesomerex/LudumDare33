"use strict";

var Splat = require("splatjs");
var canvas = document.getElementById("canvas");

var manifest = require("./mainfest.js");

var game = new Splat.Game(canvas, manifest);

// function drawPlayer(context, drawable){
// 	context.fillStyle = drawable.color;
// 	context.fillRect(drawable.x, drawable.y, drawable.height, drawable.width);
// }

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
game.leftArrow = game.animations.get("leftArrow");
game.rightArrow = game.animations.get("rightArrow");
game.upArrow = game.animations.get("upArrow");
game.downArrow = game.animations.get("downArrow");

	scene.road = new Splat.AnimatedEntity(0,0, canvas.width, canvas.height, fourWayRoad, 0, 0);
	scene.drawables = [];
	scene.player = new Splat.AnimatedEntity(canvas.width/2, canvas.height/2, 32, 32, game.upArrow, 0, 0);

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

}, function(elapsedMillis) {
	// simulation
	this.player.vx *= 0.2;
	this.player.vy *= 0.2;

	if (game.keyboard.isPressed("left")) {
		this.player.vx -= 0.1;
	}
	if (game.keyboard.isPressed("right")) {
		this.player.vx += 0.1;
	}
	if (game.keyboard.isPressed("up")) {
		this.player.vy -= 0.1;
	}
	if (game.keyboard.isPressed("down")) {
		this.player.vy += 0.1;
	}

	this.player.move(elapsedMillis);
	//collision detection
	for (var x = 0; x < this.drawables.length; x++){
		if(this.player.collides(this.drawables[x])){
			console.log("colliding");
			if (this.drawables[x].wasLeft(this.player) ||
				this.drawables[x].wasRight(this.player) ){
				this.player.vx = 0;
				if(this.drawables[x].x < this.player.x){
					this.player.x = this.drawables[x].x + this.drawables[x].width;
				}
				else{
					this.player.x = this.drawables[x].x-this.player.width;
				}
			}
			if (this.drawables[x].wasAbove(this.player) ||
				this.drawables[x].wasBelow(this.player)){
				this.player.vy = 0;
				if(this.drawables[x].y < this.player.y){
					this.player.y = this.drawables[x].y + this.drawables[x].height;					
				}
				else{
					this.player.y = this.drawables[x].y - this.player.height;
				}
			}
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
	this.player.draw(context);

}));

game.scenes.switchTo("loading");
