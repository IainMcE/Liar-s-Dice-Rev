import './GameList.css'
import {MiniUser, DisplayMiniUser, hideMiniUser, useDisplayUser} from './MiniUser.js';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import { useLoggedInId } from './App.js';

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
				return <TableRow key={gameId.toString()} gameId={gameId}/>
			})}
		</div>
	</div>
	);
}

function TableRow(input){
	let gameId = input.gameId;
	const {loggedInId} = useLoggedInId();
	const [game, setGame] = useState(null);
	const [hostFriend, setHostFriend] = useState(null);
	useEffect(()=>{
		const fetching = async () =>{
			try{
				const gameResponse = await fetch(`http://localhost:8080/Game/${gameId}`);
				const gameResult = await gameResponse.json();
				setGame(gameResult);
				
				const hostResponse = await fetch(`http://localhost:8080/Friends/${gameResult.host}/${loggedInId}`);
				if(hostResponse.status === 200){
					const hostResult = await hostResponse.json();
					setHostFriend(hostResult.status==="CONFIRMED");
				}else{
					setHostFriend(false);
				}
			}catch(error){
				console.error('Error fetching data: ', error)
			}
		}
		fetching();
	}, [gameId, loggedInId]);
	if(game===null || hostFriend == null){
		return(<div>Loading...</div>)
	}
	if(game.visibility === "INVITE"){
		return null;
	}
	if(game.visibility === "FRIENDS" && !hostFriend){
		return null;
	}
	return(
		<div className="GameTableRow">
			<HostName hostId={game.host}/>
			<PlayerCount gameId={gameId}/>
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

function PlayerCount(input){
	let gameId = input.gameId;
	let [count, setCount] = useState(null);
	useEffect(()=>{
		fetch(`http://localhost:8080/Game/${gameId}/Players`)
			.then(response=>response.json())
			.then(data => setCount(data.length))
			.catch(error => console.error('Error fetching data: ', error))
	}, [gameId]);
	if(count === null){
		return(<div className="playerCountColumn">-</div>)
	}
	return(
		<div className="playerCountColumn">{count}</div>
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