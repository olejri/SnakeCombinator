function MathMode(values) {
	this.title = values.title;
	this.range = values.range;
	this.numbers = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99];
}

	
MathMode.prototype.convertToModeFood = function(food) {
	var randNr = this.numbers[utils.rand(0,this.numbers.length-1)];
	var randNr2 = this.numbers[utils.rand(0,this.numbers.length-1)];
	var mathSymbols = "+-*/";
	var randMS = mathSymbols[utils.rand(0,mathSymbols.length-1)];
	
	var getRandom = "123"
	var rNr = getRandom[utils.rand(0,getRandom.length-1)]
		
		
		
	if (rNr == 1) food.details = randNr; 
	else if (rNr == 2) food.details = randNr2; 
	else if (rNr == 3) food.details = randMS;
	
	food.type = "text";
	return food;
};
MathMode.prototype.getStartBody = function() {
	var randNr = this.numbers[utils.rand(0,this.numbers.length-1)];
	return [];
};

MathMode.prototype.validateSnake = function(player, snake) {
	var contentOfSnake = "";
	for (var i=0; i < snake.partsDetail.length; i++) {
		if (snake.partsDetail[i].type == "text"){
			contentOfSnake = contentOfSnake + snake.partsDetail[i].details;
		}
	}
	
	var firstChar = contentOfSnake[0];
	var lastChar = contentOfSnake[contentOfSnake.length-1];
//	var reg = /[*+-/]/g;
	var reg = new RegExp("/[*+-/]/g");
	
	if (firstChar && lastChar){
		var firstCharCheck = firstChar.split(reg, 1);
		var lastCharCheck = lastChar.split(reg, 1);
		
		if (firstCharCheck.length == 0) contentOfSnake = contentOfSnake.substring(1);
		if (lastCharCheck.length == 0) contentOfSnake = contentOfSnake.substring(0, contentOfSnake.length - 1);
		var sum = eval(contentOfSnake);
		console.log("summen er: " +sum);
		if (sum >= this.range.minRange && sum <= this.range.maxRange) {
			console.log(sum);
			return {'word': contentOfSnake, 'score': this.getScore(player.addToValidated(contentOfSnake))};
		}
		console.log(this.range.minRange +" "+ this.range.maxRange);
	}
	return {'word': contentOfSnake, 'score': 0};
	
};

MathMode.prototype.getHelp = function(string) {
	for (var k=0; k < this.words.length; k++){
		if (string.toUpperCase() == (this.words[k].substring(0, string.length)).toUpperCase()) {
			return {'append':true, 'string':this.words[k].substring(string.length, string.length+2).toUpperCase()};
		} 
	}
	var randWord = this.words[utils.rand(0,this.words.length-1)].toUpperCase();
	return  {'append':false, 'string':randWord[0]+randWord[1]};
}


MathMode.prototype.getScore = function(word) {
	if (word.count == 1) return (word.word.length * 10);
	else if (word.count == 2) return ((word.word.length * 10)/2);
	else if (word.count == 3) return ((word.word.length * 10)/4);
	else if (word.count > 3) return 0;
}


if(typeof exports != 'undefined'){
	module.exports = MathMode;
}