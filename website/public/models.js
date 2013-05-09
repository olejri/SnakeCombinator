var mongoose = require('mongoose');

// **************  Spelling model *****************

var spellingSchema = mongoose.Schema({
	name : {type: String},
	content: [{
		text: String
	}]
});


var SpellingText = mongoose.model('SpellingText', spellingSchema);




//**************  Math model *****************

var mathSchema = mongoose.Schema({
	name : {type: String},
	range: {
		maxRange: Number,
		minRange: Number
	}
});

var MathText = mongoose.model('MathText', mathSchema);



//**************  Game model *****************
var gameServerSchema = mongoose.Schema({
	name : String,
	players : {
		inGamePlayers : Number,
		playersNeededToStart : Number
	},
	gameMode : String,
	status : String,
	address : String
});


var GameServer = mongoose.model('GameSever', gameServerSchema);







//******** Node.js Export ******** 

module.exports = {
		SpellingText : SpellingText,
		MathText : MathText,
		GameServer : GameServer
}