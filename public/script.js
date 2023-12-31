function getRandomIntegerFromTo(a=0, b=0) {
	return Math.floor( Math.random() * b + a );
}				   

const allPositions = ["GK", "CF", "RWB", "MD", "CAM", "CB", "LB", "RB", "SW", 
				   	  "LWB", "RWB", "CM", "AM", "DM", "LM", "RM", "CF", "S",
					  "SS", "ST", "LW"];
function getPossiblePositions(realPos) {
	const allPositionsExceptReal = allPositions.filter(pos => pos!=realPos);

	let possiblePositions = [allPositionsExceptReal[getRandomIntegerFromTo(0,allPositionsExceptReal.length)],
							 allPositionsExceptReal[getRandomIntegerFromTo(0,allPositionsExceptReal.length)],
							 allPositionsExceptReal[getRandomIntegerFromTo(0,allPositionsExceptReal.length)]];
	possiblePositions[getRandomIntegerFromTo(0, 2)] = realPos;

	return possiblePositions.join(" or ");
}

// get from player methods.
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

		if(playersWithSufficientOver.length > 0) return playersWithSufficientOver[getRandomIntegerFromTo(0, playersWithSufficientOver.length)].id;
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
		
		name: ["?", responseJson.commonName, 0], realName: responseJson.name,	
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
	<div class="header">
		<h1 class="player_name"> <i id="name">${playerJSON.name[playerJSON.name[2]]}</i> </h1>
		<img width="120px" height="120px" class="player_pic" src="${await playerJSON.obtainIcon(playerJSON.id)}">
		<h3 class="player_rating"> <i id="rating">${playerJSON.rating[playerJSON.rating[2]]}</i> </h3>
		
		<p class="player_info">
			<i class="fa-solid fa-baby" style="color: #0c2145;"></i> Date of Birth: <i id="birthDate">${playerJSON.birthDate[playerJSON.birthDate[2]]}</i> <br/>
			<i class="fa-solid fa-trophy" style="color: #07155a;"></i> League and Club: <img class="icon" width="30px" height="30px" src="${await playerJSON.obtainLeagueIcon(playerJSON.leagueID)}"> <img class="icon" width="30px" height="30px" src="${await playerJSON.obtainClubIcon(playerJSON.clubID)}"> <br/>
			<i class="fa-solid fa-futbol" style="color: #112a55;"></i> Position: <i id="position">${playerJSON.position[playerJSON.position[2]]}</i> <br/>
		</p>
	</div>

	<div class="atributtes">
		<div class="player_atrib_line_l"> <i class="fa-solid fa-person-running" style="color: #1e3c71;"></i> Pace: <i id="pace">${playerJSON.pace[playerJSON.pace[2]]}</i> </div>
		<div class="player_atrib_line_r"> <i class="fa-solid fa-meteor" style="color: #102446;"></i> Shooting: <i id="shooting">${playerJSON.shooting[playerJSON.shooting[2]]}</i> </div>
		<div class="player_atrib_line_l"> <i class="fa-solid fa-people-arrows" style="color: #355997;"></i> Passing: <i id="passing">${playerJSON.passing[playerJSON.passing[2]]}</id> </div>
		<div class="player_atrib_line_r"> <i class="fa-solid fa-user-ninja" style="color: #142d57;"></i> Dribbling: <i id="dribbling">${playerJSON.dribbling[playerJSON.dribbling[2]]}</id> </div>
		<div class="player_atrib_line_l"> <i class="fa-solid fa-shield-halved" style="color: #172f59;"></i> Defending: <i id="defending">${playerJSON.defending[playerJSON.defending[2]]}</id> </div>
		<div class="player_atrib_line_r"> <i class="fa-solid fa-dumbbell" style="color: #20437e;"></i> Physicality: <i id="physicality">${playerJSON.physicality[playerJSON.physicality[2]]}</id> </div>
	</div>
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
		playerJSON = await getPlayerJSONByID( await retrieveRandomPlayerIDWithMinRating(83) );
		playerContainer.innerHTML = await fitPlayerJSONIntoHTML();
		
		localStorage.setItem( "playerJSON", JSON.stringify(playerJSON) );
	}
}

export function resetPlayer() {
	localStorage.clear();
	location.reload();
}
// ---------------------- 

// tip system.
var ableToTip = true;
const tipTime = 3; //seconds
export function tryToTip() {
	if ( !ableToTip )
		return

	const tipButton = document.getElementsByClassName("player_tip_button")[0];
	tipButton.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
	
	giveTip();
}

var current_tip = JSON.parse(localStorage.getItem("current_tip"));
if(current_tip == null) current_tip = 0;

const tips = ["rating", "birthDate", "position", "pace",
			  "shooting", "passing", "dribbling", "defending", "physicality"];

function giveTip() {
	const whichTip = tips[current_tip];
	const atrib = document.getElementById(whichTip);
	atrib.innerHTML = playerJSON[whichTip][1];
	
	// update definer to continue showing tip after a page reload.
	playerJSON[whichTip][2]=1;

	// moving on to next tip and setting tip delay.
	current_tip++;
	ableToTip = false;
	
	const playerImg = document.getElementsByClassName("player_pic")[0];
	playerImg.style.opacity = .125*current_tip;

	setTimeout( () => {
		ableToTip=true;
	
		const tipButton = document.getElementsByClassName("player_tip_button")[0];
		tipButton.innerHTML = `<i class="fa-solid fa-lightbulb" style="color: #443c06;"></i>`;
	}, tipTime*1000);

	localStorage.setItem( "playerJSON", JSON.stringify(playerJSON) );
	localStorage.setItem( "current_tip", JSON.stringify(current_tip) );
};

export function userGuess( inputHTML ) {
	const guess = inputHTML.value;
	const answer = playerJSON.realName;

	console.log(answer);

	if(guess === answer || (answer.split(" ")).indexOf(guess) != -1) {
		document.getElementById("name").innerHTML = answer;
		setTimeout( () => {
			resetPlayer();
		}, 3000);

		return
	}

	document.body.getElementsByClassName("player_name_input")[0].value = "Wrong name";
}
// ------------------------- //

var playerJSON = {}
window.onload = await choosePlayer();