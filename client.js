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

socket.on("welcome", function(){
	console.log("Succesful login");
	confirm("Tervetuloa! Paina OK jatkaaksesi peliin.");
	
});

socket.on("unknownUser", function(){
	console.log("Unknown user");
});