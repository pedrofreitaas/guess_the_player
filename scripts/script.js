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
		Date of Birth: ${playerJSON.birthDate} <br/>
		League: <img width="30px" height="30px" src="${URL.createObjectURL(await leagueImgResp.blob())}"> <br/>
		Club: <img width="30px" height="30px" src="${URL.createObjectURL(await clubImgResp.blob())}"> <br/>
		Position: ${playerJSON.position} <br/>
		Pace: ${playerJSON.pace} <span class="tab"> Shooting: ${playerJSON.shooting} <span class="tab"> <br/>
		Passing: ${playerJSON.passing} <span class="tab"> Dribbling: ${playerJSON.dribbling} <span class="tab"> <br/>
		Defending: ${playerJSON.defending} <span class="tab"> Physicality: ${playerJSON.physicality} <span class="tab"> <br/>
	</p>
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