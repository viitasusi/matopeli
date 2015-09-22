// haetaan express

var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

// SQL-yhteys, yhteysparametrit default-asennossa
var mysql = require('mysql');
var email = '123@123.fi';


var connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : 'Cac0f0n3',
	database : 'matodatabase'
});

connection.connect();

app.use("/", express.static(__dirname));


app.get('/', OnGet);

app.get('/matopeli', function(req, res){
	res.sendFile(__dirname + '/matopeli.html');
});


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
	socket.on("loginUser", loginUser);
	socket.on('highestScores', getHighestScores);
	socket.on('registerScore', personalRecordScore);
}

function getHighestScores() {
	var scoreQUery = "SELECT kayttajatunnus, score FROM wormdb ORDER BY score DESC LIMIT 10";
	connection.query(scoreQUery, function(err, rows, fields){
		
		if(err) throw err;

		console.log(rows);
		socket.emit('highScores', rows);
	});
}

function personalRecordScore(userData) {
	console.log(userData.playerScore);
	//var parsedData = JSON.parse(userData);

	var score = userData.playerScore;
	//console.log(parsedData.playerScore);
	console.log(score);
	var scoreQuery = "SELECT score FROM wormdb WHERE email = '" + email + "'";
	connection.query(scoreQuery, function(err, rows, fields) {
		if (err) throw err;

		console.log(rows[0]);

		if (rows[0].score == null || rows[0].score < score) {
			connection.query("UPDATE wormdb SET score = (?) WHERE email = (?)", [score, email]);
			console.log("highScore, YAY!")	
			
			
		}
	})

}

function loginUser(userData, res) {
	var parsedData = JSON.parse(userData);
	var logEmail = parsedData["Lemail"];
	email = parsedData["Lemail"];
	var logpsw = parsedData["Lpassword"];
	console.log("infoa saatu" + logEmail + ' ' + logpsw);

	var searchUser = "SELECT kayttajatunnus, pswrd FROM wormdb WHERE email = ?"; 
	var pswrd = "SELECT kayttajatunnus, pswrd FROM wormdb WHERE email = ?";





		

	connection.query( searchUser, [ logEmail, logpsw ], function(){
		if (searchUser != null){
			
				if ( pswrd[ logEmail ] == logpsw){
					io.emit("welcome");
					res.sendFile(__dirname + '/matopeli.html');

				
				}

				else {
					io.emit("unknownUser");
				}
		}

		else {
			io.emit("unknownUser");
		}
	} ); 

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