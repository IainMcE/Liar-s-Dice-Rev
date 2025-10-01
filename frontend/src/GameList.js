import './GameList.css'
import {MiniUser, DisplayMiniUser, hideMiniUser, useDisplayUser} from './MiniUser.js';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

//requires integration with backend for info on games in set up (host username, number players, visibility)
//		or list game ids then query for their info?

function GameList() {
	//GameList
	const [activeGames, setActiveGames] = useState([]);
	useEffect(()=>{
		fetch('http://localhost:8080/GameList')
			.then(response=>response.json())
			.then(data => setActiveGames(data))
			.catch(error => console.error('Error fetching data: ', error))
	}, []);
	return (
	<div className="ViewGames" onClick={hideMiniUser}>
		<MiniUser/>
		<header className="GameTableHeader">
			<div className="hostNameColumn">Host</div>
			<div className="playerCountColumn">Players</div>
			<div className="visibilityColumn" title="This will have functionality to sort by public/friends/in play. Games you are invited to should always be on top">Visibility</div>
			<div className="joinColumn" title="If invited, text should be 'Accept Invite'. If games are in play, disable">Join</div>
			<div className="spectateColumn">Spectate</div>
		</header>
		<div>
			{activeGames.map((gameId)=>{
				return <TableRow gameId={gameId}/>
			})}
		</div>
	</div>
	);
}

function TableRow(input){
	let gameId = input.gameId;
	const [game, setGame] = useState(null);
	useEffect(()=>{
		fetch(`http://localhost:8080/Game/${gameId}`)
			.then(response=>response.json())
			.then(data => setGame(data))
			.catch(error => console.error('Error fetching data: ', error))
	}, [gameId]);
	if(game===null){
		return(<div>Loading...</div>)
	}
	return(
		<div className="GameTableRow">
			<HostName hostId={game.host}/>
			<div className="playerCountColumn">{1}</div>
			<div className="visibilityColumn">{game.visibility}</div>
			<JoinButton gameId={gameId}/>
			<div className="spectateColumn">
				<button className="spectateButton">Spectate</button>
			</div>
		</div>
	)
}

function HostName(input){
	let hostId = input.hostId;
	const [host, setHost] = useState(null);
	useEffect(()=>{
		fetch(`http://localhost:8080/User/${hostId}`)
			.then(response=>response.json())
			.then(data => setHost(data))
			.catch(error => console.error('Error fetching data: ', error))
	}, [hostId]);

	const {setId} = useDisplayUser();

	if(host===null){
		return(<div className="hostNameColumn">Loading...</div>)
	}

	return(
		<div className="hostNameColumn" onClick={(e)=>{setId(hostId);DisplayMiniUser(e, "left" , "top")}}>
			{host?host.username:""}
			{/* fix vertical spacing, also on scroll*/}
		</div>
	)
}

function JoinButton(input){
	let gameId = input.gameId;
	const navigate = useNavigate();
	function JoinGame(){
		navigate(`/GameScreen/${gameId}`);
	}
	return(
		<div className="joinColumn">
			<button className="joinButton" onClick={JoinGame}>Join</button>
		</div>
	)
}

export default GameList;