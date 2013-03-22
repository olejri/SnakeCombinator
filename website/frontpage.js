$("document").ready(function() {
	$('#start').bind('click', startnode); 
});



function startnode() {
	// CLIENT
	$.ajax({
	        type: "POST",
	        url: "./startnode",
	        data: {
	                
	        },
	        dataType: "json",
	        success: function(response) {
	                console.log(response);
	        }
	});

	window.location = "http://localhost:34509"	
};