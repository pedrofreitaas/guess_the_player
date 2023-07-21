var ableToTip = false;

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
	  		"Accept": "*",
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
		name: responseJson.commonName,
		birthDate: responseJson.birthDate,
		rating: responseJson.rating,
		position: responseJson.position,
		icon: await getPlayerImgURLByID(responseJson.id),
		leagueIcon: await getPlayerLeagueImgURLBy(responseJson.league),
		clubIcon: await getPlayerClubImgURLByID(responseJson.club),
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

function fitPlayerJSONIntoHTML( playerJSON ) {
	return `
	<h1 class="player_name"> ${playerJSON.name} </h1>
	<img width="90px" height="90px" class="player_pic" src="${playerJSON.icon}">
	<h3 class="player_rating"> ${playerJSON.rating} </h3>
	<p class="player_info">
		<i class="fa-solid fa-baby" style="color: #0c2145;"></i> Date of Birth: ${playerJSON.birthDate} <br/>
		<i class="fa-solid fa-trophy" style="color: #07155a;"></i> League: <img class="icon" width="30px" height="30px" src="${playerJSON.leagueIcon}"> <br/>
		<i class="fa-solid fa-scroll" style="color: #0f203e;"></i> Club: <img class="icon" width="30px" height="30px" src="${playerJSON.clubIcon}"> <br/>
		<i class="fa-solid fa-futbol" style="color: #112a55;"></i> Position: ${playerJSON.position} <br/>
	</p>
	<div class="player_atrib_line_l"> <i class="fa-solid fa-person-running" style="color: #1e3c71;"></i> Pace: <div id="player_pace"> ${playerJSON.pace} </div> </div>
	<div class="player_atrib_line_r"> <div id="player_shooting"> ${playerJSON.shooting} </div> Shooting: <i class="fa-solid fa-meteor" style="color: #102446;"></i> </div>
	<div class="player_atrib_line_l"> <i class="fa-solid fa-people-arrows" style="color: #355997;"></i> Passing: <div id="player_passing"> ${playerJSON.passing} </div> </div>
	<div class="player_atrib_line_r"> <div id="player_dribbling"> ${playerJSON.dribbling} </div> Dribbling: <i class="fa-solid fa-user-ninja" style="color: #142d57;"></i> </div>
	<div class="player_atrib_line_l"> <i class="fa-solid fa-shield-halved" style="color: #172f59;"></i> Defending:<div id="player_defending"> ${playerJSON.defending} </div> </div>
	<div class="player_atrib_line_r"> <div id="player_physicality"> ${playerJSON.physicality} </div> Physicality: <i class="fa-solid fa-dumbbell" style="color: #20437e;"></i> </div>
	`
}

function insertLoadIcon() {
	const loadIcon = document.createElement("div");
	loadIcon.classList.add("player_container_load");

	document.body.getElementsByClassName("player_container")[0].appendChild(loadIcon);
}

function removeLoadIcon() {
	document.body.getElementsByClassName("player_container")[0].removeChild( document.getElementsByClassName("player_container_load")[0] );
}

window.onload = async function choosePlayer() {
	let playerJSON = JSON.parse( localStorage.getItem("playerJSON") );

	const playerContainer = document.createElement("div");
	playerContainer.classList.add("player_container");
	document.body.appendChild(playerContainer);

	insertLoadIcon();

	if( playerJSON != null )
		playerContainer.innerHTML = fitPlayerJSONIntoHTML( playerJSON );
	
	else {
		playerJSON = await getPlayerJSONByID( await retrieveRandomPlayerIDWithMinRating(80) );
		playerContainer.innerHTML = fitPlayerJSONIntoHTML(playerJSON);
		
		localStorage.setItem( "playerJSON", JSON.stringify(playerJSON) );
	}
	
	removeLoadIcon(); 
}

export function resetPlayer() {
	localStorage.clear();
	location.reload();
}

// recover player Tip's timer.
setInterval( () => {
	ableToTip=true;

	const tipButton = document.getElementsByClassName("player_tip_button")[0];
	tipButton.style.textDecoration = "none";
}, 10000);

export function tryToTip() {
	if (ableToTip) {
		console.log("dando dica.");
		ableToTip = false;

		const tipButton = document.getElementsByClassName("player_tip_button")[0];
		tipButton.style.textDecoration = "line-through";
	}

	else
		console.log("sem dica");
}