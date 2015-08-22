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
	}
};

var game = new Splat.Game(canvas, manifest);

function drawPlayer(context, drawable){
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
	scene.player = new Splat.Entity(canvas.width/4, canvas.height - 50, 50, 50);
	scene.player.color = "red";

}, function() {
	// simulation
	if (game.keyboard.isPressed("left")) {
		this.player.x -= 1;
	}
	if (game.keyboard.isPressed("right")) {
		this.player.x += 1;
	}
	if (game.keyboard.isPressed("up")) {
		this.player.y -= 1;
	}
	if (game.keyboard.isPressed("down")) {
		this.player.y += 1;
	}

}, function(context) {
	// draw
	context.fillStyle = "#092227";
	context.fillRect(0, 0, canvas.width, canvas.height);

	context.fillStyle = "#fff";
	context.font = "25px helvetica";
	centerText(context, "Blank SplatJS Project", 0, canvas.height / 2 - 13);

	drawPlayer(context, this.player);

}));

game.scenes.switchTo("loading");
