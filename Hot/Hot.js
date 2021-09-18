//JavaScript Document
//Everything that happens within the game is within this file

//Global Variables 
var mycanvas = document.getElementById("myCanvas"); //Getting the cnavas element from the HTML file 
var ctx = mycanvas.getContext("2d"); //Setting the canvas context to variable
var canvas = { width: 600, height: 800 }; //Canvas dimensions
var hot = 0; //Score variable
var colour = "#FFFFFF";
//Variable that keeps track of the player on the canvas 
var player = {
	x: canvas.width / 2, //starting position in the middle of the screeen
	y: canvas.height - 400, //Starting position at the bottom of the canvas
	speed: 3.5 //number of pixels moved with one press 3.5
};

var allDebris = []; // Setting the Debris as an array of multiple obsticles
var numberOfDebris = 5; //Setting the constant amount of debris on the field starting at 1

//Movement Variables defulted to false as without interaction thhe ship does not move
var LEFT = false;
var RIGHT = false;
var UP = false;
var DOWN = false;

var horizontalSpeed = 4; // defult horizontal speed of the debris
var verticalSpeed = 4; // defult horizontal speed of the debris

//Setting which way the player should go depending on which key is pressed 
function move() {
	if (LEFT) {
		player.x -= player.speed;
	}
	if (RIGHT) {
		player.x += player.speed;
	}
	if (UP) {
		player.y -= player.speed;
	}
	if (DOWN) {
		player.y += player.speed;
	}
}

//function to clear canvas
function clearCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height); //reset the ship
}

// Draw the player ship 
function ship(x, y) {
	var x = player.x; //Track the ships x postion
	var y = player.y; //Track the ships y position
	ctx.fillStyle = colour; //Ships colour
	//Drawing the triangle 
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(x + 10, y + 35);
	ctx.lineTo(x - 10, y + 35);
	ctx.fill();
}

//Function to set borders on the left, right, and bottom to stop the ship
function stopAtBorder() {
	player.x = Math.min(Math.max(10, player.x), canvas.width - 10) // X borders
	player.y = Math.min(Math.max(0, player.y), canvas.height - 35) // Y border
}

//Add score element to the canvas to display the players score
function showScore() {
	ctx.font = "30px Comic Sans MS";
	ctx.fillStyle = "white";
	ctx.textAlign = "right";
	ctx.fillText(`Hot: ${Math.round(hot)}`, 550, 50);
}

//getting the time of the programs run in milliseconds
function showTime() {
	var time = (performance.now()) / 1000;
	ctx.font = "15px Comic Sans MS";
	ctx.fillStyle = "white";
	ctx.textAlign = "right";
	ctx.fillText(`Your time is : ${Math.round(time)} seconds`, 550, 75);
}
//Creates a random number within the parameters
function rnd(min, max) {
	return Math.random() * (max - min) + min;
}

function checkForCollision() {
	const collisionDetected = allDebris.some(debris => { //returning boolean value
		const topDistanceSqrd = (player.x - debris.x) ** 2 + (player.y - debris.y + 17.5) ** 2
		return topDistanceSqrd < debris.r ** 2.5; //Number of pixels that the hitbox includes 
	})
	allDebris = allDebris.filter(debris => {
		const topDistanceSqrd = (player.x - debris.x) ** 2 + (player.y - debris.y + 17.5) ** 2
		return topDistanceSqrd > debris.r ** 2.5; //Number of pixels that the hitbox includes  
	})

	if (collisionDetected) {
		if (hot > 0) {
			hot--;
		}
		return true;
	}
	return false;
}
setInterval(function () { hot++; }, 750);

//Picks and spawns the debris on a specifc position
function spawnDebris() {
	while (allDebris.length < numberOfDebris) { //If less debris that supposed to be
		const left = rnd(-canvas.width, 0); //random number in specified range
		const right = rnd(canvas.width, 2 * canvas.width); //random number in specified range
		const xdirection = rnd(-1, 1) < 0 ? 'left' : 'right'; // Random number and if -1 then left and if 1 then right
		const up = rnd(-canvas.height, 0); //random number in specified range
		const down = rnd(canvas.height, 2 * canvas.height); //random number in specified range
		const ydirection = rnd(-1, 1) < 0 ? 'up' : 'down'; // Random number and if -1 then left and if 1 then right
		const x = xdirection === 'left' ? left : right; //Returns the proper direction of the specific debris
		const vx = xdirection === 'left' ? horizontalSpeed : -horizontalSpeed; //Speed of the debris across the screen in the correct direction
		const y = xdirection === 'up' ? up : down; //Returns the proper direction of the specific debris
		const vy = xdirection === 'up' ? verticalSpeed : -verticalSpeed; //Speed of the debris across the screen in the correct direction
		//Creating the bounds for the field where the debris can spawn on the field
		// Small safe zone at the bottom of the canvas to ensure that the player does not instantly get hit by debris on spawn or reset
		var debris = {
			x: rnd(0, canvas.width),
			y: rnd(0, canvas.height - 100),
			r: rnd(7, 15),
			vx: vx,
			vy: vy
		};
		allDebris.push(debris); // Push all debris elements
	}
}

//Check the number of debris currently on the playing 
//If debris is off the border of the screen then delete it and call function to replace it
//todo: still check the amount of debris on the screen but not if it goes off of the side of the screen
function checkDebris() {
	allDebris = allDebris.filter(debris => {
		const inWindow = (debris.vx > 0 && debris.x < 600) || (debris.vx < 0 && debris.x > 0);
		return inWindow;
	})
}

