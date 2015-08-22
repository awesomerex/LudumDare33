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
    "leftArrow": {
      "strip": "assets/images/playerTest_small.png",
      "frames": 1,
      "msPerFrame": 100
    },

    "rightArrow": {
      "strip": "assets/images/playerTest_small.png",
      "frames": 1,
      "msPerFrame": 100,
      "flip": "vertical"
    },
     
    "upArrow": {
      "strip": "assets/images/playerTest_small.png",
      "frames": 1,
      "msPerFrame": 100,
      "rotate": "clockwise"
    },

    "downArrow": {
      "strip": "assets/images/playerTest_small.png",
      "frames": 1,
      "msPerFrame": 100
    },
    
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
game.leftArrow = game.animations.get("leftArrow");
game.rightArrow = game.animations.get("rightArrow");
game.upArrow = game.animations.get("upArrow");
game.downArrow = game.animations.get("downArrow");

	scene.road = new Splat.AnimatedEntity(0,0, canvas.width, canvas.height, fourWayRoad, 0, 0);
	scene.camera = new Splat.Camera(0, 0, canvas.width, canvas.height);
	scene.drawables = [];
	scene.player = new Splat.Entity(canvas.width/2, canvas.height/2, 50, 50);
	scene.player.color = "red";

	var building = new Splat.Entity(100, 100, 100, 100);
	building.color = "blue";
	scene.drawables.push(building);

	building = new Splat.Entity(100, 300, 100, 100);
	building.color = "blue";
	scene.drawables.push(building);

	scene.building3 = new Splat.Entity(300, 100, 100, 100);
	scene.building3.color = "blue";
	scene.drawables.push(scene.building3);

	scene.building4 = new Splat.Entity(300, 300, 100, 100);
	scene.building4.color = "blue";
	scene.drawables.push(scene.building4);

}, function() {
	// simulation
	if (game.keyboard.isPressed("left")) {
		this.player.x -= 1;
    console.log(this.player.sprite);
    this.player.sprite = game.leftArrow;
		this.camera.x -= 1;
	}
	if (game.keyboard.isPressed("right")) {
		this.player.x += 1;
//    this.player.sprite = game.rightArrow;
		this.camera.x += 1;
	}
	if (game.keyboard.isPressed("up")) {
		this.player.y -= 1;
//    this.player.sprite = game.upArrow;
		this.camera.y -= 1;
	}
	if (game.keyboard.isPressed("down")) {
		this.player.y += 1;
//    this.player.sprite = game.downArrow;
		this.camera.y += 1;
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
