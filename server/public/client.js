//TOP VARIABLES
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
	$( "#dialog" ).dialog( "open" );





	$("#dialogShowResult").dialog({
		autoOpen: false,
		width: 430,
		buttons: [
		          {
		        	  text: $("#badcms").html(),
		        	  click: function() {
		        		  $( this ).dialog( "close" );
		        		  sgame.resetGame();
		        		  sgame.restartGame();

		        	  }
		          },
		          {
		        	  text: "MENY",
		        	  click: function() {
		        		  window.location = "http://gribb.dyndns.org:8888";
		        		  $( this ).dialog( "close" );
		        	  }
		          }
		          ]
	});





});

$(window).resize(function() {
	setRightSize()
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


function test() {
	console.log("test");
	communicator.test("test");
}


function setRightSize() {
	var middleContainer = $("#middlecontainer").width();
	var containerWrapperW = $("#containerWrapper").width();
	var containerWrapperH = $("#containerWrapper").height();
	var newWidth = (containerWrapperW-middleContainer)/2;
	var gameGui = $("#gamegui").height();
	var header = $("#header").height();
	
	
	console.log(middleContainer+":" + containerWrapperW +":"+ newWidth +":"+ containerWrapperH+":"+header);
	


	$("#leftcontainer").width(newWidth-1);
	$("#rightcontainer").width(newWidth+0.5);
	$("#containerWrapper").height(gameGui+50);
	$("#pageWrapper").height(containerWrapperH+header);

}

















