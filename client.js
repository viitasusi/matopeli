//muuttujia
							var regEmail;
							var regUser;
							var regPswrd;
							var regButton;




							//socket.io
							var socket = io();

							//sivun latautuessa suoritettava metodi, haetaan viittaukset
							onload = function(){
								//rekisteröintipalikoiden viittaukset
								regEmail = document.getElementById("regEmail");
								regUser = document.getElementById("registername");
								regPswrd = document.getElementById("registerpassword");
								regButton = document.getElementById("regButton");

								//Lisätään login-viittaukset myöhemmin

							} 



							function login () {

								console.log("User login");

								console.log("Loggaus");
								var logHash = CryptoJS.SHA256(logPassword.value).toString();

								socket.emit("loginUser", JSON.stringify({ Lemail: logEmail.value, Lpassword: logHash}));
								}



								//rekisteröiti

							function registerUser() {
								console.log("register user");	

								/*regEmail = document.getElementById("email");
								regUser = document.getElementById("registername");
								regPswrd = document.getElementById("registerpassword");*/
								
								//salasanan muodostus ja tietojen lähetys serverille

								console.log("Rekisteröinti");
								var hash = CryptoJS.SHA256(regPswrd.value).toString();

								//tietojen lähetys
								socket.emit("registerUser", JSON.stringify({ email: regEmail.value, username: regUser.value, password: hash}));
								}

							





//jo olevan käyttäjätiedon viesti
socket.on("nameOnUse")

socket.on("list"), function(clients) {
	console.log("listan päivitys");
	var div = document.getElementById('lista');
	div.innerHTML = clients[];
}

socket.on("welcome", function(){
	console.log("Succesful login");
	var r = confirm("Tervetuloa " + kayttajatunnus + "! Paina OK jatkaaksesi peliin.")
	
	if (r == true)
	{
		window.location.replace("/matopeli.html");
	}

	else
	{
		socket.emit("disconnect");
	}
});

socket.on("unknownUser", function(){
	console.log("Unknown user");
});