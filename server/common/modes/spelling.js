function SpellingMode(values) {
	this.title = values.title;
	this.words = values.words;
}

SpellingMode.prototype.convertToModeFood = function(food) {
	var randWord = this.words[utils.rand(0,this.words.length-1)];
	var randChar = randWord[utils.rand(0, randWord.length-1)];
	food.details = randChar.toUpperCase();
	food.type = "text";
	return food;
};
SpellingMode.prototype.getStartBody = function() {
	console.log(this.words);
	var randWord = this.words[utils.rand(0,this.words.length-1)].toUpperCase();
	return [];
};

SpellingMode.prototype.validateSnake = function(player, snake) {
	var word = "";
	for (var i=0; i < snake.partsDetail.length; i++) {
		if (snake.partsDetail[i].type == "text"){
			word = word + snake.partsDetail[i].details;
		}
	}
	//console.log("Snake has "+ word);
	for (var k=0; k < this.words.length; k++){
		if (word.toUpperCase() == this.words[k].toUpperCase()) {
			return {'word': word, 'score': this.getScore(player.addToValidated(word))};
		} 
	}
	return {'word': word, 'score': 0};
	
};

SpellingMode.prototype.getHelp = function(string) {
	if (string == "") {
		var randWord = this.words[utils.rand(0,this.words.length-1)].toUpperCase();
		return  {'append':false, 'string':randWord[0]+randWord[1]};
	}
	for (var k=0; k < this.words.length; k++){
		if (string.toUpperCase() == (this.words[k].substring(0, string.length)).toUpperCase()) {
			return {'append':true, 'string':this.words[k].substring(string.length, string.length+2).toUpperCase()};
		} 
	}
	var randWord = this.words[utils.rand(0,this.words.length-1)].toUpperCase();
	return  {'append':false, 'string':randWord[0]+randWord[1]};
}


SpellingMode.prototype.getScore = function(word) {
	if (word.count == 1) return (word.word.length * 10);
	else if (word.count == 2) return ((word.word.length * 10)/2);
	else if (word.count == 3) return ((word.word.length * 10)/4);
	else if (word.count > 3) return 0;
}


if(typeof exports != 'undefined'){
	module.exports = SpellingMode;
}