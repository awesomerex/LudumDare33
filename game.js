"use strict";

var Splat = require("splatjs");
var canvas = document.getElementById("canvas");

var manifest = require("./manifest.json");
var game = new Splat.Game(canvas, manifest);


// function drawPlayer(context, drawable){
// 	context.fillStyle = drawable.color;
// 	context.fillRect(drawable.x, drawable.y, drawable.height, drawable.width);
// }

// function drawBuilding(context, drawable){
// 	context.fillStyle = drawable.color;
// 	context.fillRect(drawable.x, drawable.y, drawable.height, drawable.width);
// }


function centerText(context, text, offsetX, offsetY) {
	var w = context.measureText(text).width;
	var x = offsetX + (canvas.width / 2) - (w / 2) | 0;
	var y = offsetY | 0;
	context.fillText(text, x, y);
}

function generateBuilding(x, y, width, height, buildingNumber, offsetx, offsety){
	var sprite = game.animations.get("building"+buildingNumber+"_1");
	var sprite2 = game.animations.get("building"+buildingNumber+"_2");
	var sprite3 = game.animations.get("building"+buildingNumber+"_3");
	var entity = new Splat.AnimatedEntity(x,y, width, height, sprite, offsetx, offsety);
	entity.sprite1 = sprite;
	entity.sprite2 = sprite2;
	entity.sprite3 = sprite3;

	return entity;
}

game.scenes.add("title", new Splat.Scene(canvas, function() {
	// initialization
	var scene = this;


	var fourWayRoad = game.animations.get("roadFourWay");
game.leftArrow = game.animations.get("leftArrow");
game.rightArrow = game.animations.get("rightArrow");
game.upArrow = game.animations.get("upArrow");
game.downArrow = game.animations.get("downArrow");
game.playerTest =game.animations.get("playerTest");

	scene.road = new Splat.AnimatedEntity(0,0, canvas.width, canvas.height, fourWayRoad, 0, 0);
	scene.obstacles = [];
	scene.drawables = [];
	scene.player = new Splat.AnimatedEntity(canvas.width/2, canvas.height/2, 32, 32, game.playerTest, 0, -32);
  scene.player.direction = "up"; 
  scene.player.attacking = false;

  scene.attack = function () {
    var direction = scene.player.direction;
    scene.player.attacking = true;
    
    if (direction === "up") {
      scene.player.sprite = game.playerTest;
    }
    if (direction === "down") {
      scene.player.sprite = game.playerTest;
    }
    if (direction === "left") {
      scene.player.sprite = game.playerTest;
    }
    if (direction === "right") {
      scene.player.sprite = game.playerTest;
    }
  };

  scene.notAttack = function () {
    var direction = scene.player.direction;
   
    if (direction === "up") {
      scene.player.sprite = game.upArrow;
    }
    if (direction === "down") {
      scene.player.sprite = game.downArrow;
    }
    if (direction === "left") {
      scene.player.sprite = game.leftArrow;
    }
    if (direction === "right") {
      scene.player.sprite = game.rightArrow;
    }
  };


    

	scene.camera = new Splat.EntityBoxCamera(scene.player, 32, 32, canvas.width/2, canvas.height/2);

	var building = generateBuilding(100, 100, 32, 32, "1", 0, 0);
	scene.obstacles.push(building);


	building = generateBuilding(164, 100, 32, 32, "2", 0, -32);
	scene.obstacles.push(building);


	scene.drawables.push.apply(scene.drawables, scene.obstacles);
	scene.drawables.push(scene.player);

}, function(elapsedMillis) {
	// simulation
	this.player.vx *= 0.2;
	this.player.vy *= 0.2;

  if (game.keyboard.isPressed("space")) {
    this.attack();
  } else {
    this.notAttack();
  }  
	if (game.keyboard.isPressed("left")) {
		this.player.vx -= 0.1;
    this.player.sprite = game.leftArrow;
    this.player.direction = "left";
	}
	if (game.keyboard.isPressed("right")) {
		this.player.vx += 0.1;
    this.player.sprite = game.rightArrow;
    this.player.direction = "right";
	}
	if (game.keyboard.isPressed("up")) {
		this.player.vy -= 0.1;
    this.player.sprite = game.upArrow;
    this.player.direction = "up";
	}
	if (game.keyboard.isPressed("down")) {
		this.player.vy += 0.1;
    this.player.sprite = game.downArrow;
    this.player.direction = "down";
	}

	this.player.move(elapsedMillis);
	//collision detection
	for (var x = 0; x < this.obstacles.length; x++){
		if(this.player.collides(this.obstacles[x])){
			console.log("colliding");
			if (this.obstacles[x].wasLeft(this.player) ||
				this.obstacles[x].wasRight(this.player) ){
				this.player.vx = 0;
				if(this.obstacles[x].x < this.player.x){
					this.player.x = this.obstacles[x].x + this.obstacles[x].width;
				}
				else{
					this.player.x = this.obstacles[x].x-this.player.width;
				}
			}
			if (this.obstacles[x].wasAbove(this.player) ||
				this.obstacles[x].wasBelow(this.player)){
				this.player.vy = 0;
				if(this.obstacles[x].y < this.player.y){
					this.player.y = this.obstacles[x].y + this.obstacles[x].height;					
				}
				else{
					this.player.y = this.obstacles[x].y - this.player.height;
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
	this.drawables.sort(function(a,b){return a.y - b.y;});
	for (var x = 0 ; x < this.drawables.length; x ++){
		this.drawables[x].draw(context);
	}

	this.road.draw(context);
	

}));

game.scenes.switchTo("loading");