//Creates the shape of the debris
function drawDebris() {
	allDebris.forEach(function (debris) {
		// draw your debris
		ctx.beginPath();
		ctx.arc(debris.x, debris.y, debris.r, 2 * Math.PI, false); // circle
		ctx.fillStyle = 'white'; //coulor
		ctx.fill();
	})
}

//Moves the derbis across the screen horizontally at the constant speed that is the vx 
function moveDebris() {
	allDebris.forEach(function (debris) {
		// move the debris
		debris.x += debris.vx;
		if (debris.x < 0 || debris.x > 600) {
			debris.vx *= -1;
		}
		debris.y += debris.vy;
		if (debris.y < 0 || debris.y > 800) {
			debris.vy *= -1;
		}
	})
}

function gameOver() {
	if (hot == 10) {
		var time = (performance.now()) / 1000;
		const isLoggedIn = localStorage.getItem('isLoggedIn');
		const spaceDollarsEarned = Math.round(time * 2.50);
		sendHotScore(time);
		patchPersonalBestHotScore(time);
		const currentBestTime = localStorage.getItem('personalBestHotScore');
		const personalBestTime = time > currentBestTime ? time : currentBestTime;

		if (isLoggedIn == 'true') {
			increaseSpaceDollarBalance(spaceDollarsEarned);
			var balance = Number(localStorage.getItem('balance')) + Math.round(time * 2.50); 
		} else {
			var balance = 'N/A';
		}

		const $modal = document.createElement('div');
		$modal.className = 'gameover'
		if (time <= 20) {
			$modal.innerHTML = "<h1> Game Over</h1> " +
				"<scores>You clearly don't have what it takes to be an astronaut...</scores>" +
				"</br>" +
				"<h8>Time:</h8>" +
				time +
				"</br>" +
				"<h9>Personal Best Time:</h9>" +
				personalBestTime +
				"</br>" +
				"<h7>Space Dollar Balance:</h7>"+
				balance
				+
				"<h1>Press Space to continue </h1>"
		}  
		else if (20 < time <= 30) {
			$modal.innerHTML = "<h1> Game Over</h1> " +
				"<scores>If you keep improving like this Earth might stand a chance...</scores>" +
				"</br>" +
				"<h8>Time:</h8>" +
				time +
				"</br>" +
				"<h9>Personal Best Time:</h9>" +
				personalBestTime +
				"</br>" +
				"<h7>Space Dollar Balance:</h7>"+
				balance
				+
				"<h1>Press Space to continue </h1>"
		}
		else if (time > 30) {
			$modal.innerHTML = "<h1> Game Over</h1> " +
				"<scores>They were right about you, we've never had an astronaut </br> fly this well on their first mission. Earth is in good hands...</scores>" +
				"</br>" +
				"<h8>Time:</h8>" +
				time +
				"</br>" +
				"<h9>Personal Best Time:</h9>" +
				personalBestTime +
				"</br>" +
				"<h7>Space Dollar Balance:</h7>"+
				balance
				+
				"<h1>Press Space to continue </h1>"
		}
		document.body.onkeydown = function (e) {
			if (e.keyCode == 32) {
				location.href = '/~/projects/Space_Arcade/Game_Menu'
			}
		}
		document.body.innerHTML = '';
		document.body.appendChild($modal);
		return true;
	}
	return false;
}

//Maybe swicth case 
function colours() {
	if (hot == 2) {
		colour = "#F3FF33";
	} else if (hot == 3) {
		colour = "#FFEC33";
	} else if (hot == 4) {
		colour = "#FFD433";
	} else if (hot == 5) {
		colour = "#FFBB33";
	} else if (hot == 6) {
		colour = "#FF9C33";
	} else if (hot == 7) {
		colour = "#FF7733";
	} else if (hot == 8) {
		colour = "#FF5B33";
	} else if (hot == 9) {
		colour = "#FF4933";
	} else if (hot == 10) {
		colour = "#FF3333";
	}
}

//Looping the function to create a steady flow of frame updates
//Every time the canvas updates call all of the logic update functions, 
//and then all of the visual update functions
function update() {
	// CLEAR
	clearCanvas();
	// LOGIC
	move(); //Move the ship
	moveDebris(); //Move the debris
	gameOver();

	// COLLISIONS
	stopAtBorder();
	checkForCollision(); //Setting borders at the sides and bottom of the canvas
	checkDebris(); //Check how many debris entities are currently on the field
	spawnDebris(); //Spawn the debrid in random locations within parameters
	const isGameOver = gameOver(); //NOTE: 

	// DRAW
	ship(); //draw the player ship
	showScore(); //show the score element in the top right corner 
	showTime();
	colours();

	drawDebris(); //draw the debris before being spawned onto the field 

	// NEXT FRAME
	if (!isGameOver) window.requestAnimationFrame(update);
}

spawnDebris(); // After the checkDebris function has been called. If any debris have left the field then spawn more.

//Setting when the keys are pressed to move 
document.onkeydown = function (e) {
	if (e.keyCode == 65) LEFT = true;
	if (e.keyCode == 68) RIGHT = true;
	if (e.keyCode == 87) UP = true;
	if (e.keyCode == 83) DOWN = true;
}

//Setting the keys to be not pressed by defult 
document.onkeyup = function (e) {
	if (e.keyCode == 65) LEFT = false;
	if (e.keyCode == 68) RIGHT = false;
	if (e.keyCode == 87) UP = false;
	if (e.keyCode == 83) DOWN = false;
}

//updating the canvas to ensure smooth movement (look up request animation frame)
window.requestAnimationFrame(update);