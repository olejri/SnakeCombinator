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

if(typeof exports != 'undefined'){
	module.exports = SpellingMode;
}