// haetaan express

var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

// SQL-yhteys, yhteysparametrit default-asennossa
var mysql = require('mysql');


var connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : '1234',
	database : 'matodatabase'
});

connection.connect();

app.use("/", express.static(__dirname));


app.get('/', OnGet);


function OnGet(req, res){
	res.sendFile(__dirname + '/index.html');
};



io.on('connect', OnConnect);

//Yhteys

function OnConnect(socket){
	console.log("Client has connected.");
// kuuntelee rekisteröinti-eventtiä
//Lisätään myöhemmin myös login-eventin kuuntelu
	socket.on("registerUser", registerUser);
}


function registerUser(userData)  {
	var parsedData = JSON.parse(userData);
	var email = parsedData["email"];
	var username = parsedData["username"];
	var hashpsw = parsedData["password"];
	console.log("infoa saatu" + email + ' ' + username + ' ' + hashpsw);

	var addData = "INSERT INTO wormdb (email, kayttajatunnus, pswrd) VALUES (?, ?, ?)";

	connection.query(addData, [ email, username, hashpsw ]);
	//DB-kysely

	/*connection.query(

		
		"SELECT email FROM wormdb WHERE email = ?", [email],
		function(err, rows, db) {
			if (rows.length) {
				//viestiä varatusta nimestä?
				io.emit("nameOnUse", email);
			}

			else { 
				connection.query(
					"INSERT INTO wormdb (email, kayttajatunnus, pswrd) VALUES (?, ?, ?)",
					[email, username, hashpsw],
					function(err, result){
						if (result.affectedRows) {
							io.emit("Tervetuloa käyttäjäksi ", username);
						}

			 			else
						{
							io.emit("Rekisteröinti epäonnistui.");
						}
					});
			
		
			}
//	});*/
}



http.listen(3000, function(){
	console.log('kuunnellaan http://127.0.0.1:3000');
});