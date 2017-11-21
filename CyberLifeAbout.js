var user = firebase.auth().currentUser;

try{
	var name = user.uid;
	$('#uid').text(name);
}catch(e){
	$('#uid').text(e);
}

