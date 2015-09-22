function init() {

var snake = []
var direction = 2; //oikealle
var START_LENGTH = 8;
var fps = 60;
var appleEaten = false;
var snakeAlive = false;
var score = 0;

var gameboardWidth = 65;
var gameboardHeight = 65;

var applePosRow; 
var applePosData;

var socket = io();

socket.on('connect', function(){
		console.log("connection established");
	});


//PAINETUN NÄPPÄIMEN TARKISTUS JA DIRECTION-MUUTTUJAN MUOKKAUS//
document.onkeydown = checkKey;

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '38') {
        // up arrow
        if(direction != 3){
        direction = 1;
    	}
    }
    else if (e.keyCode == '40') {
        // down arrow
        if(direction != 1){
        direction = 3
    	}
    }
    else if (e.keyCode == '37') {
       // left arrow
        if(direction != 2){
        direction = 4
   		}
    }
    else if (e.keyCode == '39') {
        // right arrow
        if(direction != 4){
        direction = 2
    	}
    }
    if (e.keyCode == '82') {
        if(!snakeAlive){
        	snakeAlive = true;
        	initSnake();
        	drawApple();
        }
        
    }
}
//FUNKTIO OMENAN SIJOITTAMISEEN KENTÄLLE//
function drawApple(){
	var rowNotOk = true;
	while(rowNotOk){
		applePosRow = Math.floor((Math.random() * gameboardHeight));
		applePosData = Math.floor((Math.random() * gameboardHeight));
		var length = snake.length;
		for(i=0; i < length;i++){
			var row = snake[i][0];
			var data = snake[i][1];
			if(applePosRow == row && applePosData == data){
				console.log("Apple inside snake");
				rowNotOk = true;
				break;
			}
			if(applePosRow == 0 || applePosRow == gameboardHeight -1 || applePosData == 0 || applePosData == gameboardWidth -1){
				console.log("Apple inside border");
				rowNotOk = true;
				break;
			} else{
				rowNotOk = false;
			}
		}
	}


	$("#r"+applePosRow+"d"+applePosData).css("background", "red");


}

function initSnake(){
	score = 0;
	for ( i = 0; i < START_LENGTH; i++){
   		var row = Math.floor((gameboardWidth/2)); //Asetetaan riviksi keskimmäinen rivi
    	var data = Math.floor((gameboardHeight/2) - i); //asetetaan dataksi keskimmäinen td - kierroksen numero
   	    var locCoord = [row,data] //Tehdään taulukko joka sisältää kaksi arvoa, rivin ja sarakkeen
        snake.push(locCoord); //lisätään äsken luotu taulu käärmeen kohdaksi
    }    
    drawSnake();
    console.log("mato piirretty")
}
//FUNKTIO PELILAUDAN ALUSTUSTA VARTEN//
function initGameBoard(height,width){
	console.log("test")
	var gameboard = '<p id = score style="text-align:center">Score: </p>'
    gameboard += '<table id="gameboard">'

	for(i = 0; i<height; i++){
		gameboard += '<tr>';
		for (j = 0; j < width; j++){
			var id = "r"+i+"d"+j;
			var grid = '<td id="'+id+'"></td>';
			gameboard += grid;
		}
		gameboard += '</tr>';
	}
	gameboard += '</table>';
	gameboard += '<p style="text-align: center"> Ohjaa matoa nuolinäppäimillä. Kuoleman jälkeen paina R syntyäksesi uudelleen </P>'
	$("#gameboard_div").html(gameboard);
	initSnake();
	drawApple();
}

initGameBoard(gameboardHeight,gameboardWidth);


//FUNKTIO MADON PIIRTÄMISTÄ VARTEN//
function drawSnake(){
	if(snakeAlive){
	setTimeout(function(){
		requestAnimationFrame(drawSnake);
		$("#score").html("Score: " + score);
		//tehdään loop joka puhdistaa pöydän aina piirtämisen välissä, paitsi omenan kohdalta. Piirtää myös mustat reunat
		for(i = 0; i< gameboardHeight;i++){
			for(j=0;j<gameboardWidth;j++){
				var rowToClear = i;
				var dataToClear = j;
				if(rowToClear == applePosRow && dataToClear == applePosData){
					$("#r"+rowToClear+"d"+dataToClear).css("background", "red");
				} else if(rowToClear == 0 || rowToClear == gameboardHeight -1 || dataToClear == 0 || dataToClear == gameboardWidth -1){
					$("#r"+rowToClear+"d"+dataToClear).css("background", "black");
				}
				else{
				$("#r"+rowToClear+"d"+dataToClear).css("background", "lightblue");
				}
			}
		}

		var length = snake.length;
		for(i=0; i < length;i++){
			var row = snake[i][0];
			var data = snake[i][1];
			$("#r"+row+"d"+data).css("background", "green");	
		}

		if(direction == 1){//Mennään ylös eli vähennetään rowin	
			 	var headrow = snake[0][0] - 1;
			 	var headdata = snake[0][1];
			 	var newHead = [headrow,headdata];
			 	snake.splice(0,0,newHead);
			 	if(!appleEaten){
			 	snake.pop();
			 	}
			 	appleEaten = false;
		}
		else if(direction == 2){//Mennään oikealle eli lisätään datan arvoa	
			 	var headrow = snake[0][0];
			 	var headdata = snake[0][1] + 1;
			 	var newHead = [headrow,headdata];
			 	snake.splice(0,0,newHead);
			 	if(!appleEaten){
			 	snake.pop();
			 	}
			 	appleEaten = false;
		}
		else if(direction == 3){//Mennään alas eli lisätään rowin arvoa	
			 	var headrow = snake[0][0] + 1;
			 	var headdata = snake[0][1];
			 	var newHead = [headrow,headdata];
			 	snake.splice(0,0,newHead);
			 	if(!appleEaten){
			 	snake.pop();
			 	}
			 	appleEaten = false;
		}
		else if(direction == 4){//Mennään vasemmalle eli vähennetään datan arvoa	
			 	var headrow = snake[0][0];
			 	var headdata = snake[0][1] - 1;
			 	var newHead = [headrow,headdata];
			 	snake.splice(0,0,newHead);
			 	if(!appleEaten){
			 	snake.pop();
			 	}
			 	appleEaten = false;
		}

		//törmäyksen tarkistaminen omaan häntään
		for(i=1; i < length;i++){
			var headrow = snake[0][0];
			var headdata = snake[0][1];
			var row = snake[i][0];
			var data = snake[i][1];
			if(row == headrow && data == headdata){
				snakeAlive = false;
				gameOverScreen();
			}
		}
		//Törmäyksen tarkistaminen reunaan
		if(snakeAlive){
			if(snake[0][0] == 0 || snake[0][0] == gameboardHeight - 1|| snake[0][1] == 0 || snake[0][1] == gameboardWidth - 1){
				snakeAlive = false;
				gameOverScreen();
			}
		}
		//Omenan syönnin tarkistus
		if(snakeAlive){
			if(snake[0][0] == applePosRow && snake[0][1] == applePosData){
				appleEaten = true;
				score += 1;
				drawApple();
			}
		}


	},1000/fps);	
	}
} 

function respawn(){

}

function gameOverScreen(){
	console.log(score);
	socket.emit('registerScore', {playerScore: score});
	snake = [];
	for(i = 0; i< gameboardHeight;i++){
		for(j=0;j<gameboardWidth;j++){
			var row = i;
			var data = j;
			
			$("#r"+row+"d"+data).css("background", "black");
				
		}
	}
}

}