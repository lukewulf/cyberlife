/** Test Enviroment for Random Things */
$(document).ready(function(){
	var rootRef = firebase.database().ref().child("Users");
	rootRef.on("child_added", snap => {
		var name = snap.child("uid").val();
		var email = snap.child("email").val();

		$("#table_body").append("<tr><td>" + name + "</td><td>" + email + "</td><td><button>Water</button></td></tr>");
		
	});


});

var mainText = document.getElementById("mainText");
var submitButton = document.getElementById("submitButton");
var submitText = document.getElementById("submitText");


//window.alert("Print String Command for Browser Window for Checks");
var firebaseHeadingRef = firebase.database().ref().child("Heading");

firebaseHeadingRef.on('value', function(datasnapshot){
	mainText.innerText = datasnapshot.val();
});

function submitClick(){

	var firebaseRef = firebase.database().ref();
	var messageText = submitText.value;

	firebaseRef.child("Text").push().set(messageText);
	firebaseRef.child("Heading").set(messageText);
}

/* End Test Enviroment */

/* Begin CyberLife Site */

var id;
var email;
var registerFlag = false;
var numDisplayed = 0;
var potArray = [];
var saveFlag = false;
var firstTry = true;
var ids = ['null'];

/* Register On Click */
$("#register-button").click(
	function(){
		var email = $("#login-email").val();
		var password = $("#login-password").val();
		if(email && password){
			//Buffering animation
			$("#login-progress").show();
			$('#register-button').hide();
			$("#login-button").hide();

			//Create new user
			firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
				//Error MSG and Handle
				$("#login-error").show().text(error.message);
				$("#login-progress").hide();
				$('#register-button').show();
				$("#login-button").show();
				return;
			});
			registerFlag = true;
		}
	}
);
//Auto-signout on refresh, fixes some weird problems until I find a way to fix other erros
firebase.auth().signOut();
//console.log("Automatic Sign Out Called");
$("#tableContainer").hide();

//$("#signout-button").hide();
//$("#yourPlantsButton").hide();

/*if(firebase.auth().currentUser){
	console.log(firebase.auth().currentUser.uid);
}*/

console.log(firebase.auth().currentUser);

/* Listener for changing user signin/signout state */
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.

    //Hide the Login Page
    $(".login-cover").hide();
    var dialog = document.querySelector('#login-dialog');
    if(!dialog.showModal){
    	dialogPolyfill.registerDialog(dialog);
    }
    dialog.close();

    id = user.uid;
    email = user.email;


    //Set User Data Everytime they sign in, need to fix but works
    //Quits if there is already that user in the database
    var userList = firebase.database().ref('Users');
    if(registerFlag){
	    userList.child(id).set({
	    	uid: id,
	    	email: email,
	    	pots: {
	    		num: 0
	    	}
	    });
    }

    //Setting textfields for debugging
    $("#current-user-email").text("User Email: " + email);
    $("#current-user-id").text("User ID: " + id);

    //UI updates
    $("#signin-button").hide();
    $("#signout-button").show();
    $("#yourPlantsPage").show();
    $("#pot-table-2").show();
    

   	var potRef = firebase.database().ref("Pots/Pot0");
   	var userPotRef = firebase.database().ref("Users/" + id + "/pots");
   	savePreferences(userPotRef);
   	//$("table tr:nth-child(2)").remove();
   	//$("#placeholder-header").hide();

  } else {

  	//UI updates
  	$("#current-user-id").text("");
  	$("#current-user-email").text("");
  	$("#signout-button").hide();
  	$("#signin-button").show();
  	$(".login-cover").hide();
  	$("#yourPlantsPage").hide();
  	$('#about').hide();
  	id = null;
  	email = null;

	$("pageTitle").text("Home");
	$("#pot-table-2").hide();

	 
  }
});

function savePreferences(userPotRef){
	userPotRef.on('value', function(snap){

	   		snap.forEach(function(childSnapshot){
	   			if(isNaN(childSnapshot.val())){
	   				//Area to populate snapshot
	   				//console.log(childSnapshot.val().potID);
	   				var i = 0;
	   				for(; i < potArray.length; i++){
	   					if(potArray[i] == childSnapshot.val().potID){
	   						return;
	   					}
	   				}
					potArray[potArray.length] = childSnapshot.val().potID;
	   				insertRow(childSnapshot.val().potID);
	   			}
	   		});
	});
}
/*login-onCLick */
$("#login-button").click(
	function(){
		var email = $("#login-email").val();
		var password = $("#login-password").val();
		login(email, password);
		/*if(email && password){
				//Buffer Animation
				$("#login-progress").show();
				$('#register-button').hide();
				$("#login-button").hide();
				$("#login-error").text("");

				//Sign In Function
				firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error){
					firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
					//Reset Login Page
					$("#login-error").show().text(error.message);
					$("#login-progress").hide();
					$('#register-button').show();
					$("#login-button").show();
				});
		}*/
	}
);

