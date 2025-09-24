import './GameList.css'

//requires integration with backend for info on games in set up (host username, number players, visibility)
//		or list game ids then query for their info?

function GameList() {
	let tableRows = [];
	for(let i = 0; i<100; i++){
		tableRows.push(tableRow("Jerry (from Seinfeld)", 3, "Friends Only"));
	}
	return (
	<div className="ViewGames">
		<header className="GameTableHeader">
			<div className="hostNameColumn">Host</div>
			<div className="playerCountColumn">Players</div>
			<div className="visibilityColumn" title="This will have functionality to sort by public/friends/in play. Games you are invited to should always be on top">Visibility</div>
			<div className="joinColumn" title="If invited, text should be 'Accept Invite'. If games are in play, disable">Join</div>
			<div className="spectateColumn">Spectate</div>
		</header>
		{tableRows}
	</div>
	);
}

function tableRow(hostName, numPlayers, visibility){
	return(
	<div className="GameTableRow">
		<div className="hostNameColumn">{hostName}</div>
		<div className="playerCountColumn">{numPlayers}</div>
		<div className="visibilityColumn">{visibility}</div>
		<div className="joinColumn">
			<button className="joinButton">Join</button>
		</div>
		<div className="spectateColumn">
			<button className="spectateButton">Spectate</button>
		</div>
	</div>
	)
}

export default GameList;