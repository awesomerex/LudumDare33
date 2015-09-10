"use strict";

var Splat = require("splatjs");
var canvas = document.getElementById("canvas");
var gameMaker = require("./game_maker.js");
var game = gameMaker.game;

function leftText(context, text, offsetX, offsetY) {
  //var w = context.measureText(text).width;
  var x = offsetX + 0;
  var y = offsetY | 0;
  context.fillText(text, x, y);
}

// var manifest = require("./manifest.json");
// var game = new Splat.Game(canvas, manifest);

// function leftText(context, text, offsetX, offsetY) {
// 	var w = context.measureText(text).width;
// 	var x = offsetX + (canvas.width / 2) - (w / 2) | 0;
// 	var y = offsetY | 0;
// 	context.fillText(text, x, y);
// }


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
    console.log(this.state);  
		if(this.state < 4){
			this.state ++;			
            game.score++;
		}
		switch (entity.state){
			case 1:
				entity.sprite = entity.sprite1;
				break;
			case 2:
				entity.sprite = entity.sprite2;
        game.sounds.play("buildingCrush");
				break;
			case 3:
				entity.sprite = entity.sprite3;
        game.sounds.play("buildingCrush");
				break;
		}
	};
	return entity;
}


game.scenes.add("game", new Splat.Scene(canvas, function() {
	// initialization
	var scene = this;
	scene.obstacles = [];
	scene.drawables = [];
	scene.background = [];
    var cityTiles = require("./city_tiles.js");
    var cityMap = cityTiles.cityMap;
    
    for (var x = 0; x < 40; x++) {   
        for (var y = 0; y < 40; y++) {
            var tile = cityMap[x][y];

            if (tile > 15 && tile < 20) { 
                var height, number, offset;
                
                switch (tile) {
                    case 16 || 18:
                        height = 1;
                        number = 1;
                        offset = 0;
                        break;
                    case 17 || 19: 
                        height = 2;
                        number = 2;
                        offset = -32;
                        break;
                }

                var building = new generateBuilding(x * 32, y * 32, 32, 32, number, 0, offset); 
                building.state = 1;

                scene.obstacles.push(building);
               
            } else {
            	scene.background.push(generateTile(x * 32, y * 32, tile));
                //scene.drawables.push(generateTile(x * 32, y * 32, tile));
            }
        }
    }
    
    	game.spriteLookup = 
    	{
    	0: {"x":32, "y":0},
    	1: {"x":0, "y":0},
    	6: {"x":64, "y":0},
    	3: {"x":96, "y":0},
    	4: {"x":128, "y":0},
    	
    	5: {"x":0, 	 "y":32},
    	2: {"x":32,	 "y":32},
    	7: {"x":64,	 "y":32},
    	8: {"x":96,	 "y":32},
    	13: {"x":128, "y":32},
    
    	10: {"x":0,   "y":64},
    	11: {"x":32,  "y":64},
    	12: {"x":64,  "y":64},
    	9: {"x":96,  "y":64},
    	14: {"x":128, "y":64},
    
    	15: {"x":0,   "y":96},
    	16: {"x":32,  "y":96},
    	17: {"x":64,  "y":96},

    	18: {"x":96,  "y":96},
    	19: {"x":128, "y":96},
    
    	21: {"x":0,   "y":128},
    	20: {"x":32,  "y":128},
    	22: {"x":64,  "y":128},
    	23: {"x":96,  "y":128},
    	24: {"x":128, "y":128},
    
    	25: {"x":0,   "y":160},
    	26: {"x":32,  "y":160},
    	27: {"x":64,  "y":160},
    	28: {"x":96,  "y":160},
    	29: {"x":128, "y":160},
    };
    function generateTile(x, y, index){
    	var entity = new Splat.Entity(x, y, 32, 32);
    	entity.index = index;
    	entity.draw = function drawFromTileSet(context){
    		context.drawImage(game.tilesheet, game.spriteLookup[this.index].x, game.spriteLookup[this.index].y, 32, 32, this.x, this.y, 32, 32);
    	};
    	return entity;
    }
	//timer for building destruction cooldown
	scene.timers.buildingHitTimer = new Splat.Timer(undefined, 1000, function(){
		scene.player.canhit = true;
	});

	//timer for time limit
	scene.timers.timeLimit = new Splat.Timer( undefined, 1000, function(){
    scene.decrementSecond();
    this.reset();
    this.start();
  });
  scene.timers.timeLimit.start();

  scene.decrementSecond = function(){
    var min = game.time.minute;
    var second1 = game.time.second1;
    var second2 = game.time.second2;

    second2 --;

    if (second2 < 0){
      second1 --;
      second2 = 9;
    }
    if (second1 < 0){
      min --;
      second1 = 5;
    }
    game.time.minute = min;
    game.time.second1 = second1;
    game.time.second2 = second2;
  };


	//timer for walking sounds
	scene.timers.playWalkSound = new Splat.Timer(undefined, 400, function(){
		this.reset();
		this.start();
		game.sounds.play("footstep1");
	});
  game.time = {};
  game.time.minute = 3;
  game.time.second1 = 0;
  game.time.second2 = 0;
	game.isWalkSoundTimerRunning = false;
  game.playerUp = game.animations.get("playerUp");
  game.playerDown = game.animations.get("playerDown");
  game.playerLeft = game.animations.get("playerLeft");
  game.playerRight = game.animations.get("playerRight");
  game.playerPunchDown = game.animations.get("playerPunchDown");
  game.playerPunchUp = game.animations.get("playerPunchUp");
  game.playerPunchLeft = game.animations.get("playerPunchLeft");
  game.playerPunchRight = game.animations.get("playerPunchRight");
  game.tilesheet = game.images.get("city-tileset");
  game.sounds.play("kick-shock", true);
  game.score = 0;

  scene.player = new Splat.AnimatedEntity(672, 672, 32, 32, game.playerDown, 0, -32);
  scene.player.direction = "down"; 
  scene.player.isMoving = false;
  scene.player.attack = function (objects, theTimer) {
  		//create an entity in front of the player
  		var x, y, width, height;
  		this.attacking = true;
  		switch(this.direction){
  			case "up":
  				x = this.x;
  				y = this.y - 1;
  				height = 1;
  				width = 32;
  				scene.player.sprite = game.playerPunchUp;
  				break;
  			case "left":
  				x = this.x - 1;
  				y = this.y;
  				height = 32;
  				width = 1;
  				 scene.player.sprite = game.playerPunchLeft;
  				break;
  			case "right":
  				x = this.x + this.width + 1;
  				y = this.y;
  				height = 32;
  				width = 1;
  				scene.player.sprite = game.playerPunchRight;
  				break;
  			case "down":
  				x = this.x;
  				y = this.y + this.height + 1;
  				height = 1;
  				width = 32;
  				scene.player.sprite = game.playerPunchDown;
  				break;
  			case "default":  				
  				break;
  		}
  		var entity = new Splat.Entity(x, y, width, height);
  		for(var count = 0 ; count < objects.length; count++){
  			if(entity.collides(objects[count]) && this.canhit){  				
  				this.canhit = false;
  				objects[count].hit();
          theTimer.reset();
  				theTimer.start();
  			}
  		}
  		entity = null;  		
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
    game.camera = scene.camera;
	// building = generateBuilding(100, 100, 32, 32, "1", 0, 0);
	// scene.obstacles.push(building);

	
	// building = generateBuilding(164, 100, 32, 32, "2", 0, -32);
	// scene.obstacles.push(building);

	scene.drawables.push.apply(scene.drawables, scene.obstacles);
	scene.drawables.push(scene.player);

}, function(elapsedMillis) {
	// simulation
  //End condition
  if(game.time.minute === 0 && game.time.second1 === 0 && game.time.second2 === 0){
      game.sounds.stop("kick-shock");
      game.scenes.switchTo("credits");
  }

	//while player is moving run the footstep timer
	if(this.player.vx !== 0 || this.player.vy !== 0){
		this.player.isMoving = true;
	}else{
		this.player.isMoving = false;
	}

	if (this.player.isMoving && game.isWalkSoundTimerRunning === false){
		game.isWalkSoundTimerRunning = true;		
		this.timers.playWalkSound.start();
	}
	if( game.isWalkSoundTimerRunning === true && this.player.isMoving === false){
		game.isWalkSoundTimerRunning = false;		
		this.timers.playWalkSound.stop();
	}

	this.player.vx = 0;
	this.player.vy = 0;

  if (game.keyboard.isPressed("space")) {  	
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
	
	//set player boundaries
	if(this.player.x < 128){
		this.player.x = 128;
	}
	if(this.player.y < 128){
		this.player.y = 128;
	}
	if(this.player.x > 1152 - this.player.width){
		this.player.x = 1152 - this.player.width;
	}

	if(this.player.y > 1152 - this.player.height){
		this.player.y = 1152 - this.player.height;
	}

	//collision detection
	for (var x = 0; x < this.obstacles.length; x++){
    var obstacle = this.obstacles[x];

			if(this.player.collides(obstacle)){			

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
    var scoreText = "Player Score " + game.score; 

	context.clearRect(this.camera.x, this.camera.y , canvas.width, canvas.height);
	context.fillStyle = "#092227";
	context.fillRect(0, 0, 1024, 1024);

	context.fillStyle = "#000";
	context.font = "25px helvetica";
	this.drawables.sort(function(a,b){return a.y - b.y;});

	for (var x = 0 ; x < this.background.length; x ++){
		this.background[x].draw(context);
	}

	for (x = 0 ; x < this.drawables.length; x ++){
		this.drawables[x].draw(context);
	}
    

    context.font = "48px serif";
    context.fillText (scoreText, this.camera.x + this.camera.width, this.camera.y + 36);

    context.fillText ( game.time.minute + ":" + game.time.second1 + game.time.second2 , this.camera.x + 500, this.camera.y + 36);



}));

game.scenes.add("title",new Splat.Scene(canvas, function() {
	//initialization
  var scene = this;
  scene.bgimage = game.images.get("intro-scene");
  scene.playbutton = game.images.get("play-button");
  scene.background = new Splat.Entity(0,0, canvas.width, canvas.height);
  scene.background.draw = function (context) {
        context.drawImage(scene.bgimage, 0, 0);
  };

  scene.button = new Splat.Entity(141, 270, 109, 58);
  scene.button.draw = function (context) {
      context.drawImage(scene.playbutton, this.x, this.y);
  };

},function(){
	//simulation
  //on left mouse click check if the click was on the entity
  if (game.mouse.consumePressed(0)){
    game.scenes.switchTo("game");
  }

},function(context){
	//draw
  this.background.draw(context);
  this.button.draw(context);
}));

game.scenes.add("credits", new Splat.Scene(canvas, function() {
    // initialization
    var scene = this;
    scene.background = new Splat.Entity(0,0, canvas.width, canvas.height);
    scene.background.draw = function (context) {
       context.drawImage(scene.bgimage, this.x, this.y);
    };
    scene.bgimage = game.images.get("credit-bg");

}, function() {
    // simulation
    if (game.mouse.consumePressed(0)){
    game.scenes.switchTo("title");
  }
}, function(context) {
    // draw
     var scoreText = "Your Score: " + game.score; 

    this.background.draw(context);

    context.fillStyle = "#000";
    context.font = "20px helvetica";
    leftText(context, scoreText, 300, 20);
    leftText(context, "Programed by:", 0, 100);
    leftText(context, "Clay (badass) Morton", 0, 25 + 25);
    leftText(context, "Rex Soriano", 0, 25 + 50);
    leftText(context, "Graphics and Level Design by:", 0, 25 + 100);
    leftText(context, "Frank (mofo) Moussette", 0, 25 + 125);

    leftText(context, "Title Screen Graphics by:", 0, 25 + 175);
    leftText(context, "Tiffani Stuart", 0, 25 + 200);
    leftText(context, "Created using Splatjs", 0, 100 + 250);

    leftText(context, "Music:", 0, 25 + 225);
    leftText(context, "Kick Shock - Kevin MacLeod (incompetech.com) :", 0, 25 + 250);
    
}));

game.scenes.switchTo("loading");
