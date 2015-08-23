"use strict";

var gameMaker = require("./game_maker.js");
var game = game.Maker;

var cityTiles = require("./city_tiles.js");
var cityMap = cityTiles.cityMap;

function buildCity() {
    for (var x = 0; x < 42; i++) {   
        for (var y = 0; y < 42; i++) {
            var tile = cityMap[x][y];

            if (tile > 15 && tile < 20) { 
                var height, number;
                
                switch (tile) {
                    case 16 || 18:
                        height = 1;
                        number = 1;
                    case 17 || 19: 
                        height = 2;
                        number = 2;
                }

                var building = new generateBuilding(x * 32, y * 32, number, 0, height * 32); 
            }
        }
    }
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

