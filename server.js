var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});




// SQL-yhteys, yhteysparametrit default-asennossa
var mysql = require('mysql');
var connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : '1234',
	database : 'matodatabase'
});







http.listen(3000, function(){
	console.log('kuunnellaan http://127.0.0.1:3000');
});