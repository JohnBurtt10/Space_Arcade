// On load get the username and set the name value
function load() {
	const $name = document.getElementById('name');
	if (playername && $name) $name.value = playername;
}
//When play as guest is pressed then get the entered name
function playAsGuest() {
	const name = document.getElementById('name')
		.value; // get name
	if (!name) return alert('Please enter a name!'); //check field

	playername = name; // name placeholder  
	localStorage.clear();
	localStorage.setItem('playername', playername);
	localStorage.setItem('isLoggedIn', false);
	localStorage.setItem('personalBestSpaceRaceScore', 0);
	localStorage.setItem('personalBestHotScore', 0);
	localStorage.setItem('personalBestZappedScore', 0);
	setPersonalBestSpaceRaceScore(playername, 0);
	setPersonalBestHotScore(playername, 0);
	setPersonalBestZappedScore(playername, 0);

	location.href = '/~/projects/Space_Arcade/Game_Menu' //redirect to game menu
}

//redirect to space race game 
function playSpaceRace() {
	location.href = '/~/projects/Space_Arcade/Space_Race/Space_Race'

}

//redirect to hot game
function playHot() {
	location.href = '/~/projects/Space_Arcade/Hot/Hot'
}

//redirect to zapped game
function playZapped() {
	location.href = '/~/projects/Space_Arcade/Zapped/Zapped'
}

//redirect to the game menu
function gameMenu() {
	location.href = '/~/projects/Space_Arcade/Game_Menu'
}

//redirect to the start screen
function startScreen() {
	location.href = '/~/projects/Space_Arcade/Start_Screen'
}

//zapped set ship to red 
function buyItem(type, colour, price) {
	const isLoggedIn = localStorage.getItem('isLoggedIn');
	const balance = localStorage.getItem('balance');
	if (isLoggedIn == 'true') {

		const username = localStorage.getItem('playername');
		const purchased = localStorage.getItem(colour + type + 'SkinPurchased');
		if (purchased == 'false') {
			if (Number(balance) >= price) {
				if (confirm('Are you sure you want to purchase the ' + colour + " " + type + ' skin?')) {
					// Save it!
					localStorage.setItem(type + "Colour", colour);
					spendingSpaceDollarBalance(price);
					alert("You bought the " + colour + " " + type + " colour!")
					patchSkinsPurchased(colour + type + 'SkinPurchased');
					setTimeout(function () {
						location.href = '/~/projects/Space_Arcade/Shop'
					}, 1000)
				} else {
					console.log('okay');
				}
			} else {
				alert("You do not have enough Space Dollars to buy that!");

			}
		} else {
			localStorage.setItem(type + "Colour", colour);
			alert("Equipped " + colour + " " + type + "!");
		}
	} else {
		alert("Sign in to an account to purchase and equip cosmetics!")
	}
}
//zapped set debris to red
function redElectricity() {
	localStorage.setItem("ElectricityColour", 'red');
}

//zapped set debris to blue
function blueElectricity() {
	localStorage.setItem("ElectricityColour", 'blue');
}

//zapped set debris to yellow
function yellowElectricity() {
	localStorage.setItem("ElectricityColour", 'yellow');
}

//when create an account is pressed then get the field values and check then post them to the database
async function createAccount() {
	const username = document.getElementById('name')
		.value;
	const password = document.getElementById('password')
		.value;
	if (!username) return alert('Please enter a name!');
	if (!password) return alert('Please enter a password!');
	const path = '/~/projects/Space_Arcade/signup';
	const method = 'POST'; // post the user and the password to the database 
	const headers = { 'Content-Type': 'application/json' }
	console.log(password);
	const body = JSON.stringify({ username, password }); //
	const redirect = 'error'; //error flag 

	try {

		await fetch(path, { method, headers, body, redirect });
		playername = username;
		localStorage.clear();
		localStorage.setItem('playername', playername);
		localStorage.setItem('redShipSkinPurchased', 'false');
		localStorage.setItem('blueShipSkinPurchased', 'false');
		localStorage.setItem('yellowShipSkinPurchased', 'false');
		localStorage.setItem('redAsteroidSkinPurchased', 'false');
		localStorage.setItem('blueAsteroidSkinPurchased', 'false');
		localStorage.setItem('yellowAsteroidSkinPurchased', 'false');
		localStorage.setItem('isLoggedIn', 'true');
		localStorage.setItem('personalBestSpaceRaceScore', 0);
		localStorage.setItem('personalBestHotScore', 0);
		localStorage.setItem('personalBestZappedScore', 0);
		const balance = 0;
		setPersonalBestSpaceRaceScore(username, 0);
		setPersonalBestZappedScore(username, 0);
		setPersonalBestHotScore(username, 0);
		createSpaceDollarBalance(username, balance);
		createSkinsPurchased(username);
		location.href = '/~/projects/Space_Arcade/Game_Menu'
	} catch (ex) {
		alert('Name already taken, please choose another one.')
	}
}

