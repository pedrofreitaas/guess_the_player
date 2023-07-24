const allPositions = ["CF", "RWB", "MD", "CAM", "CB", "LB", "RB", "SW", 
				   "LWB", "RWB", "CM", "AM", "DM", "LM", "RM", "CF",
				   "S", "SS"];

function getRandomIntegerFromTo(a=0, b=0) {
	return Math.floor( Math.random() * b + a );
}				   

// card atributtes:
function getPossiblePositions(realPos) {
	let possiblePositions = [allPositions[getRandomIntegerFromTo(0,allPositions.length)],
							allPositions[getRandomIntegerFromTo(0,allPositions.length)],
							allPositions[getRandomIntegerFromTo(0,allPositions.length)]];
	possiblePositions[getRandomIntegerFromTo(0, 2)] = realPos;

	return possiblePositions.join(" or ");
}

async function retrieveRandomPlayerIDWithMinRating(minimum_rating) {	
	while (true) {
		const response = await fetch(`https://futdb.app/api/players?page=${Math.floor( Math.random() * 944+1 )}`,
									{ 
									method: "GET",
									headers: {
										"Accept": "*/*",
										"X-Auth-Token": "29db2ef2-4419-4447-8253-99755c0f6a55",
									},
									});
			
		let responseJson = await response.json();

		let playersWithSufficientOver = responseJson.items.filter(player => player.rating >= minimum_rating);

		if(playersWithSufficientOver.length > 0) return playersWithSufficientOver[0].id;
	}
};

async function getPlayerImgURLByID( id ) {
	const playerImgResp = await fetch(`https://futdb.app/api/players/${id}/image`, { 
		method: "GET",
		headers: {
	  		"Accept": "image/png",
	  		"X-Auth-Token": "29db2ef2-4419-4447-8253-99755c0f6a55",
		},
	});

	return URL.createObjectURL(await playerImgResp.blob());
}

async function getPlayerClubImgURLByID( id ) {
	let clubImgResp = await fetch(`https://futdb.app/api/clubs/${id}/image`, { 
		method: "GET",
		headers: {
			"Accept": "*",
			"X-Auth-Token": "29db2ef2-4419-4447-8253-99755c0f6a55",
		},
	});

	return URL.createObjectURL(await clubImgResp.blob());
}

async function getPlayerLeagueImgURLBy( id ){
	let leagueImgResp = await fetch(`https://futdb.app/api/leagues/${id}/image`, { 
		method: "GET",
		headers: {
			"Accept": "*",
			"X-Auth-Token": "29db2ef2-4419-4447-8253-99755c0f6a55",
		},
	});

  	return URL.createObjectURL(await leagueImgResp.blob());
}

async function getPlayerJSONByID( id ) {
	let response = await fetch(`https://futdb.app/api/players/${id}`, { 
		method: "GET",
		headers: {
			"Accept": "*/*",
			"X-Auth-Token": "29db2ef2-4419-4447-8253-99755c0f6a55",
		},
	});

	let responseJson = await response.json();
	responseJson = responseJson.player;

	const playerJSON = {
		id: responseJson.id,
		clubID: responseJson.club,
		leagueID: responseJson.league,
		obtainIcon: async (id) => getPlayerImgURLByID(id),
		obtainLeagueIcon: async (leagueID) => getPlayerLeagueImgURLBy(leagueID),
		obtainClubIcon: async (clubID) => getPlayerClubImgURLByID(clubID),
		
		name: ["?", responseJson.commonName, 0],		
		birthDate: [responseJson.birthDate.slice(0,4)+"-??-??", responseJson.birthDate, 0],
		rating: [String(responseJson.rating).charAt(0)+" ?", String(responseJson.rating), 0],
		position: [getPossiblePositions(responseJson.position), responseJson.position, 0],
		pace: [String(responseJson.pace).charAt(0)+" ?", String(responseJson.pace), 0],
		dribbling: [String(responseJson.dribbling).charAt(0)+" ?", String(responseJson.dribbling), 0],
		finishing: [String(responseJson.finishing).charAt(0)+" ?", String(responseJson.finishing), 0],
		defending: [String(responseJson.defending).charAt(0)+" ?", String(responseJson.defending), 0],
		physicality: [String(responseJson.physicality).charAt(0)+" ?", String(responseJson.physicality), 0],
		shooting: [String(responseJson.shooting).charAt(0)+" ?", String(responseJson.shooting), 0],
		passing: [String(responseJson.passing).charAt(0)+" ?", String(responseJson.passing), 0],
	};

	return playerJSON;
}

