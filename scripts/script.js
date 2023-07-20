import * as fb from "./firebase.js"

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

async function fitPlayerInfoIntoHTML( playerJSON ) {
	const playerImgResp = await fetch(`https://futdb.app/api/players/${playerJSON.id}/image`, { 
									  method: "GET",
									  headers: {
										"Accept": "*",
										"X-Auth-Token": "29db2ef2-4419-4447-8253-99755c0f6a55",
								      },
									})

	const clubImgResp = await fetch(`https://futdb.app/api/clubs/${playerJSON.club}/image`, { 
										method: "GET",
										headers: {
										  "Accept": "*",
										  "X-Auth-Token": "29db2ef2-4419-4447-8253-99755c0f6a55",
										},
									  })

	const leagueImgResp = await fetch(`https://futdb.app/api/leagues/${playerJSON.league}/image`, { 
									  method: "GET",
									  headers: {
										"Accept": "*",
										"X-Auth-Token": "29db2ef2-4419-4447-8253-99755c0f6a55",
								      },
									})

	return `
	<h1 class="player_name"> ${playerJSON.commonName} </h1>
	<img width="90px" height="90px" class="player_pic" src="${URL.createObjectURL(await playerImgResp.blob())}">
	<h3 class="player_rating"> ${playerJSON.rating} </h3>
	<p class="player_info">
		<i class="fa-solid fa-baby" style="color: #0c2145;"></i> Date of Birth: ${playerJSON.birthDate} <br/>
		<i class="fa-solid fa-trophy" style="color: #07155a;"></i> League: <img class="icon" width="30px" height="30px" src="${URL.createObjectURL(await leagueImgResp.blob())}"> <br/>
		<i class="fa-solid fa-scroll" style="color: #0f203e;"></i> Club: <img class="icon" width="30px" height="30px" src="${URL.createObjectURL(await clubImgResp.blob())}"> <br/>
		<i class="fa-solid fa-futbol" style="color: #112a55;"></i> Position: ${playerJSON.position} <br/>
	</p>
	<div class="player_atrib_line_l"> <i class="fa-solid fa-person-running" style="color: #1e3c71;"></i> Pace: ${playerJSON.pace} </div>
	<div class="player_atrib_line_r"> <i class="fa-solid fa-meteor" style="color: #102446;"></i> Shooting: ${playerJSON.shooting} </div>
	<div class="player_atrib_line_l"> <i class="fa-solid fa-people-arrows" style="color: #355997;"></i> Passing: ${playerJSON.passing} </div>
	<div class="player_atrib_line_r"> <i class="fa-solid fa-user-ninja" style="color: #142d57;"></i> Dribbling: ${playerJSON.dribbling} </div>
	<div class="player_atrib_line_l"> <i class="fa-solid fa-shield-halved" style="color: #172f59;"></i> Defending: ${playerJSON.defending} </div>
	<div class="player_atrib_line_r"> <i class="fa-solid fa-dumbbell" style="color: #20437e;"></i> Physicality: ${playerJSON.physicality} </div>
	`
}

async function getPLayerByID( id ) {
	let response = await fetch(`https://futdb.app/api/players/${id}`, { 
		method: "GET",
		headers: {
			"Accept": "*/*",
			"X-Auth-Token": "29db2ef2-4419-4447-8253-99755c0f6a55",
		},
	});

	const responseJson = await response.json();
	return responseJson.player;
}

async function createPlayerContainer( playerID ) {
	let newPlayer = document.createElement("div");
	newPlayer.classList.add("player_container");

	const playerInfo = await getPLayerByID(playerID);

	newPlayer.innerHTML = await fitPlayerInfoIntoHTML(playerInfo);

	document.body.append(newPlayer);
};

async function createRandomPlayerContainer(min_rating = 80) {
	await createPlayerContainer( await retrieveRandomPlayerIDWithMinRating(min_rating) );
};

await createRandomPlayerContainer(60);