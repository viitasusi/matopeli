// haetaan express

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// SQL-yhteys, yhteysparametrit default-asennossa
var mysql = require('mysql');
var connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : '1234',
	database : 'matodatabase'
});




app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});



io.on('connect', OnConnect);

//Yhteys

function OnConnect(socket){
	console.log("Client has connected.");
// kuuntelee rekisteröinti-eventtiä
	socket.on("registerUser", registerUser);
}


function registerUser(userData)  {
	var parsedData = JSON.parse(userData);
	var email = parsedData["email"];
	var username = parsedData["username"];
	var hashpsw = parsedData["password"];

	//DB-kysely

	connection.query(
		"SELECT kayttajatunnus FROM wormdb WHERE name = ?", [username],
		function(err, row, db) {
			if (row.length) {
				//viestiä varatusta nimestä?
				io.emit("nameOnUse", username);
			}

			else {
				connection.query(
					"INSERT INTO wormdb (email, kayttajatunnus, pswrd) VALUES (?. ?, ?)",
					[email, username, hashpsw],
					function(err, result){
						if (result.affectedRows) {
							io.emit("Tervetuloa käyttäjäksi ", username);
						}
					})
			}
		}
}








http.listen(3000, function(){
	console.log('kuunnellaan http://127.0.0.1:3000');
});