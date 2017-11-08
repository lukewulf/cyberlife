/** Test Enviroment for Random Things */
$(document).ready(function(){
	var rootRef = firebase.database().ref().child("Users");
	rootRef.on("child_added", snap => {
		var name = snap.child("name").val();
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

/* Listener for changing user signin/signout state */
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    $(".login-cover").hide();

    var dialog = document.querySelector('#login-dialog');
    if(!dialog.showModal){
    	dialogPolyfill.registerDialog(dialog);
    }
    dialog.close();
    var id = user.uid;
    $("#current-user").text(id);
    $("#signin-button").hide();
    $("#signout-button").show();
    $("#yourPlantsButton").show();
    

  } else {

  	$("#current-user").text("");
  	$("#signout-button").hide();
  	$("#signin-button").show();
  	$(".login-cover").hide();
  	$("#yourPlantsButton").hide();
 
  }
});

/* Login-onCLick */
$("#login-button").click(
	function(){
		var email = $("#login-email").val();
		var password = $("#login-password").val();

		if(email && password){
				$("#login-progress").show();
				$('#register-button').hide();
				$("#login-button").hide();


				firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error){

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
	// No user is signed in.
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
			//Sign-out failed
			alert(error.message);
		});
	}
);

/* Register On Click */
$("#register-button").click(
	function(){
		var email = $("#login-email").val();
		var password = $("#login-password").val();
		if(email && password){
			$("#login-progress").show();
				$('#register-button').hide();
				$("#login-button").hide();

				firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {

					$("#login-error").show().text(error.message);
					$("#login-progress").hide();
					$('#register-button').show();
					$("#login-button").show();
				});

		}
	}
);
