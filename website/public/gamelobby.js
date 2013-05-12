var gameLobbyTable;
var arrayAddress = [];
var goTo = "";
var spinValue = 0;

$("document").ready(function() {
	/**
	 * Setting table
	 *
	 */

	gameLobbyTable = $('#gamelobbytable').dataTable({
		"bJQueryUI": true,
		"sPaginationType": "full_numbers",
		"oLanguage": {
			"sLengthMenu": "Display _MENU_ records per page",
			"sZeroRecords": "Lage ett spill!",
			"sInfo": "Det er totalt _TOTAL_ spill!",
			"sInfoEmpty": "Ingen tilgjengelig spill",
			"sInfoFiltered": "Filtrert etter spill"
		},
		"bPaginate": false,
		"bLengthChange": true,
		"bFilter": false,
		"bSort": true,
		"bInfo": true,
		"bAutoWidth": true,
		"sScrollY": "300px",
		"bScrollCollapse": false

	});
	$(".tablebutton").button();
	/**
	 * Binding buttons
	 */
	$('#menu').button()
	.bind('click', "", redirect);

	$('#createit').button();

	$('#refresh').button()
	.bind('click', "", getlistofgames);


	//checking for mobile device
	(function(a){(jQuery.browser=jQuery.browser||{}).mobile=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))})(navigator.userAgent||navigator.vendor||window.opera);
	if (jQuery.browser.mobile) {
		//do stuff for mobile device
	};

	$( "#dialog" ).dialog({
		autoOpen: false,
		title: "Lag spill",
		draggable: false,
		width: 600,
		height: 610,
		buttons: [
		          {
		        	  text: "LAG SPILL!",
		        	  click: function() {
		        		  creategame();
		        		  $( this ).dialog( "close" );

		        	  }
		          },
		          {
		        	  text: "TILBAKE",
		        	  click: function() {
		        		  $( this ).dialog( "close" );
		        	  }
		          }
		          ]
	});

	$( "#createit" ).click(function( event ) {
		$( "#dialog" ).dialog( "open" );
		event.preventDefault();
	});

	$("#slider").slider({
		min: 2,
		max: 20,
		slide: function( event, ui ) {
			$("#players").val(ui.value);
		},
	});

	getlistofgames();
	$(document).tooltip();
	$("#time").spinner({
		min: 0,
		spin: function(event, ui) {
				spinValue = ui.value;
	  },
	  	stop: function( event, ui ) {
	  		if (spinValue == 0 ) {
	  			$("#time").spinner("value", "Evig");
	  		}
	  },
	});
	
});




/**
 * Navigation functions
 */

function redirect(url) {
	window.location = "http://" +location.host +"/" + url.data;		
};



function addToTable(games) {
	emptyTable();
	arrayAddress = [];
	for (var i = 0; i < games.length; i++) {
		var mode = games[i].gameMode;
		if (mode == "SPELLINGMODE") mode = "STAVING";
		else if (mode == "MATHMODE") mode = "MATTE";
		
		var id = "button"+i;
		gameLobbyTable.fnAddData([
		                          games[i].name,
		                          games[i].players.inGamePlayers+"/"+games[i].players.playersNeededToStart,
		                          mode,
		                          games[i].status,
		                          '<button class="tablebutton textSize" id="'+id+'" >SPILL</button>',
		                          ]);
		arrayAddress.push({'address' : games[i].address, 'buttonid' : id, 'gamemode' : games[i].gamemode, 'themename' : games[i].themeName});
	}

	$(".tablebutton").button();
	
	$("#gamelobbytable").on( 'click', 'button.tablebutton', function(e) {
		e.preventDefault();
		for (var s = 0; s <arrayAddress.length; s++) {
			if (arrayAddress[s].buttonid == $(this).attr('id')){
				goTo = arrayAddress[s].address;
				break;
			}
		}
		goTO();
	});
}


function emptyTable() {
	gameLobbyTable.fnClearTable();
}

function joinGame(data) {
	data.preventDefault();
	console.log("YO");
	console.log(data);
};

function goTO() {
	window.location = goTo;

}

/**
 * Starting a new node server and creating a game
 */

function creategame() {
	$.ajax({
		type: "POST",
		url: "./startnode",
		data: {
			gamename: $("#gamename").val(),
			gamemodename: $("#gamemodelist").val(),
			gamemodedata: $("#modedataList").val(),
			password: $("#password").val(), 
			players: $("#players").val(),
			mapsize: $("#mapsize").val(),
			wallcrash: $("#wallcrash:checked").val(),
			helppowerup: $("#helppowerup:checked").val(),
			adress: "http://" +location.host +"/",
			score: $("#score").val(),
			time: $("#time").val(),
		},
		dataType: "json",
		success: function(response) {
			console.log(response.msg);
			getlistofgames();
		}
	});
};



function getlistofgames(){
	$.ajax({
		type: "POST",
		url: "./findGameServers",
		dataType: "json",
		success: function(response) {
			console.log(response.msg);
			if (response.gameServers.length > 0){
				addToTable(response.gameServers);
			} else {
				console.log("No servers");
			}
		}
	});
};



//polls from server database
function fillModeDataList(){
	$.ajax({
		type: "POST",
		url: "./fillModeDataList",
		data: {
			modetype : $("#gamemodelist").val()
		},
		dataType: "json",
		success: function(response) {
			console.log(response.response);
			$('#modedataList').empty();
			for (var i = 0; i < response.names.length; i++){
				$('#modedataList').append('<option value = "'+response.names[i]+'">'+response.names[i]+'</option>');
			}
		}
	});
};



