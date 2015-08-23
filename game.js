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
			//destruction sound
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
		}
	};
	return entity;
}

game.scenes.add("title", new Splat.Scene(canvas, function() {
	// initialization
	var scene = this;
	//timer for building destruction cooldown
	scene.timers.buildingHitTimer = new Splat.Timer(undefined, 1000, function(){
		scene.player.canhit = true;
		console.log("player can hit");
	});

	//timer for time limit
	scene.timers.timeLimit = new Splat.Timer(function(){
		//update a timer lable
	}, 30000, undefined);

	//timer for walking sounds
	scene.timers.playWalkSound = new Splat.Timer(undefined, 300, function(){
		this.reset();
		this.start();
		game.sounds.play("footstep1");
	});
	game.isWalkSoundTimerRunning = false;
  game.fourWayRoad = game.animations.get("roadFourWay");
  game.playerUp = game.animations.get("playerUp");
  game.playerDown = game.animations.get("playerDown");
  game.playerLeft = game.animations.get("playerLeft");
  game.playerRight = game.animations.get("playerRight");
  game.playerPunchDown = game.animations.get("playerPunchDown");

	scene.road = new Splat.AnimatedEntity(0,0, canvas.width, canvas.height, game.fourWayRoad, 0, 0);
	scene.obstacles = [];
	scene.drawables = [];

	scene.player = new Splat.AnimatedEntity(512, 512, 32, 32, game.playerDown, 0, -32);
  scene.player.direction = "down"; 
  scene.player.isMoving = false;
  scene.player.attack = function (objects, theTimer) {
  		//create an entity in front of the player
  		var x, y, width, height;
  		this.attacking = true;
  		console.log("attacking");
  		switch(this.direction){
  			case "up":
  				x = this.x;
  				y = this.y - 1;
  				height = 1;
  				width = 32;
  				scene.player.sprite = game.playerUp;
  				break;
  			case "left":
  				x = this.x - 1;
  				y = this.y;
  				height = 32;
  				width = 1;
  				 scene.player.sprite = game.playerLeft;
  				break;
  			case "right":
  				x = this.x + this.width + 1;
  				y = this.y;
  				height = 32;
  				width = 1;
  				scene.player.sprite = game.playerRight;
  				break;
  			case "down":
  				x = this.x;
  				y = this.y + this.height + 1;
  				height = 1;
  				width = 32;
  				scene.player.sprite = game.playerPunchDown;
  				break;
  			case "default":
  				console.log("whaht Didj ya doo?");
  				break;
  		}
  		var entity = new Splat.Entity(x, y, width, height);
  		for(var count = 0 ; count < objects.length; count++){
  			if(entity.collides(objects[count]) && this.canhit){
  				console.log("You hit something");
  				this.canhit = false;
  				objects[count].hit();
  				theTimer.start();
  			}
  		}
  		entity = null;
  		console.log("attack created");
  };

  scene.player.attacking = false;
  scene.player.canhit = true;
  game.player = scene.player;


  scene.notAttack = function () {
    var direction = scene.player.direction;
   	scene.player.attacking = false;
    if (direction === "up") {
      scene.player.sprite = game.playerUp;
    }
    if (direction === "down") {
      scene.player.sprite = game.playerDown;
    }
    if (direction === "left") {
      scene.player.sprite = game.playerLeft;
    }
    if (direction === "right") {
      scene.player.sprite = game.playerRight;
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
	//while player is moving run the footstep timer
	if(this.player.vx !== 0 || this.player.vy !== 0){
		console.log("moving");
		this.player.isMoving = true;
	}else{
		this.player.isMoving = false;
	}

	if (this.player.isMoving && game.isWalkSoundTimerRunning === false){
		game.isWalkSoundTimerRunning = true;
		console.log("starting walk time");
		this.timers.playWalkSound.start();
	}
	if( game.isWalkSoundTimerRunning === true && this.player.isMoving === false){
		game.isWalkSoundTimerRunning = false;
		console.log("stopping walk time");
		this.timers.playWalkSound.stop();
	}

	this.player.vx = 0;
	this.player.vy = 0;

  if (game.keyboard.isPressed("space")) {
  	console.log("attack");
    this.player.attack(this.obstacles, this.timers.buildingHitTimer);
  } else {
    this.notAttack();
  }  
	if (game.keyboard.isPressed("left")) {
		this.player.vx -= 0.09;
    this.player.sprite = game.playerLeft;
    this.player.direction = "left";
	}
	if (game.keyboard.isPressed("right")) {
		this.player.vx += 0.09;
    this.player.sprite = game.playerRight;
    this.player.direction = "right";
	}
	if (game.keyboard.isPressed("up")) {
		this.player.vy -= 0.09;
    this.player.sprite = game.playerUp;
    this.player.direction = "up";
	}
	if (game.keyboard.isPressed("down")) {
		this.player.vy += 0.09;
    this.player.sprite = game.playerDown;
    this.player.direction = "down";
	}

	this.player.move(elapsedMillis);
	//collision detection
	for (var x = 0; x < this.obstacles.length; x++){
    var obstacle = this.obstacles[x];

			if(this.player.collides(obstacle)){
			console.log("colliding");

			if (obstacle.wasLeft(this.player)) {
			  this.player.x = obstacle.x + obstacle.width;
      		}

			if (obstacle.wasRight(this.player)) {
				this.player.x = obstacle.x - this.player.width;
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
	context.fillRect(0, 0, 1024, 1024);

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