/* Signin-onClick */
$("#signin-button").click(
	function(){
		register();
		// Show the sign-in overlay
		/*
	    $(".login-cover").show();
	    $("#login-progress").hide();
		$('#register-button').show();
		$("#login-button").show();
		$("#login-email").val("");
		$("#login-password").val("");
	    var dialog = document.querySelector('#login-dialog');
	    if(!dialog.showModal){
	    	dialogPolyfill.registerDialog(dialog);
	    }
	    dialog.showModal();*/
	}
);

$("#register-Pot").click(function() {
	register();
})

/* Signout-onClick */
$("#signout-button").click(
	function(){
		firebase.auth().signOut().then(function(){
			//Sign-out successful
			console.log("Sign Out Successful");
			$('#about').hide();
			$('#greeting').show();
			$('#tableContainer').hide();
			$('#pageTitle').text("Home");
		}, function(error){
			//Sign-out failed, show error msg
			alert(error.message);
		});
	}
);

$("#add-pot-button").click(
	function(){
		var potID = $("#pot-id").val();

		if(id){

			var found = false;
			var userPotRef = firebase.database().ref("Pots");
	   		userPotRef.on('value', function(snap){

		   		snap.forEach(function(childSnapshot){
		   			console.log("test");
		   			if(!found){
			   			if(childSnapshot.val().potID == potID){
			   					found = true;
			   			}
		   			}
		   		});
		   	});

		   	if(found){
		   		console.log("Found");
		   		var increment = true;
		   		var repeatPot = false;
		   		var i = 0;
		   		for(; i < potArray.length; i++){
		   			if(potArray[i] == potID){
		   				alert("Found Repeat Pot");
		   				repeatPot = true;
		   			}
		   		}
		   		if(!repeatPot){
			   		var userPotList = firebase.database().ref('Users/' + id + '/pots');
			   		var potRef = firebase.database().ref('Pots/' + potID);

			   		//Adding uid to pot
			   		potRef.update({uid: id});

			   		//Adding pot to user
			   		userPotList.child(potID).set({
			   			potID: potID
			   		});

			   		//num++ within firebase to get the correct number of pots that the user has
					currentNum = firebase.database().ref('Users/' + id + '/pots/num');
					currentNum.transaction(function(num){
						if(increment){
							if(num || (num == 0)){
								num = num + 1;
							}
							return num;
						}
						increment = false;
					});		   			
		   		}
		   	}
		   	else{
		   		alert("Please connect the pot to the internet");
		   	}
		}
		else{
			alert("Please Be Signed In");
		}

		//Adding Pot to Pot LIst
		$("#pot-id").val("");
	}
);

