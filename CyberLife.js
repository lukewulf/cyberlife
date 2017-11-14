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
    $("#yourPlantsButton").show();

   	var potRef = firebase.database().ref("Pots/Pot0");
   	var userPotRef = firebase.database().ref("Users/" + id + "/pots");
   	userPotRef.on('value', function(snap){
   		var numPots = snap.val().num;
   		for(; numDisplayed < numPots; numDisplayed++){
   			insertRow(0, "ExamplePot");
   		}
   	});
   	//insertRow(0, "poiure");

  } else {

  	//UI updates
  	$("#current-user-id").text("");
  	$("#current-user-email").text("");
  	$("#signout-button").hide();
  	$("#signin-button").show();
  	$(".login-cover").hide();
  	$("#yourPlantsButton").hide();
  	id = null;
  	email = null;
 
  }
});

/*login-onCLick */
$("#login-button").click(
	function(){
		var email = $("#login-email").val();
		var password = $("#login-password").val();
		if(email && password){
				//Buffer Animation
				$("#login-progress").show();
				$('#register-button').hide();
				$("#login-button").hide();
				$("#login-error").text("");

				//Sign In Function
				firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error){

					//Reset Login Page
					$("#login-error").show().text(error.message);
					$("#login-progress").hide();
					$('#register-button').show();
					$("#login-button").show();
				});
		}
	}
);

/* Signin-onClick */
$("#signin-button").click(
	function(){
		// Show the sign-in overlay
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
);

/* Signout-onClick */
$("#signout-button").click(
	function(){
		firebase.auth().signOut().then(function(){
			//Sign-out successful
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
				waterLevel: 0
			});
		}
		else{
			alert("Please Be Signed In");
		}

		//Adding Pot to Pot LIst
		$("#pot-id").val("");
	}
);

/* 
 * Reads the database, then inserts the correct values into the doc
 * using a helper method addTableRow
 */
function insertRow(i, potID){
	
	var potRef = firebase.database().ref('Pots/' + potID);
	potRef.on('value', function(snap){
		
		var plantName = snap.val().plantName;
		var delay = snap.val().delay;
		var auto = snap.val().autoWater;
		var lastWatered = snap.val().lastWatered;
		var waterLevel = snap.val().waterLevel;

		addTableRow(i, plantName, delay, auto, lastWatered, waterLevel);
	});
}

/* Helper method to inject the html table row into the document */
function addTableRow(i, plantName, delay, auto, lastWatered, waterLevel){

	var table = document.getElementById('pot-table-2');
	var new_row = table.rows[1].cloneNode(true);
	var len = table.rows.length;
	var id;

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
    
	table.appendChild(new_row);
}