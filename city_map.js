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
            } else {
                generateTile(x * 32, y * 32, tile);
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
	game.spriteLookup = 
	{
	0: {"x":0, "y":0},
	1: {"x":32, "y":0},
	2: {"x":64, "y":0},
	3: {"x":96, "y":0},
	4: {"x":128, "y":0},
	
	5: {"x":0, 	 "y":32},
	6: {"x":32,	 "y":32},
	7: {"x":64,	 "y":32},
	8: {"x":96,	 "y":32},
	9: {"x":128, "y":32},

	10: {"x":0,   "y":64},
	11: {"x":32,  "y":64},
	12: {"x":64,  "y":64},
	13: {"x":96,  "y":64},
	14: {"x":128, "y":64},

	15: {"x":0,   "y":96},
	16: {"x":32,  "y":96},
	17: {"x":64,  "y":96},
	18: {"x":96,  "y":96},
	19: {"x":128, "y":96},

	20: {"x":0,   "y":128},
	21: {"x":32,  "y":128},
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
