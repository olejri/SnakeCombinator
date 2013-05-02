$("document").ready(function() {
});


function addSpellingText(name) {
	$.ajax({
		type: "POST",
		url: "./addSpellingText",
		data: {
			name: name
		},
		dataType: "json",
		success: function(response) {
			console.log(response.response);
		}
	});
};


function findSpellingText(name){
	$.ajax({
		type: "POST",
		url: "./findSpellingText",
		data: {
			name: name
		},
		dataType: "json",
		success: function(response) {
			console.log(response.response);
			var l = response.spellingText.content.length;
			console.log("Length = " + l);
			
			
//			for (var i = 0; i < response.spellingText.content; i++) {
//				console.log(response.spellingText.content[i]);
//			}
		}
	});
};




