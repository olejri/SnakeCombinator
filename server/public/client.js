// TOP VARIABLES
var gui;
var sgame;
var utils = new Utils();
//var communicator; In addition a communicator "singleton" created in communicator.js
//var eventhandler; Singleton created in eventhandler.js

$(document).ready(function() {
	$("#dialog").dialog({
		autoOpen: false,
		width: 430,
		buttons: [
		          {
		        	  text: "SPILL",
		        	  click: function() {
		        		  connect();
		        		  $( this ).dialog( "close" );
		        		  
		        	  }
		          },
		          {
		        	  text: "SLUTT",
		        	  click: function() {
		        		  window.location = "http://www.vg.no"
		        		  $( this ).dialog( "close" );
		        	  }
		          }
		          ]
	});
	
	
	
	$("#dialog").keypress(function(e) {
		if (e.keyCode == $.ui.keyCode.ENTER) {
		connect();
		$( this ).dialog( "close" );
		}
	});
	
	
	//$( "#dialog" ).dialog( "open" );
	 connect();
	
	
});


function connect() {
	var nick = $("#nickname").val();
	communicator.connect(function(serverGameObj){
		// This callback is run when the game data has been received
		sgame = new ClientSnakeGame();
		eventhandler.attatchGameTriggers(sgame);
		sgame.initFromJsonObject(serverGameObj);
		sgame.socketID = communicator.getID();
		
		gui = new GameGUI({
			GSD: 20, // Game Square Dimension, width/height of each game square
			container: 'gamegui', 
			gameWidth: sgame.settings.width,
			gameHeight: sgame.settings.height,
			validationZoneDim: sgame.settings.validationZoneDim,
		});
		
		// INITIATE GUI
		BoardImageElement.prototype.loadImages();
		gui.draw(sgame.getGUIElements());	
		//	drawGui(gui, sgame);
		
	}, nick);
}


function drawGui(gui, sgame) {
	var sgame2 = sgame;
	var gui2 = gui;
	setTimeout(function() {
		gui2.draw(sgame2.getGUIElements());	
	}, 1000);
}