function Snake(parts, partsDetail, startDirection) {
	this.parts = parts; // List of the parts coordinate
	this.partsDetail = partsDetail;
	this.lastDirection = startDirection;
	this.powerup = "zero";
	this.insideValidationZone = false;

	/**
	 * 
	 * @param direction:	Moved direction
	 * @param allFood:		Reference to the game food list
	 * 
	 * @return				Wheter or not a food was eaten.
	 */
	this.move = function(direction, allFood) {
		// No direction given == continue last direction
		if (!direction) direction = this.lastDirection;
		else if (!this.isAllowedDirection(direction)) direction = this.lastDirection;
		else this.lastDirection = direction;
		// Find x and y offset for direction
		var offset;
		if (direction == "left") offset = {x: -1, y: 0};
		else if (direction == "right") offset = {x: 1, y: 0};
		else if (direction == "up") offset = {x: 0, y: -1};
		else if (direction == "down") offset = {x: 0, y: 1};
		// Prepend a new head part 
		this.parts.unshift({
			'x': this.head().x + offset.x,
			'y': this.head().y + offset.y,
			'direction': direction
		});
		// Check and eat food if head lands on it, if not delete last part.
		var foodEaten = this.eatFoodIfOnIt(allFood);
		if (!foodEaten) {
			this.parts.splice(this.parts.length-1,1); // Delete last part
			this.setTailDirection();
			return false;
		} else if (foodEaten.type == "powerup"){
			this.parts.splice(this.parts.length-1,1);
			this.powerup = foodEaten.details;
			return foodEaten;
		} else {
			this.setTailDirection();
			return foodEaten;
		}
	}
}
Snake.prototype.eatFoodIfOnIt = function(allFood) {
	for (var i=0; i<allFood.length; i++) {
		if (utils.samePosition(this.parts[0], allFood[i])) {
			var food = allFood.splice(i,1)[0];
			if (food.type == "powerup") return food;
			else {
				this.partsDetail.splice(this.partsDetail.length-1, 0, {'type': food.type, 'details': food.details});
				return food;
			}
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

Snake.prototype.hasCrashedIntoWall = function(width, height) {
	if(0 > this.head().x || this.head().x >= width) return true;
	else if (0 > this.head().y || this.head().y >= height) return true;
	return false;
};

Snake.prototype.teleportHead = function(width, height, allFood) {
	var newX = this.head().x;
	var newY = this.head().y;
	if(0 > newX){
		newX = width-1;
	} else if (newX >= width){
		newX = 0;
	} else if (0 > newY){
		newY = height-1;
	} else if (newY >= height){
		newY = 0;
	}	
	this.parts.unshift({
		'x': newX,
		'y': newY
	});
	var foodEaten = this.eatFoodIfOnIt(allFood);
	
	if(foodEaten.type == "powerup") {
		this.parts.splice(this.parts.length-1,1); // Delete last part
		this.powerup = foodEaten.details;
		return foodEaten;
	} else if(!foodEaten) {
		this.parts.splice(this.parts.length-1,1); // Delete last part
		return false;
	} else {
		return foodEaten;
	}
};


Snake.prototype.addBodyPart = function(direction, textElement) {
	var indexPart = this.parts.length;
	var indexDetails = this.partsDetail.length;
	var x = this.parts[indexPart-1].x;
	var y = this.parts[indexPart-1].y;
	if (indexPart == indexDetails){
		if(direction == "left") {
			this.parts.splice(indexPart, 0, {'x': x+1, 'y': y, 'direction': "left"});
			this.partsDetail.splice(indexDetails-1, 0, {'type': "text", 'details': textElement});
		} else if (direction == "right"){
			this.parts.splice(indexPart, 0, {'x': x-1, 'y': y, 'direction': "right"});
			this.partsDetail.splice(indexDetails-1, 0, {'type': "text", 'details': textElement});
		} else if (direction == "up"){
			this.parts.splice(indexPart, 0, {'x': x, 'y': y-1, 'direction': "up"});
			this.partsDetail.splice(indexDetails-1, 0, {'type': "text", 'details': textElement});
		} else if (direction == "down"){
			this.parts.splice(indexPart, 0, {'x': x, 'y': y+1, 'direction': "down"});
			this.partsDetail.splice(indexDetails-1, 0, {'type': "text", 'details': textElement});
		}
	}
}


Snake.prototype.editSnakeBody = function(text, textCount, plainCount) {
	var indexPart = this.parts.length;
	var indexDetails = this.partsDetail.length;
	if (indexPart == indexDetails){
		if (textCount > 1) {
			this.partsDetail[plainCount+1].details = text[0];
			this.partsDetail[plainCount+2].details = text[1];
			this.partsDetail[plainCount+3] = {'type': "image", 'details': 'tail'};
			this.cutFromIndex(plainCount+4);
		} else if (textCount = 1){
			this.partsDetail[plainCount+1].details = text[0];
			this.addBodyPart(this.parts[this.parts.length-1].direction, text[1]);
		}
	}
}



Snake.prototype.isInValidationZone = function(width, height, validationZoneDim) {
	var vZones = utils.vZonePositions(width, height, validationZoneDim);
	for (var i=0; i<vZones.length; i++) {
		var z = vZones[i];
		if ((z.x == this.head().x) && (z.y == this.head().y)) return true;
	}
	return false;
};

Snake.prototype.removeAndAwardParts = function(awardCount) {
	if (!awardCount) awardCount = 0;
	var i = 1;
	while(this.parts.length>i) {
		if (this.partsDetail[i].type != "plain"){
			if (awardCount > 0){
				this.partsDetail[i] = {'type': 'plain'};
				awardCount--;
			} else {
				this.partsDetail[i] = {'type': 'image', 'details': 'tail'};
				this.parts.splice(i+1, this.parts.length-i);
				this.partsDetail.splice(i+1, this.partsDetail.length-i);
			}
		}
		i++;
	}	

};

Snake.prototype.addSnakeParts = function(string) {
	
	
	return this;
	
}

Snake.prototype.editSnakePart = function(part, index) {
	this.partsDetail[index] = part;
}

Snake.prototype.cutFromIndex = function(index) {
	this.parts.splice(index, this.parts.length);
	this.partsDetail.splice(index, this.partsDetail.length);
}





Snake.prototype.hasSelfCrash = function() {
	var head = this.parts[0];
	return this.hasPartAtPosition(head.x, head.y, 1);
};

Snake.prototype.head = function() {
	return this.parts[0];
};

Snake.prototype.tail = function() {
	return this.parts[this.parts.length-1];
};

Snake.prototype.setTailDirection = function() {
	var penultimatePart = this.parts[this.parts.length-2];
	if (this.tail().x < penultimatePart.x) this.tail().direction = "right";
	else if (this.tail().x > penultimatePart.x) this.tail().direction = "left";
	else if (this.tail().y < penultimatePart.y) this.tail().direction = "down";
	else if (this.tail().y > penultimatePart.y) this.tail().direction = "up";
};





if(typeof exports != 'undefined') module.exports = Snake;