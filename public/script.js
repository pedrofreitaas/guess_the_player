const positions = ["CF", "RWB", "MD", "CAM", "CB", "LB", "RB", "SW", 
				   "LWB", "RWB", "CM", "AM", "DM", "LM", "RM", "CF",
				   "S", "SS"];

function getRandomIntegerFromTo(a=0, b=0) {
	return Math.floor( Math.random() * b + a );
}				   

// card atributtes:
function hideAtributte( atributteValue, type=null ) {
	switch( type ) {
		case "birthDate":
			return atributteValue.slice(0, 4) + "-??-??";

		case "rating":
			return String(atributteValue).charAt(0) + " ?";

		case "position":
			let possiblePositions = [positions[getRandomIntegerFromTo(0, positions.length)],
									 positions[getRandomIntegerFromTo(0, positions.length)],
									 positions[getRandomIntegerFromTo(0, positions.length)]];
			
			possiblePositions[getRandomIntegerFromTo(0, 2)] = atributteValue;

			return possiblePositions.join(" or ");

		case "club":
		case "league":
		case "name":
			return "?";

		case null:
		default:
			return atributteValue;
	}
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
		
		name: responseJson.commonName,		
		birthDate: responseJson.birthDate,
		rating: responseJson.rating,
		position: responseJson.position,
		pace: responseJson.pace,
		dribbling: responseJson.dribbling,
		finishing: responseJson.finishing,
		defending: responseJson.defending,
		physicality: responseJson.physicality,
		shooting: responseJson.shooting,
		passing: responseJson.passing,
	};

	return playerJSON;
}

async function fitPlayerJSONIntoHTML( playerJSON ) {
	return `
	<h1 class="player_name"> ${hideAtributte( playerJSON.name, "name" )} </h1>
	<img width="120px" height="120px" class="player_pic" src="${await playerJSON.obtainIcon(playerJSON.id)}">
	<h3 class="player_rating"> ${hideAtributte( playerJSON.rating, "rating" )} </h3>
	
	<p class="player_info">
		<i class="fa-solid fa-baby" style="color: #0c2145;"></i> Date of Birth: ${hideAtributte(playerJSON.birthDate, "birthDate")} <br/>
		<i class="fa-solid fa-trophy" style="color: #07155a;"></i> League and Club: <img class="icon" width="30px" height="30px" src="${await playerJSON.obtainLeagueIcon(playerJSON.leagueID)}"> <img class="icon" width="30px" height="30px" src="${await playerJSON.obtainClubIcon(playerJSON.clubID)}"> <br/>
		<i class="fa-solid fa-futbol" style="color: #112a55;"></i> Position: ${hideAtributte(playerJSON.position, "position")} <br/>
	</p>

	<div class="player_atrib_line_l"> <i class="fa-solid fa-person-running" style="color: #1e3c71;"></i> Pace: <i id="pace"> ${hideAtributte(playerJSON.pace, "rating")} </i> </div>
	<div class="player_atrib_line_r"> <i class="fa-solid fa-meteor" style="color: #102446;"></i> Shooting: ${hideAtributte(playerJSON.shooting, "rating")} </div>
	<div class="player_atrib_line_l"> <i class="fa-solid fa-people-arrows" style="color: #355997;"></i> Passing: ${hideAtributte(playerJSON.passing, "rating")} </div>
	<div class="player_atrib_line_r"> <i class="fa-solid fa-user-ninja" style="color: #142d57;"></i> Dribbling: ${hideAtributte(playerJSON.dribbling, "rating")} </div>
	<div class="player_atrib_line_l"> <i class="fa-solid fa-shield-halved" style="color: #172f59;"></i> Defending: ${hideAtributte(playerJSON.defending, "rating")} </div>
	<div class="player_atrib_line_r"> <i class="fa-solid fa-dumbbell" style="color: #20437e;"></i> Physicality: ${hideAtributte(playerJSON.physicality, "rating")} </div>
	`
}

window.onload = async function choosePlayer() {
	let playerJSON = JSON.parse( localStorage.getItem("playerJSON") );

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
		
		playerContainer.innerHTML = await fitPlayerJSONIntoHTML( playerJSON );
	}
	
	else {
		playerJSON = await getPlayerJSONByID( await retrieveRandomPlayerIDWithMinRating(80) );
		playerContainer.innerHTML = await fitPlayerJSONIntoHTML(playerJSON);
		
		localStorage.setItem( "playerJSON", JSON.stringify(playerJSON) );
	}
}

export function resetPlayer() {
	localStorage.clear();
	location.reload();
}

var ableToTip = true;
export function tryToTip() {

	if ( !ableToTip )
		return

	giveTip();

	const tipButton = document.getElementsByClassName("player_tip_button")[0];
	tipButton.style.textDecoration = "line-through";

	// recover tip.
	setTimeout( () => {
		ableToTip=true;
	
		const tipButton = document.getElementsByClassName("player_tip_button")[0];
		tipButton.style.textDecoration = "none";
	}, 10000);
}

var current_tip = 0;
function giveTip() {

	switch (current_tip) {
	};
	
	
	ableToTip = false;
	return 0;
}