async function login() {
	const username = document.getElementById('name')
		.value;
	const password = document.getElementById('password')
		.value;
	if (!username) return alert('Please enter a name!');
	if (!password) return alert('Please enter a password!');

	const path = '/~/projects/Space_Arcade/login';
	const method = 'POST';
	const headers = { 'Content-Type': 'application/json' }
	const body = JSON.stringify({ username, password });
	const redirect = 'error';
	try {
		const resp = await fetch(path, { method, headers, body, redirect });
		const ans = await resp.json();
		if (ans.error)
			return alert(ans.error)
		playername = username;
		localStorage.setItem('playername', playername);
		localStorage.setItem('isLoggedIn', true);
		const balance = await getSpaceDollarsBalance(username); //Something from line 166 - 185 is breaking logging in 
		// probably bc these things dont exist for everyone? 
		localStorage.setItem('balance', balance);
		const personalBestSpaceRaceScore = await getPersonalBestSpaceRaceScore(username);
		localStorage.setItem('personalBestSpaceRaceScore', personalBestSpaceRaceScore);
		const personalBestHotScore = await getPersonalBestHotScore(username);
		localStorage.setItem('personalBestHotScore', personalBestHotScore);
		const personalBestZappedScore = await getPersonalBestZappedScore(username);
		localStorage.setItem('personalBestZappedScore', personalBestZappedScore);
		//console.log("test"); 
		
		
		const redShipSkinPurchased = await getRedShipSkinPurchased(username);
		console.log(redShipSkinPurchased); 
		localStorage.setItem('redShipSkinPurchased', redShipSkinPurchased); 
		const blueShipSkinPurchased = await getBlueShipSkinPurchased(username);
		localStorage.setItem('blueShipSkinPurchased', blueShipSkinPurchased); 
		const yellowShipSkinPurchased = await getYellowShipSkinPurchased(username);
		localStorage.setItem('yellowShipSkinPurchased', yellowShipSkinPurchased);
		const redAsteroidSkinPurchased = await getRedAsteroidSkinPurchased(username);
		localStorage.setItem('redAsteroidSkinPurchased', redAsteroidSkinPurchased);
		const blueAsteroidSkinPurchased = await getBlueAsteroidSkinPurchased(username);
		localStorage.setItem('blueAsteroidSkinPurchased', blueAsteroidSkinPurchased);
		const yellowAsteroidSkinPurchased = await getYellowAsteroidSkinPurchased(username);
		localStorage.setItem('yellowAsteroidSkinPurchased', yellowAsteroidSkinPurchased); 
		location.href = '/~/projects/Space_Arcade/Game_Menu' 
		
	} catch (ex) {
		alert('Cannot log in, check your name and password')
	}
}

