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
	socket.on('chatMessage', publishChatMessage);


}

function publishChatMessage(msg) {
	io.emit('messageFromServer', msg);
}

function getHighestScores() {
	console.log('highscore');
	var scoreQUery = "SELECT kayttajatunnus, score FROM wormdb ORDER BY score DESC LIMIT 10";
	connection.query(scoreQUery, function(err, rows, fields){
		console.log('highscorequery');
		if(err) throw err;

		console.log(rows);
		io.emit('highScores', rows);
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



function loginUser(userData) {
	var parsedData = JSON.parse(userData);
	var logEmail = parsedData["Lemail"];
	var logpsw = parsedData["Lpassword"];
	console.log("infoa saatu" + logEmail + ' ' + logpsw);

	
	var userQuery = "SELECT kayttajatunnus, pswrd FROM wormdb WHERE email = (?)";




	//connection.query( dbPswrd, [logEmail]);
		

	connection.query( userQuery,[ logEmail ], function(err, rows, fields){
		if (err) throw err;

		if (rows != null){

			console.log("userQuery");
			
				if ( rows[0].pswrd == logpsw){
					io.emit("welcome");


					console.log("Onnistunut login");

					io.emit("addToList", kayttajatunnus);
				
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

	
}



http.listen(3000, function(){
	console.log('kuunnellaan http://127.0.0.1:3000');
});