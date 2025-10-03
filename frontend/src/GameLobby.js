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
		axios.post('http://localhost:8080/Game/Start', gameId)
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
		}).then((response)=>{
			if(response.status === 200){
				navigate("/GameList");
			}
		}).catch((error)=>{
			console.error(error);
		})
	}

	useEffect(()=>{
		const fetching = async()=>{
			try{
				const gameResponse = await fetch(`http://localhost:8080/Game/${gameId}`);
				const gameResult = await gameResponse.json();
				setGame(gameResult);
				
				const playersResponse = await fetch(`http://localhost:8080/Game/${gameId}/Players`);
				const playersResult = await playersResponse.json();
				setPlayers(playersResult);
			}catch(error){
				console.error('Error fetching data: ', error)
			}
		}
		fetching();
	}, [gameId]);
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
				<button className="LeaveGame" onClick={leaveGame} title="TODO if a player: remove from game, nav to gamelist">Leave</button>
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