async function logout() {

	const path = '/~/projects/Space_Arcade/logout';
	const method = 'POST';
	localStorage.clear();
	await fetch(path, { method })
	location.reload();

}
async function sendSpaceRaceScore(score) {
	if (!isLoggedIn) return;
	const path = '/~/Space_Arcade/open/spaceRaceLeaders';
	const method = 'POST';
	const headers = { 'Content-Type': 'application/json' }
	const name = playername;
	const body = JSON.stringify({ name, score });

	await fetch(path, { method, headers, body });
}
async function getSpaceRaceLeaders() {

	const path = '/~/Space_Arcade/open/spaceRaceLeaders?all=true';
	const method = 'GET'
	const resp = await fetch(path, { method });
	const leaders = await resp.json();

	const $leaders = document.getElementById('leaders');
	if (!leaders.length) {
		$leaders.innerHTML = 'No Leaders';
		return;
	}

	$leaders.innerHTML = leaders
		.filter(leader => parseInt(leader.data.score) >= 0)
		.sort((a, b) => parseInt(b.data.score) > parseInt(a.data.score) ? 1 : -1)
		.filter((leader, i) => i < 10)
		.map((leader, i) => `
			<div>${i + 1}. ${leader.data.name} ${leader.data.score}</div>
		`)
		.join('\n')

}
async function sendHotScore(time) {
	if (!isLoggedIn) return;
	const path = '/~/Space_Arcade/open/hotLeaders';
	const method = 'POST';
	const headers = { 'Content-Type': 'application/json' }
	const name = playername;
	const body = JSON.stringify({ name, time });

	await fetch(path, { method, headers, body });
}
async function getHotLeaders() {

	const path = '/~/Space_Arcade/open/hotLeaders?all=true';
	const method = 'GET'
	const resp = await fetch(path, { method });
	const leaders = await resp.json();

	const $leaders = document.getElementById('leaders');
	if (!leaders.length) {
		$leaders.innerHTML = 'No Leaders';
		return;
	}

	$leaders.innerHTML = leaders
		.filter(leader => parseInt(leader.data.time) >= 0)
		.sort((a, b) => parseInt(b.data.time) > parseInt(a.data.time) ? 1 : -1)
		.filter((leader, i) => i < 10)
		.map((leader, i) => `
			<div>${i + 1}. ${leader.data.name} ${leader.data.time}</div>
		`)
		.join('\n')

}
async function sendZappedScore(time) {
	if (!isLoggedIn) return;
	const path = '/~/Space_Arcade/open/zappedLeaders';
	const method = 'POST';
	const headers = { 'Content-Type': 'application/json' }
	const name = playername;
	const body = JSON.stringify({ name, time });

	await fetch(path, { method, headers, body });
}
async function getZappedLeaders() {

	const path = '/~/Space_Arcade/open/zappedLeaders?all=true';
	const method = 'GET'
	const resp = await fetch(path, { method });
	const leaders = await resp.json();

	const $leaders = document.getElementById('leaders');
	if (!leaders.length) {
		$leaders.innerHTML = 'No Leaders';
		return;
	}

	$leaders.innerHTML = leaders
		.filter(leader => parseInt(leader.data.time) >= 0)
		.sort((a, b) => parseInt(b.data.time) > parseInt(a.data.time) ? 1 : -1)
		.filter((leader, i) => i < 10)
		.map((leader, i) => `
			<div>${i + 1}. ${leader.data.name} ${leader.data.time}</div>
		`)
		.join('\n')

}

