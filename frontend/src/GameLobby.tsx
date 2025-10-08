import './GameLobby.css';
import { useLoggedInId, type Game, type GamePlayer } from "./App";
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

function GameLobby(){
	let {gameId:idString} = useParams<{gameId:string}>();
	let gameId = idString?parseInt(idString):NaN;
	let {loggedInId} = useLoggedInId();
	let [game, setGame] = useState<Game|null>(null);
	let [players, setPlayers] = useState<GamePlayer[]>([]);
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
		let visibilityEl = document.querySelector(".visibilitySelect") as HTMLSelectElement;
		let visibility = visibilityEl.value;
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
				<div className="Invite">
					<header>Invites</header>
					TODO Future Implementation
				</div>
			</div>
		</div>
	)
}

function PlayerView({playerId, hostId}: {playerId: number, hostId: number}){
	let [player, setPlayer] = useState<GamePlayer|null>(null);
	useEffect(()=>{
		fetch(`http://localhost:8080/User/${playerId}`)
			.then(response=>response.json())
			.then(data=>setPlayer(data))
			.catch(error=>console.error(error));
	}, [playerId])
	return(
		<div className="PlayerView">
			<header>{player?.username??"Loading..."}</header>
			{hostId===playerId?<div className='isHost'>Host</div>:null}
		</div>
	)
}

export default GameLobby;