var mongoose = require('mongoose');

// **************  Spelling model *****************

var spellingSchema = mongoose.Schema({
	name : {type: String, unique: true},
	content: [{
		text: String
	}]
});

var SpellingText = mongoose.model('SpellingText', spellingSchema);



//**************  Math model *****************

var mathSchema = mongoose.Schema({
	name : {type: String, unique: true},
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



//**************  Saved game model *****************
var savedGameSchema = mongoose.Schema({
	date : String,
	gametime : Number,
	gamescore : Number,
	gamename : String,
	gamemode : String,
	themename : String,
	players : [{
		playername : String,
		score : Number,
		words : [{
			text: String
		}]
	}]
});


var SavedGame = mongoose.model('SavedGame', savedGameSchema);


//******** Node.js Export ******** 

module.exports = {
		SpellingText : SpellingText,
		MathText : MathText,
		GameServer : GameServer,
		SavedGame : SavedGame
}