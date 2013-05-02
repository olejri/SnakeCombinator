var mongoose = require('mongoose');

// **************  Spelling model *****************

var spellingSchema = mongoose.Schema({
	name : {type: String, unique: true},
	content: [{
		text: String
	}]
});


var SpellingText = mongoose.model('SpellingText', spellingSchema);



//******** Node.js Export ******** 

module.exports = {
		SpellingText : SpellingText
}