async function createSpaceDollarBalance(username, balance) {
	const resp = await fetch('/~/projects/Space_Arcade/open/SpaceDollars', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username, balance })
	})
	const ans = await resp.json();

}
async function getId(username) {
	try {
		const resp = await fetch('/~/projects/Space_Arcade/open/SpaceDollars?all=true', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		})
		const ans = await resp.json();
		return ans.find(item => item.data.username === username)
			._id

	} catch (ex) {
		alert("error");
	}
}
async function getSpaceDollarsBalance(username) {
	try {
		const resp = await fetch('/~/projects/Space_Arcade/open/SpaceDollars?all=true', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		})
		const ans = await resp.json();
		return ans.find(item => item.data.username === username)
			.data.balance
	} catch (ex) {
		alert("error");
	}
}
async function increaseSpaceDollarBalance(newBalance) {
	const username = localStorage.getItem('playername');
	const id = await getId(username);
	const currentBalance = await getSpaceDollarsBalance(username);
	const balance = currentBalance + newBalance;
	localStorage.setItem('balance', balance);
	console.log(localStorage.getItem('balance'));
	const resp = await fetch('/~/projects/Space_Arcade/open/SpaceDollars', {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ balance, id })
	})
}
async function spendingSpaceDollarBalance(price) {
	const username = localStorage.getItem('playername');
	const id = await getId(username);
	const currentBalance = await getSpaceDollarsBalance(username);
	const balance = currentBalance - price;
	localStorage.setItem('balance', balance);
	const resp = await fetch('/~/projects/Space_Arcade/open/SpaceDollars', {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ balance, id })
	})
}
async function setPersonalBestSpaceRaceScore(username, score) {
	const resp = await fetch('/~/projects/Space_Arcade/open/personalBestSpaceRaceScores', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username, score })
	})
	const ans = await resp.json();

}
async function getPersonalBestSpaceRaceScoreId(username) {
	try {
		const resp = await fetch('/~/projects/Space_Arcade/open/personalBestSpaceRaceScores?all=true', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		})
		const ans = await resp.json();
		return ans.find(item => item.data.username === username)
			._id

	} catch (ex) {
		alert("error");
	}
}
async function getPersonalBestSpaceRaceScore() {
	const username = localStorage.getItem('playername');
	try {
		const resp = await fetch('/~/projects/Space_Arcade/open/personalBestSpaceRaceScores?all=true', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		})
		const ans = await resp.json();
		return ans.find(item => item.data.username === username)
			.data.score
	} catch (ex) {
		alert("error");
	}
}
async function patchPersonalBestSpaceRaceScore(newScore) {
	const username = localStorage.getItem('playername');
	const currentBest = await getPersonalBestSpaceRaceScore();
	const id = await getPersonalBestSpaceRaceScoreId(username);
	const score = newScore > currentBest ? newScore : currentBest;
	localStorage.setItem('personalBestSpaceRaceScore', score);
	console.log(currentBest);
	const resp = await fetch('/~/projects/Space_Arcade/open/personalBestSpaceRaceScores', {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ score, id })
	})
}
async function setPersonalBestHotScore(username, time) {
	const resp = await fetch('/~/projects/Space_Arcade/open/personalBestHotScores', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username, time })
	})
	const ans = await resp.json();

}
async function getPersonalBestHotScoreId(username) {
	try {
		const resp = await fetch('/~/projects/Space_Arcade/open/personalBestHotScores?all=true', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		})
		const ans = await resp.json();
		return ans.find(item => item.data.username === username)
			._id

	} catch (ex) {
		alert("error");
	}
}
async function getPersonalBestHotScore() {
	const username = localStorage.getItem('playername');
	try {
		const resp = await fetch('/~/projects/Space_Arcade/open/personalBestHotScores?all=true', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		})
		const ans = await resp.json();
		return ans.find(item => item.data.username === username)
			.data.time
	} catch (ex) {
		alert("error");
	}
}
async function patchPersonalBestHotScore(newTime) {
	const username = localStorage.getItem('playername');
	const currentBestTime = await getPersonalBestHotScore();
	const id = await getPersonalBestHotScoreId(username);
	const time = newTime > currentBestTime ? newTime : currentBestTime;
	localStorage.setItem('personalBestHotScore', time);
	const resp = await fetch('/~/projects/Space_Arcade/open/personalBestHotScores', {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ time, id })
	})
}
async function setPersonalBestZappedScore(username, time) {
	const resp = await fetch('/~/projects/Space_Arcade/open/personalBestZappedScores', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username, time })
	})
	const ans = await resp.json();

}
async function getPersonalBestZappedScoreId(username) {
	try {
		const resp = await fetch('/~/projects/Space_Arcade/open/personalBestZappedScores?all=true', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		})
		const ans = await resp.json();
		return ans.find(item => item.data.username === username)
			._id

	} catch (ex) {
		alert("error");
	}
}
async function getPersonalBestZappedScore() {
	const username = localStorage.getItem('playername');
	try {
		const resp = await fetch('/~/projects/Space_Arcade/open/personalBestZappedScores?all=true', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		})
		const ans = await resp.json();
		return ans.find(item => item.data.username === username)
			.data.time
	} catch (ex) {
		alert("error");
	}
}
async function patchPersonalBestZappedScore(newTime) {
	const username = localStorage.getItem('playername');
	const currentBest = await getPersonalBestZappedScore();
	const id = await getPersonalBestZappedScoreId(username);
	const time = newScore > currentBest ? newScore : currentBest;
	localStorage.setItem('personalBestZappedScore', time);
	const resp = await fetch('/~/projects/Space_Arcade/open/personalBestZappedScores', {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ time, id })
	})
}
async function createSkinsPurchased(username) {
	const redShipSkinPurchased = 'false';
	const blueShipSkinPurchased = 'false';
	const yellowShipSkinPurchased = 'false';
	const redAsteroidSkinPurchased = 'false';
	const blueAsteroidSkinPurchased = 'false';
	const yellowAsteroidSkinPurchased = 'false';
	const resp = await fetch('/~/projects/Space_Arcade/open/skinsPurchased', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username, redShipSkinPurchased, blueShipSkinPurchased, yellowShipSkinPurchased, redAsteroidSkinPurchased, blueAsteroidSkinPurchased, yellowAsteroidSkinPurchased })
	})
	const ans = await resp.json();

}
async function getRedShipSkinPurchased(username) {
	try {
		const resp = await fetch('/~/projects/Space_Arcade/open/skinsPurchased?all=true', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		})
		const ans = await resp.json();
			return ans.find(item => item.data.username === username).data.redShipSkinPurchased
	} catch (ex) {
		alert("error");
	}
}
async function getBlueShipSkinPurchased(username) {
	try {
		const resp = await fetch('/~/projects/Space_Arcade/open/skinsPurchased?all=true', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		})
		const ans = await resp.json();
			return ans.find(item => item.data.username === username).data.blueShipSkinPurchased
	} catch (ex) {
		alert("error");
	}
}
async function getYellowShipSkinPurchased(username) {
	try {
		const resp = await fetch('/~/projects/Space_Arcade/open/skinsPurchased?all=true', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		})
		const ans = await resp.json();
			return ans.find(item => item.data.username === username).data.yellowShipSkinPurchased
	} catch (ex) {
		alert("error");
	}
}
async function getRedAsteroidSkinPurchased(username) {
	try {
		const resp = await fetch('/~/projects/Space_Arcade/open/skinsPurchased?all=true', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		})
		const ans = await resp.json();
			return ans.find(item => item.data.username === username).data.redAsteroidSkinPurchased
	} catch (ex) {
		alert("error");
	}
}
async function getBlueAsteroidSkinPurchased(username) {
	try {
		const resp = await fetch('/~/projects/Space_Arcade/open/skinsPurchased?all=true', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		})
		const ans = await resp.json();
			return ans.find(item => item.data.username === username).data.blueAsteroidSkinPurchased
	} catch (ex) {
		alert("error");
	}
}
async function getYellowAsteroidSkinPurchased(username) {
	try {
		const resp = await fetch('/~/projects/Space_Arcade/open/skinsPurchased?all=true', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		})
		const ans = await resp.json();
			return ans.find(item => item.data.username === username).data.yellowAsteroidSkinPurchased
	} catch (ex) {
		alert("error");
	}
}

