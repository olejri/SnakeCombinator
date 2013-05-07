var eventhandler = new function() {

	var playerList = $('#players2');
	var combatLog = $('#combatlog');
	var eatSound = $('#eatSound');


	this.attatchGameTriggers = function(game) {
		$(document).on('keydown', keydown);
		$(game).on("snakedied", onSnakeDied);
		$(game).on("foodspawn", onFoodSpawn);
		$(game).on("foodeaten", onFoodEaten);
		$(game).on("joinedgame", onJoinedGame);
		$(game).on("playerjoined", onPlayerJoined);
		$(game).on("playerleft", onPlayerLeft);
		$(game).on("validationsuccess", onValidationSuccess);
		$(game).on("validationfailure", onValidationFailure);
		$(game).on("gameover", onGameOver);
		$(game).on("tick", onTick);
		$(game).on("showresults", onShowResults);

	};


	function onTick(event, snakeParts) {
		if(gui){
			gui.draw(sgame.getGUIElements());
			//gui.moveSnakes(snakeParts.data);
		}
		//gui.testTransition();

	}

	function onShowResults(event, results) {
		$("#resultTable").empty();
		var players = results.players;
		var winner = results.winner;
		var scoreList = sortScoreList(players);
		for (var i=0; i<scoreList.length; i++) {
			$("#resultTable").append('<tr><td>'+scoreList[i].player+'</td><td>'+scoreList[i].score+'</td></tr>');
		}
		$("#dialogShowResult").dialog("open");
	};

	function onSnakeDied(event, player) {
		//console.log("Players snake died: "+player.nick);
	}

	function onFoodSpawn(event, food) {
		//console.log(food)
	}

	function onFoodEaten(event, food) {
		//eatSound.prop('loop', true);
		eatSound.get(0).play();
		//console.log(food);
	}

	function onValidationSuccess(event, data) {
		if ($("#combatlog p").length > 4) clearFirst(); 	
		$('<p class="margin2">'+data.player.nick+' validated '+data.word+' for '+ data.score+' points!</p>')
		.appendTo('#combatlog')
		.hide().fadeIn(1000);
		//combatLog.append('<p>'+data.player.nick+' validated '+data.word+' for '+ data.score+' points!</p>');
		drawPlayerList();
	}

	function onValidationFailure(event, data) {
		if ($("#combatlog p").length > 4) clearFirst(); 
		combatLog.append('<p class="margin2">'+data.player.nick+', '+data.word+' its not a valied word!</p>');
	}

	function onJoinedGame(event, game) {
		console.log("Joined game!")
		$('#title').text(game.mode.title);
		
	}

	function onPlayerJoined(event, player) {
		console.log("Player "+player.nick+" joined");
		if (gui){
			gui.draw(sgame.getGUIElements());
		}
		drawPlayerList();
		updateGameInfo();
		setRightSize();
	}

	function onPlayerLeft(event, player) {
		console.log("Player "+player.nick+" left");
		drawPlayerList();
		updateGameInfo(); 
	}

	function onGameOver(event, player) {
		combatLog.append('<li>Game is over!' + player.nick + ' won!</li>');
	}

	var keyCodeNameMapper = {
			37: 'left',		// Left arrow
			38: 'up',		// Up arrow
			39: 'right',	// Right arrow
			40: 'down', 	// Down arrow
			65: 'left',		// a
			87: 'up',		// w
			68: 'right',	// d
			83: 'down',		// s
	}
	function keydown(event) {
		var moveDirection = keyCodeNameMapper[event.keyCode];
		if (moveDirection) communicator.emitMovement(moveDirection);
		event.preventDefault();
	}

	this.playerLeft = function(player) {
		console.log("User "+player.id+" disconnected");
	}


	function drawPlayerList() {
		playerList.empty();
		var scoreList = sortScoreList();
		console.log(scoreList);
		for (var i=0; i<scoreList.length; i++) {
			playerList.append('<p class="margin2">'+scoreList[i].player+' score ' +scoreList[i].score+ '</p>');
		}
	}

	function clearFirst() {
		$('#combatlog').find('p:first').fadeOut(1000, function(){
			$('#combatlog').find('p:first').remove();
		});

	}
	
	function setRightSize() {
		var middleContainer = $("#middlecontainer").width();
		var containerWrapper = $("#containerWrapper").width();
		var newWidth = (containerWrapper-middleContainer)/2;
		console.log(middleContainer+":" + containerWrapper +":"+ newWidth );
		
		
		$("#leftcontainer").width(newWidth);
		$("#rightcontainer").width(newWidth);
		
	}

	function updateGameInfo() {
		$('#gameInfo').empty();
		var playersToStart = sgame.settings.playersToStart - sgame.players.length;
		if (playersToStart == 1){
			$('#gameInfo').append("<b>TRENGER BARE "+playersToStart+" SPILLER F�R SPILLET STARTER</b>");
		} else if (playersToStart > 1){
			$('#gameInfo').append("<b>TRENGER "+playersToStart+" SPILLERE F�R SPILLET STARTER</b>");
		} else if (playersToStart == 0) {
			$('#gameInfo').css('visibility', 'hidden');
		}

	}

	function sortScoreList(players) {
		if(players){
			var scoreArray = [];
			for (var i=0; i<players.length; i++) {
				var player = players[i];
				scoreArray.push({'player': player.nick, 'score': player.score});
			}

			function compare(a,b) {
				if (a.score < b.score)
					return 1;
				if (a.score > b.score)
					return -1;
				return 0;
			}
			return scoreArray.sort(compare);

		} else {
			var scoreArray = [];
			for (var i=0; i<sgame.players.length; i++) {
				var player = sgame.players[i];
				scoreArray.push({'player': player.nick, 'score': player.score});
			}

			function compare(a,b) {
				if (a.score < b.score)
					return 1;
				if (a.score > b.score)
					return -1;
				return 0;
			}
			return scoreArray.sort(compare);
		}

	}

}