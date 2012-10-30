function Snake(startX, startY) {
	this.parts = [{x: startX, y: startY}];
	var lastDirection;
	
	this.move = function(direction) {
		// No direction given == continue last direction
		if (!direction) direction = lastDirection;
		else if (!isAllowedDirection(direction)) direction = lastDirection;
		// Find x and y offset for direction
		var offset;
		if (direction == "left") offset = {x: -1, y: 0};
		else if (direction == "right") offset = {x: 1, y: 0};
		else if (direction == "up") offset = {x: 0, y: -1};
		else if (direction == "down") offset = {x: 0, y: 1};
		// Prepend a new head part 
		this.parts.unshift({
			x: this.parts[0].x + offset.x,
			y: this.parts[0].y + offset.y
		});
		// Delete last part
		this.parts.splice(this.parts.length-1,1);
		// Update lastDirection, and we are done!
		lastDirection = direction;
	}
	
	var isAllowedDirection = function(direction) {
		if (direction == "left" && lastDirection == "right") return false;
		else if (direction == "right" && lastDirection == "left") return false;
		else if (direction == "up" && lastDirection == "down") return false;
		else if (direction == "down" && lastDirection == "up") return false;
		else return true;
	}
	
	// Testdata
	this.parts.push({x: startX+1, y: startY})
	this.parts.push({x: startX+2, y: startY})
	this.parts.push({x: startX+3, y: startY})
	this.parts.push({x: startX+4, y: startY})
	this.parts.push({x: startX+5, y: startY})
	this.parts.push({x: startX+6, y: startY})
	this.parts.push({x: startX+7, y: startY})
	
}

if(typeof exports != 'undefined'){
	module.exports = Snake;
}