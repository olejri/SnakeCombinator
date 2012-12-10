function SpellingMode(values) {
	this.title = values.title;
	this.words = values.words;
}
SpellingMode.prototype.validatePlayer = function(player) {
	
};
SpellingMode.prototype.convertToModeFood = function(food) {
	var randWord = this.words[utils.rand(0,this.words.length-1)];
	var randChar = randWord[utils.rand(0, randWord.length-1)];
	food.details = randChar.toUpperCase();
	food.type = "text";
	return food;
};
SpellingMode.prototype.getStartBody = function() {
	var randWord = this.words[utils.rand(0,this.words.length-1)].toUpperCase();
	return [randWord[0], randWord[1]];
};

SpellingMode.prototype.validateSnake = function(snake) {
	var word = "";
	for (var i=0; i < snake.partsDetail.length; i++) {
		if (snake.partsDetail[i].type == "text"){
			word = word + snake.partsDetail[i].details;
		}
	}
	//console.log("Snake has "+ word);
	for (var k=0; k < this.words.length; k++){
		if (word.toUpperCase() == this.words[k].toUpperCase()) return word.length;
	}
	return 0;
	
};


if(typeof exports != 'undefined'){
	module.exports = SpellingMode;
}