async function getSkinsPurchasedId(username) {
	try {
		const resp = await fetch('/~/projects/Space_Arcade/open/skinsPurchased?all=true', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		})
		const ans = await resp.json();
		return ans.find(item => item.data.username === username)
			._id

	} catch (ex) {
		alert("error");
	}
}
async function patchSkinsPurchased(item) {
	const username = localStorage.getItem('playername');
	const id = await getSkinsPurchasedId(username);
	localStorage.setItem(item, 'true');
	if (item == 'redShipSkinPurchased') {
		const redShipSkinPurchased = 'true'
		const resp = await fetch('/~/projects/Space_Arcade/open/skinsPurchased', {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ redShipSkinPurchased, id })
		})
	} else if (item == 'blueShipSkinPurchased') {
		const blueShipSkinPurchased = 'true'
		const resp = await fetch('/~/projects/Space_Arcade/open/skinsPurchased', {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ blueShipSkinPurchased, id })
		})
	} else if (item == 'yellowShipSkinPurchased') {
		const yellowShipSkinPurchased = 'true'
		const resp = await fetch('/~/projects/Space_Arcade/open/skinsPurchased', {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ yellowShipSkinPurchased, id })
		})
	} else if (item == 'redAsteroidSkinPurchased') {
		const redAsteroidSkinPurchased = 'true'
		const resp = await fetch('/~/projects/Space_Arcade/open/skinsPurchased', {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ redAsteroidSkinPurchased, id })
		})
	} else if (item == 'blueAsteroidSkinPurchased') {
		const blueAsteroidSkinPurchased = 'true'
		const resp = await fetch('/~/projects/Space_Arcade/open/skinsPurchased', {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ blueAsteroidSkinPurchased, id })
		})
	} else if (item == 'yellowAsteroidSkinPurchased') {
		const yellowAsteroidSkinPurchased = 'true'
		const resp = await fetch('/~/projects/Space_Arcade/open/skinsPurchased', {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ yellowAsteroidSkinPurchased, id })
		})
	}

}