async function fitPlayerJSONIntoHTML() {
	return `
	<h1 class="player_name"> ${playerJSON.name[playerJSON.name[2]]} </h1>
	<img width="120px" height="120px" class="player_pic" src="${await playerJSON.obtainIcon(playerJSON.id)}">
	<h3 class="player_rating"> ${playerJSON.rating[playerJSON.rating[2]]} </h3>
	
	<p class="player_info">
		<i class="fa-solid fa-baby" style="color: #0c2145;"></i> Date of Birth: ${playerJSON.birthDate[playerJSON.birthDate[2]]} <br/>
		<i class="fa-solid fa-trophy" style="color: #07155a;"></i> League and Club: <img class="icon" width="30px" height="30px" src="${await playerJSON.obtainLeagueIcon(playerJSON.leagueID)}"> <img class="icon" width="30px" height="30px" src="${await playerJSON.obtainClubIcon(playerJSON.clubID)}"> <br/>
		<i class="fa-solid fa-futbol" style="color: #112a55;"></i> Position: ${playerJSON.position[playerJSON.position[2]]} <br/>
	</p>

	<div class="player_atrib_line_l"> <i class="fa-solid fa-person-running" style="color: #1e3c71;"></i> Pace: ${playerJSON.pace[playerJSON.pace[2]]} </div>
	<div class="player_atrib_line_r"> <i class="fa-solid fa-meteor" style="color: #102446;"></i> Shooting: ${playerJSON.shooting[playerJSON.shooting[2]]} </div>
	<div class="player_atrib_line_l"> <i class="fa-solid fa-people-arrows" style="color: #355997;"></i> Passing: ${playerJSON.passing[playerJSON.passing[2]]} </div>
	<div class="player_atrib_line_r"> <i class="fa-solid fa-user-ninja" style="color: #142d57;"></i> Dribbling: ${playerJSON.dribbling[playerJSON.dribbling[2]]} </div>
	<div class="player_atrib_line_l"> <i class="fa-solid fa-shield-halved" style="color: #172f59;"></i> Defending: ${playerJSON.defending[playerJSON.defending[2]]} </div>
	<div class="player_atrib_line_r"> <i class="fa-solid fa-dumbbell" style="color: #20437e;"></i> Physicality: ${playerJSON.physicality[playerJSON.physicality[2]]} </div>
	`
}

async function choosePlayer() {
	playerJSON = JSON.parse( localStorage.getItem("playerJSON") );

	const playerContainer = document.createElement("div");
	playerContainer.classList.add("player_container");
	document.body.appendChild(playerContainer);

	const loadIcon = document.createElement("div");
	loadIcon.classList.add("player_container_load");
	playerContainer.appendChild(loadIcon);

	if( playerJSON != null ) {
		playerJSON.obtainIcon = async (id) => getPlayerImgURLByID(id);
		playerJSON.obtainClubIcon = async (clubID) => getPlayerClubImgURLByID(clubID);
		playerJSON.obtainLeagueIcon = async (leagueID) => getPlayerLeagueImgURLBy(leagueID);
		
		playerContainer.innerHTML = await fitPlayerJSONIntoHTML();
	}
	
	else {
		playerJSON = await getPlayerJSONByID( await retrieveRandomPlayerIDWithMinRating(80) );
		playerContainer.innerHTML = await fitPlayerJSONIntoHTML();
		
		localStorage.setItem( "playerJSON", JSON.stringify(playerJSON) );
	}
}

async function updatePlayer() {
	let playerContainer = document.getElementsByClassName("player_container")[0];
		
	playerContainer.innerHTML = await fitPlayerJSONIntoHTML();
		
	localStorage.setItem( "playerJSON", JSON.stringify(playerJSON) );
}

export function resetPlayer() {
	localStorage.clear();
	location.reload();
}

var ableToTip = true;
const tipTime = 3; //seconds
export async function tryToTip() {
	if ( !ableToTip )
		return

	await giveTip();

	const tipButton = document.getElementsByClassName("player_tip_button")[0];
	tipButton.style.textDecoration = "line-through";

	// recover tip.
	setTimeout( () => {
		ableToTip=true;
	
		const tipButton = document.getElementsByClassName("player_tip_button")[0];
		tipButton.style.textDecoration = "none";
	}, tipTime*1000);
}

var current_tip = 0;
async function giveTip() {
	switch (current_tip) {
		case 0:
			playerJSON.rating[2] = 1;
			break;
		
		case 1:
			playerJSON.birthDate[2] = 1;
			break;

		case 2:
			playerJSON.position[2] = 1;
			break;

		case 3:
			playerJSON.pace[2] = 1;
			break;

		case 4:
			playerJSON.shooting[2] = 1;
			break;

		case 5:
			playerJSON.defending[2] = 1;
			break;

		case 6:
			playerJSON.dribbling[2] = 1;
			break;

		case 7:
			playerJSON.physicality[2] = 1;
			break;

		case 8:
			playerJSON.passing[2] = 1;
			break;
	};

	current_tip++;
	await updatePlayer();
	ableToTip = false;
};

var playerJSON = {}
window.onload = await choosePlayer();