module.exports = function generateBuilding(x, y, width, height, spriteName, offsetx, offsety, game){
	var sprite = game.animations.get(spriteName);
	var entity = new Splat.AnimatedEntity(x,y, width, height, sprite, offsetx, offsety);

	return entity;
}