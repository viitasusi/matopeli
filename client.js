var socket = io();

function login(){
	var user = document.getElementsByName("username");
	var pswrd = document.getElementsByName("password");
	//login button id
	var loginButton = document.getElementsByName('tarttee nappulan nimen');






	
}


function register(){
	var regEmail = document.getElementsByName("email");
	var regUser = document.getElementsByName("registername");
	var regPswrd = document.getElementsByName("registerpassword");

	//salasanan muodostus ja tietojen lähetys serverille

	var hash = CryptoJS.SHA256(regPswr.value).toString();

	//tietojen lähetys
	socket.emit("registerUser", JSON.stringify({ email: regEmail.value, username: regUser.value, password: hash}));


}

//jo olevan käyttäjätiedon viesti
socket.on("nameOnUse")