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
		$(game).on("clearGUI", onClearGUI);
		$(game).on("updateResultBoard", onUpdateResultBoard);
		$(game).on("startClock", onStartClock);

	};


	function onTick(event, snakeParts) {
		if(gui){
			gui.draw(sgame.getGUIElements());
			//gui.moveSnakes(snakeParts.data);
		}
		//gui.testTransition();

	};


	function onStartClock(event, time) {
		$('#timer').countdown('destroy'); 
		var seconds = time/1000;
		$('#timer').countdown({until: +seconds, compact: true, onExpiry: gameOver});
	}

	function gameOver() {
		communicator.gameTimedOut();
	}

	function onUpdateResultBoard(event, data) {
		console.log(data);
		var table = $('#resultTable');
		table.find('tr').each(function(index, row){
			var firstCell = $(row).find('td:eq(0)');
			if(firstCell.length > 0){
				var found = false;
				firstCell.each(function(index, td){
					var regExp = new RegExp(data.nick, 'i');
					if(regExp.test($(td).text())){
						$(row).find('td:eq(2)').text(data.answer);
					}

				});

			}
		});

	};

	function onClearGUI(event) {
		$("#dialogShowResult").dialog("close");
		playerList.empty();
		combatLog.empty();
	};

	function onShowResults(event, results) {
		$("#resultTable").empty();
		var players = results.players;
		var winner = results.winner;
		var scoreList = sortScoreList(players);
		for (var i=0; i<scoreList.length; i++) {
			$("#resultTable").append('<tr><td>'+scoreList[i].player+'</td><td>'+scoreList[i].score+'</td><td>Bestemmer seg...</td></tr>');
		}
		$("#dialogShowResult").dialog("open");
	};

	function onSnakeDied(event, data) {
		if ($("#combatlog p").length > 4) clearFirst();
		if (data.player.id == communicator.getID()){
			$('<p class="margin2">Du døde og tapte <strong class="bluetext">'+data.score+'</strong> poeng!</p>')
			.appendTo('#combatlog')
			.hide().fadeIn(1000);
		}
		drawPlayerList(); 
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
		if (data.player.id == communicator.getID()){
			$('<p class="margin2">Du validert '+data.word+'('+data.count+') for <strong class="bluetext">'+ data.score+'</strong> poeng!</p>')
			.appendTo('#combatlog')
			.hide().fadeIn(1000);
		}
		drawPlayerList();
	}



	function onValidationFailure(event, data) {
		if ($("#combatlog p").length > 4) clearFirst();

		if (data.player.id == communicator.getID()){
			if(data.word){
				if (data.score == -1) {
					combatLog.append('<p class="margin2">"'+data.word+'" er ikke et gyldig ord!</p>');
				}
				else {
					combatLog.append('<p class="margin2">'+data.word+' gir <strong class="bluetext">'+ data.score+'</strong> poeng siden du har validert det mer enn 3 ganger!</p>');	
				}
				
				
				
			}
		}
	}

	function onJoinedGame(event, game) {
		console.log("Joined game!")
		$('#title').text(game.mode.title);
		if(game.settings.score != 0 && game.settings.time == 0){
			$('#scorelist').text("SPILLERE! Første som får " + game.settings.score + " poeng vinner!");
		} else if (game.settings.score != 0 && game.settings.time != 0){
			$('#scorelist').text("SPILLERE! Første som får " + game.settings.score + " poeng eller har flest poeng når tiden går ut vinner!");
		} else {
			$('#scorelist').text("SPILLERE! Den spilleren som har har flest poeng når tiden går ut vinner!");
		}

	}

	function onPlayerJoined(event, player) {
		console.log("Player "+player.nick+" joined");
		if (gui){
			gui.draw(sgame.getGUIElements());
		}
		drawPlayerList();
		updateGameInfo();
		setRightSize();
		communicator.updateDB();
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
		communicator.updateDB();
	}


	function drawPlayerList() {
		playerList.empty();
		var scoreList = sortScoreList();
		console.log(scoreList);
		for (var i=0; i<scoreList.length; i++) {
			playerList.append('<p class="margin2">'+scoreList[i].player+' har <strong class="bluetext">'+scoreList[i].score+'</strong> poeng!</p>');
			
		}
	}

	function clearFirst() {
		$('#combatlog').find('p:first').fadeOut(1000, function(){
			$('#combatlog').find('p:first').remove();
		});

	}

	function setRightSize() {
		var middleContainer = $("#middlecontainer").width();
		var containerWrapperW = $("#containerWrapper").width();
		var newWidth = (containerWrapperW-middleContainer)/2;
		var gameGui = $("#gamegui").height();
		$("#leftcontainer").width(newWidth-1);
		$("#rightcontainer").width(newWidth+0.5);
		var header = $("#header").height();
		$("#containerWrapper").height(gameGui+header);
		var containerWrapperH = $("#containerWrapper").height();
		$("#pageWrapper").height(containerWrapperH);
		$("#containerWrapper").height(gameGui);

	}

	function updateGameInfo() {
		$('#gameInfo').empty();
		var playersToStart = sgame.settings.playersToStart - sgame.players.length;
		if (playersToStart == 1){
			$('#gameInfo').append("<b>TRENGER BARE "+playersToStart+" SPILLER FØR SPILLET STARTER</b>");
		} else if (playersToStart > 1){
			$('#gameInfo').append("<b>TRENGER "+playersToStart+" SPILLERE FØR SPILLET STARTER</b>");
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