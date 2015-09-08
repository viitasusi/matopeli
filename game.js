function startGame() {
	console.log("startGame")

	initGameboard(20, 20);
}

function initGameboard(height, width) {
	console.log("initGameboard");

	var gameboard = '<table id="gameboard">';

	for (var i=0; i<height; i++) {
		gameboard+= '<tr>';
		for (var j=0; j<width; j++) {
			var id = (j+(i*height));
			var grid = '<td id="' + id + '" title="'+ +id + '"></td>';
			gameboard += grid;
		}
		gameboard += '</tr>';
	}
	gameboard += '</table>';

	document.getElementById('gameboard').innerHTML = gameboard;
}