function addPot(){
	var potID = $("#pot-id").val();

		if(id){

			var found = false;
			var userPotRef = firebase.database().ref("Pots");
	   		userPotRef.on('value', function(snap){

		   		snap.forEach(function(childSnapshot){
		   			console.log("test");
		   			if(!found){
			   			if(childSnapshot.val().potID == potID){
			   					found = true;
			   			}
		   			}
		   		});
		   	});

		   	if(found){
		   		console.log("Found");
		   		var increment = true;
		   		var repeatPot = false;
		   		var i = 0;
		   		for(; i < potArray.length; i++){
		   			if(potArray[i] == potID){
		   				alert("Found Repeat Pot");
		   				repeatPot = true;
		   			}
		   		}
		   		if(!repeatPot){
			   		var userPotList = firebase.database().ref('Users/' + id + '/pots');
			   		var potRef = firebase.database().ref('Pots/' + potID);

			   		//Adding uid to pot
			   		potRef.update({uid: id});

			   		//Adding pot to user
			   		userPotList.child(potID).set({
			   			potID: potID
			   		});

			   		//num++ within firebase to get the correct number of pots that the user has
					currentNum = firebase.database().ref('Users/' + id + '/pots/num');
					currentNum.transaction(function(num){
						if(increment){
							if(num || (num == 0)){
								num = num + 1;
							}
							return num;
						}
						increment = false;
					});		   			
		   		}
		   	}
		   	else{
		   		alert("Please connect the pot to the internet");
		   	}
		}
		else{
			alert("Please Be Signed In");
		}

		//Adding Pot to Pot LIst
		$("#pot-id").val("");
}
$("#dummy-add").click(function(){

		if(id){

			var potID = $("#pot-id").val();
			var newPot = true;
			var userPotRef = firebase.database().ref("Pots");
	   		userPotRef.on('value', function(snap){

		   		snap.forEach(function(childSnapshot){
		   			if(newPot){
		   				//console.log(childSnapshot.val().potID);
			   			if(childSnapshot.val().potID == potID){
			   					newPot = false;
			   			}
		   			}
		   		});
		   	});
		   	if(newPot){
				//Adding Pot to User Reference
				currentUserRef = firebase.database().ref('Users/' + id + '/pots');
				currentUserRef.child(potID).set({
					potID: potID
				});

				//num++ within firebase to get the correct number of pots that the user has
				currentNum = firebase.database().ref('Users/' + id + '/pots/num');
				currentNum.transaction(function(num){
					if(num || (num == 0)){
						num = num + 1;
					}
					return num;
				});

				//Adding Pot to Pot LIst
				potListRef = firebase.database().ref('Pots');
				potListRef.child(potID).set({
					IP: 0,
					MAC: 0,
					amountWater: 0,
					autoWater: false,
					delay: 0,
					lastWatered: 0,
					plantName: 0,
					moisture: 0,
					uid: firebase.auth().currentUser.uid,
					waterLevel: 0,
					potID: potID
				});		   		
		   	}
			else{
		   		alert("Pot is already created");
			}
		}
		else{
			alert("Please be signed in");
		}
});

/* 
 * Reads the database, then inserts the correct values into the doc
 * using a helper method addTableRow
 */
function insertRow(potID){

	//console.log("insertRow called: " + potID);

	var potRef = firebase.database().ref('Pots/' + potID);

	potRef.on('value', function(snap){
		if(!saveFlag){
			var previouslyInserted = false;
			var repeatID;
			for(var i = 0; i < ids.length; i++){
				if(potID === ids[i]){
					previouslyInserted = true;
					repeatID = potID;
				}
			}
			if(!previouslyInserted){
				var plantName = snap.val().plantName;
				var delay = snap.val().delay;
				var auto = snap.val().autoWater;
				var lastWatered = snap.val().lastWatered;
				var time = new Date(lastWatered * 1000);
				var waterLevel = snap.val().waterLevel;
				var ledState = snap.val().led_state;
				ids.push(potID);
				addTableRow(plantName, delay, auto, time.toLocaleString(), waterLevel, potID, ledState);
			}
			else{
				console.log("found repeat plant");
				updateTableRow(repeatID);
			}
		}
		saveFlag = false;
	});
}

function updateTableRow(repeatID){
		var table = document.getElementById('pot-table-2');
		console.log(table.rows.length);
		for(var i = 0; i < table.rows.length; i++){
			if(repeatID === table.rows[i].cells[7].innerText){
				var potRef = firebase.database().ref('Pots/' + repeatID);
				potRef.once('value', function(snap){
					var plantName = snap.val().plantName;
					var delay = snap.val().delay;
					var auto = snap.val().autoWater;
					var lastWatered = snap.val().moisture;
					var time = new Date(lastWatered * 1000);
					var waterLevel = snap.val().moisture;
					var ledState = snap.val().led_state;

					var editRow = table.rows[i];
					var inp0 = editRow.cells[0].getElementsByTagName('textarea')[0];
					inp0.value = plantName;

					var inp1 = editRow.cells[1].getElementsByTagName('textarea')[0];
					inp1.value = delay;
					

					var inp2 = editRow.cells[2].getElementsByTagName('input')[0];
					if(inp2){
						inp2.checked = auto;
					}

					editRow.cells[3].innerText = time.toLocaleString();
					editRow.cells[4].innerText = waterLevel;
					var inp8 = editRow.cells[8].getElementsByTagName('input')[0];
					if(inp8){
						inp8.checked = ledState;
					}
				});
				return;
			}
		}
}
/* Helper method to inject the html table row into the document */
function addTableRow(plantName, delay, auto, lastWatered, waterLevel, potID, ledState){


		var table = document.getElementById('pot-table-2');
		var new_row = table.rows[1].cloneNode(true);
		var len = table.rows.length;
		var id;

		new_row.id += len;
		console.log(new_row.id);

		var inp0 = new_row.cells[0].getElementsByTagName('textarea')[0];
	    inp0.id += len;
	    inp0.value = plantName;
	    id = inp0.id;
	    inp0.for = id;

	    var inp1 = new_row.cells[1].getElementsByTagName('textarea')[0];
	    inp1.id += len;
	    inp1.value = delay;
	    id = inp1.id;
	    inp1.for = id;

	    var inp2 = new_row.cells[2].getElementsByTagName('input')[0];
	    if(inp2){
		    inp2.id += len;
		    inp2.value = auto;
		    id = inp2.id;
		    inp2.for = id;
		    inp2.checked = auto;
		}

	    var inp3 = new_row.cells[3].getElementsByTagName('p')[0];
	    new_row.cells[3].innerHTML = lastWatered;

	    var inp4 = new_row.cells[4].getElementsByTagName('p')[0];
	    new_row.cells[4].innerHTML = waterLevel;
	    
	    var inp5 = new_row.cells[5].getElementsByTagName('button')[0];
	    if(inp5){
	    	inp5.id += len;
	    }

	    var inp6 = new_row.cells[6].getElementsByTagName('button')[0];
	    if(inp6){
	    	inp6.id += len;
	    }
	    
	    var inp7 = new_row.cells[7].getElementsByTagName('p')[0];
	    if(inp7){
	    	inp7.id += len;
	    	var newID = inp7.id;
	    }
	    new_row.cells[7].innerHTML = "<p id=\"" + newID + "\">" + potID + "</p>";

	    var inp8 = new_row.cells[8].getElementsByTagName('input')[0];
	    if(inp8){
		    inp8.id += len;
		    inp8.value = ledState;
		    id = inp8.id;
		    inp8.for = id;
		    inp8.checked = ledState;
		}

		table.appendChild(new_row);

}

