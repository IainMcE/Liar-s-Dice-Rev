import './GameLobby.css';
import { useLoggedInId } from "./App";
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';


function GameLobby(){
	let {gameId} = useParams();
	gameId = parseInt(gameId);
	let {loggedInId} = useLoggedInId();
	let [game, setGame] = useState(null);
	let [players, setPlayers] = useState([]);
	let navigate = useNavigate();

	function startGame(){
		axios.post('http://localhost:8080/Game/Start', {gameId:gameId})
			.then((response)=>{
				if(response.status===200){
					navigate(`/GameScreen/${gameId}`);
				}
			}).catch((error)=>{
				console.error(error);
				alert("There was an error starting the game");
			})
	}

	function changeVisibility(){
		let visibility = document.querySelector(".visibilitySelect").value;
		axios.post('http://localhost:8080/Game/Visibility', {
			gameId:gameId,
			visibility: visibility
		}).catch((error)=>{
			console.error(error);
		})
	}

	function leaveGame(){
		axios.post('http://localhost:8080/Game/Leave', {
			gameId:gameId,
			playerId:loggedInId
		}).catch((error)=>{
			console.error(error);
		})
	}

	useEffect(()=>{
		const eventSource = new EventSource(`http://localhost:8080/SubGame/${gameId}`);

		eventSource.addEventListener("GAME", (event)=>{
			let json = JSON.parse(event.data);
			setGame(json);
			if(game===null){
				return;
			}
			switch(game.gameState){
				case "CREATING":
					break;
				case "ENDING":
					navigate("/GameList");
					break;
				default:
					navigate(`/GameScreen/${gameId}`);
					break;
			}
		});

		eventSource.addEventListener("PLAYER", (event)=>{
			let json = JSON.parse(event.data);
			setPlayers(json);
		});

		eventSource.onerror=(error)=>{
			console.error("event source error", error)
		}

		if(eventSource != null){
			return () => eventSource.close();
		}
	}, []);
	if(game === null || players.length === 0){
		return null;
	}
	return(
		<div className="GameLobby">
			<div className="PlayerViews">
				<header className="PlayerHeader">Players</header>
				{players.map((player)=>{
					return(<PlayerView key={player.playerId} playerId={player.playerId} hostId={game.host}/>)
				})}
				<button className="LeaveGame" onClick={leaveGame}>Leave</button>
			</div>
			<div className="RightSide">
				<div className="Settings">
					Game Visibility: 
					<select className="visibilitySelect" disabled={loggedInId!==game.host} onChange={changeVisibility} defaultValue={game.visibility}>
						<option value="PUBLIC">Public</option>
						<option value="FRIENDS">Friends</option>
						<option value="INVITE">Invite Only</option>
					</select>
				</div>
				<button className="StartGame" disabled={loggedInId!==game.host}onClick={startGame}>Start Game</button>
				{/* TODO Other uses nav to game screen when game starts */}
				<div className="Invite">
					<header>Invites</header>
					TODO What do I do here?
				</div>
			</div>
		</div>
	)
}

function PlayerView({playerId, hostId}){
	let [player, setPlayer] = useState([]);
	useEffect(()=>{
		fetch(`http://localhost:8080/User/${playerId}`)
			.then(response=>response.json())
			.then(data=>setPlayer(data))
			.catch(error=>console.error(error));
	}, [playerId])
	return(
		<div className="PlayerView">
			<header>{player.username}</header>
			{hostId===playerId?<div className='isHost'>Host</div>:null}
		</div>
	)
}

export default GameLobby;