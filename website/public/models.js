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






//******** Node.js Export ******** 

module.exports = {
		SpellingText : SpellingText,
		MathText : MathText
}