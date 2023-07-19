import * as fb from "./firebase.js"

let player_component_innerHTML_pattern = 
`
<div class="player_container">
<h3 class="player_name"> ##name </h3>
<img src="##path_to_pic" class="player_pic">
<p class="player_info">
	Age: ##age <br/>
	League: ##curr_league <br/>
	Club: ##curr_club <br/>
	Position: ##position <br/>
	Foot: ##foot <br/>
</p>
</div>
`;

async function retrieveRandomPlayerID() {
	const players = fb.collection(fb.db, '/players');
	
	const playersSnapshot = await fb.getDocs(players);

	const ids = playersSnapshot.docs.map(doc => doc.id)

	return ids[Math.floor(Math.random() * ids.length)];
};

function fitPlayerInfoIntoHTML( playerInfo ) {
	let player_innerHTML = player_component_innerHTML_pattern.replace("##name", playerInfo.name);
	player_innerHTML = player_innerHTML.replace("##path_to_pic", playerInfo.path_to_pic);
	player_innerHTML = player_innerHTML.replace("##age", playerInfo.age);
	player_innerHTML = player_innerHTML.replace("##curr_league", playerInfo.league);
	player_innerHTML = player_innerHTML.replace("##curr_club", playerInfo.club);
	player_innerHTML = player_innerHTML.replace("##position", playerInfo.pos);
	player_innerHTML = player_innerHTML.replace("##foot", playerInfo.foot);

	return player_innerHTML
}

async function getPLayerByID( id ) {
	const players = fb.collection(fb.db, '/players');
	
	const playersSnapshot = await fb.getDocs(players);

	const player = playersSnapshot.docs.filter( doc => doc.id==id ).map(doc => doc.data());

	try{
		return player[0];
	} catch (RangeError) {
		return undefined;
	}
}

async function generatePlayer() {
	try {
		const docRef = await fb.addDoc( fb.collection(fb.db, "/players"), {

										});

		console.log(`Written player with id: ${docRef}`);
	} catch (error) {
		console.log(error);
	}							

}

async function createPlayerContainer( playerID ) {
	let newPlayer = document.createElement("div");

	const playerInfo = await getPLayerByID(playerID);

	if (playerInfo === undefined) return;

	newPlayer.innerHTML = fitPlayerInfoIntoHTML( playerInfo );

	document.body.append(newPlayer);
};

async function createRandomPlayerContainer() {
	await createPlayerContainer( await retrieveRandomPlayerID() );
};

// await createRandomPlayerContainer();

async function testAPI() {
	let response = await fetch("https://api.football-data.org/v4/competitions/SA/scorers", { 
		method: "GET",
		headers: {
			"Accept": "*/*",
			"X-Auth-Token": "a350206d55574584b9d29d30aa5b30f2",
		},
		origin: "http://localhost",
	});

	console.log(response);

	let data = await response.text();
	console.log(data);
};

await testAPI();