function saveState(btnID){
	var index = btnID.slice(9, btnID.length);
	var potID = ("#potUID" + index);
	var delayID = ("#delayTime" + index);
	var plantID = ("#plantName" + index);
	var checkID = ("#autoWater" + index);
	saveFlag = true;

	var pot = $(potID).text();
	potListRef = firebase.database().ref('Pots');
	potListRef.child(pot).update({
		plantName: $(plantID).val(),
		delay: $(delayID).val(),
		autoWater: $(checkID).is(':checked')
	});

}

function waterPlant(btnID){
	var index = btnID.slice(8, btnID.length);
	
	var potID = ("#potUID" + index);
	var pot= $(potID).text();

	potListRef = firebase.database().ref('Pots');
	potListRef.child(pot).update({
		water_now: true
	});

	//alert(btnID.slice($("#" + potID).val()));
}

function lightsOn(btnID){
	
	var index = btnID.slice(5, btnID.length);
	var potID = ("#potUID" + index);
	var pot= $(potID).text();
	console.log(pot);

	potListRef = firebase.database().ref('Pots');
	potListRef.child(pot).update({
		led_state: $("#" + btnID).is(":checked")
	});
}

$("#aboutPage").click(function(){
	$('#about').show();
	$('#tableContainer').hide();
	$('#greeting').hide();
	$('#pageTitle').text("About");
});

$("#yourPlantsPage").click(function(){
	$('#about').hide();
	$('#greeting').hide();
	$('#tableContainer').show();
	$('#pageTitle').text("Your Plants");
});

$("#homePage").click(function(){
	$('#about').hide();
	$('#greeting').show();
	$('#tableContainer').hide();
	$('#pageTitle').text("Home");
})

$("#login-email").keypress(function(e){
	if (e.keyCode == 13) {
		var email = $("#login-email").val();
		var password = $("#login-password").val();
		login(email, password);
	}
})

$("#login-password").keypress(function(e){
	if (e.keyCode == 13) {
		var email = $("#login-email").val();
		var password = $("#login-password").val();
		login(email, password);
	}
})

function login(email, password) {
	if(email && password){
		//Buffer Animation
		$("#login-progress").show();
		$('#register-button').hide();
		$("#login-button").hide();
		$("#login-error").text("");

			//Sign In Function
		firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error){
			firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
			//Reset Login Page
			$("#login-error").show().text(error.message);
			$("#login-progress").hide();
			$('#register-button').show();
			$("#login-button").show();
		});
	}
}

function register() {
	$(".login-cover").show();
	$("#login-progress").hide();
	$('#register-button').show();
	$("#login-button").show();
	$("#login-email").val("");
	$("#login-password").val("");
	var dialog = document.querySelector('#login-dialog');
	if(!dialog.showModal){
	   	dialogPolyfill.registerDialog(dialog);
    }
    dialog.showModal();
}