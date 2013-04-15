var eventhandler = new function() {

	var playerList = $('#players2');
	var combatLog = $('#combatlog');

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
	};

	function onSnakeDied(event, player) {
		console.log("Players snake died: "+player.nick);
	}

	function onFoodSpawn(event, food) {
		//console.log(food)
	}

	function onFoodEaten(event, food) {
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
		drawPlayerList();
	}

	function onPlayerLeft(event, player) {
		console.log("Player "+player.nick+" left");
		drawPlayerList();
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

	function sortScoreList() {
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