function Snake(parts, partsDetail, startDirection) {
	this.parts = parts; // List of the parts coordinate
	this.partsDetail = partsDetail;
	this.lastDirection = startDirection;
	
	/**
	 * 
	 * @param direction:	Moved direction
	 * @param foodRef:		Reference to the game food list
	 */
	this.move = function(direction, foodRef) {
		// No direction given == continue last direction
		if (!direction) direction = this.lastDirection;
		else if (!this.isAllowedDirection(direction)) direction = this.lastDirection;
		// Find x and y offset for direction
		var offset;
		if (direction == "left") offset = {x: -1, y: 0};
		else if (direction == "right") offset = {x: 1, y: 0};
		else if (direction == "up") offset = {x: 0, y: -1};
		else if (direction == "down") offset = {x: 0, y: 1};
		// Prepend a new head part 
		this.parts.unshift({
			'x': this.parts[0].x + offset.x,
			'y': this.parts[0].y + offset.y
		});
		// Check and eat food if head lands on it, if not delete last part.
		if (!this.eatFoodIfOnIt(foodRef)) {
			this.parts.splice(this.parts.length-1,1); // Delete last part
		}
		// Update lastDirection, and we are done!
		this.lastDirection = direction;
	}
}
Snake.prototype.eatFoodIfOnIt = function(foodRef) {
	for (var i=0; i<foodRef.length; i++) {
		if (utils.samePosition(this.parts[0], foodRef[i])) {
			var food = foodRef.splice(i,1)[0];
			console.log(food)
			this.partsDetail.push({'type': food.type, 'details': food.details});
			return true;
		}
	}
	return false;
};
Snake.prototype.isAllowedDirection = function(direction) {
	//console.log("is allowed: "+direction+" when last was "+this.lastDirection);
	if (direction == "left" && this.lastDirection == "right") return false;
	else if (direction == "right" && this.lastDirection == "left") return false;
	else if (direction == "up" && this.lastDirection == "down") return false;
	else if (direction == "down" && this.lastDirection == "up") return false;
	else return true;
};
Snake.prototype.getAllowedDirections = function() {
	var directions = ["left", "up", "right", "down"];
	for (var i=0; i<directions.length; i++) {
		if (!this.isAllowedDirection(directions[i])) directions.splice(i,1);
	}
	return directions;
};
Snake.prototype.hasPartAtPosition = function(x, y, indexOffset) {
	if (!indexOffset) indexOffset = 0;
	for (var i=indexOffset; i<this.parts.length; i++) {
		if (this.parts[i].x == x) {
			if (this.parts[i].y == y) return true;
		}
	}
	return false;
};
Snake.prototype.hasSelfCrash = function() {
	var head = this.parts[0];
	return this.hasPartAtPosition(head.x, head.y, 1);
};

if(typeof exports != 'undefined') module.exports = Snake;