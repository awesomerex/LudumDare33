"use strict";

var Splat = require("splatjs");
var canvas = document.getElementById("canvas");

var manifest = require("./manifest.json");
var game = new Splat.Game(canvas, manifest);

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
  entity.building = true;
  entity.vulnerable = true;
	entity.sprite1 = sprite;
	entity.sprite2 = sprite2;
	entity.sprite3 = sprite3;
	entity.state = 1;
	entity.hit = function (){
		if(entity.state < 4){
			entity.state ++;
			console.log("hit");
		}
		switch (entity.state){
			case 1:
				entity.sprite = entity.sprite1;
				break;
			case 2:
				entity.sprite = entity.sprite2;
				break;
			case 3:
				entity.sprite = entity.sprite3;
				break;
			default:
				entity.sprite = entity.sprite1;
				break;
		}
	};

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
   	scene.player.attacking = false;
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

  function notVulnerable(building) {
    building.vulnerable = false;
  }

  function isVulnerable(building) {
    building.vulnerable = true;
  }

  function destruction(building) {
   
   // building.sprite = game.playerTest;
   // building.hit();
   console.log(building);
   var destroyTimer = new Splat.Timer(notVulnerable, 3000, isVulnerable);
   destroyTimer.start();
  }

  scene.destroyBuilding = function (obstacle) {
    if (obstacle.building === true) {
      if (obstacle.vulnerable) {
        console.log("getting a big hit");
        obstacle.hit();
        destruction();
      }
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
    this.obstacles[x].hit();
    var obstacle = this.obstacles[x];

		if(this.player.collides(obstacle)){
			console.log("colliding");

			if (obstacle.wasLeft(this.player)) {
			  this.player.x = obstacle.x + obstacle.width;
        this.destroyBuilding(obstacle);
      }

			if (obstacle.wasRight(this.player)) {
				this.player.x = obstacle.x-this.player.width;
			}
      
			if (obstacle.wasAbove(this.player)) {
			  this.player.y = obstacle.y + obstacle.height;
      		}
		  
      		if (obstacle.wasBelow(this.player)) {
				this.player.y = obstacle.y - this.player.height;
			}
		}
	} 
	

}, function(context) {
	// draw
	context.clearRect(this.camera.x, this.camera.y , canvas.width, canvas.height);
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
