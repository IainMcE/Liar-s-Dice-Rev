import './GameList.css'
import {MiniUser, DisplayMiniUser, hideMiniUser, useDisplayUser} from './MiniUser';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import { useLoggedInId, type Game, type GamePlayer, type User } from './App';
import axios from 'axios';

//requires integration with backend for info on games in set up (host username, number players, visibility)
//		or list game ids then query for their info?

function GameList() {
	//GameList
	const [activeGames, setActiveGames] = useState([]);
	useEffect(()=>{
		const eventSource = new EventSource("http://localhost:8080/SubGameList");

		eventSource.addEventListener("GAMELIST", (event)=>{
			let json = JSON.parse(event.data);
			setActiveGames(json);
		});

		eventSource.onerror=(error)=>{
			console.error("event source error", error)
		}

		if(eventSource != null){
			return () => eventSource.close();
		}
	}, [])
	return (
	<div className="ViewGames" onClick={hideMiniUser}>
		<MiniUser/>
		<header className="GameTableHeader">
			<div className="hostNameColumn">Host</div>
			<div className="playerCountColumn">Players</div>
			<div className="visibilityColumn" title="TODO This will have functionality to sort by public/friends/in play. Games you are invited to should always be on top">Visibility</div>
			<div className="joinColumn" title="TODO If invited, text should be 'Accept Invite'. If games are in play, disable">Join</div>
			<div className="spectateColumn">Spectate</div>
		</header>
		<div>
			{activeGames.map((gameId: number)=>{
				return <TableRow key={gameId.toString()} gameId={gameId}/>
			})}
		</div>
	</div>
	);
}

function TableRow({gameId}: {gameId: number}){
	const {loggedInId} = useLoggedInId();
	const [game, setGame] = useState<Game | null>(null);
	const [hostFriend, setHostFriend] = useState(false);
	let [inGame, setInGame] = useState(false);
	useEffect(()=>{
		const fetching = async () =>{
			try{
				const gameResponse = await fetch(`http://localhost:8080/Game/${gameId}`);
				const gameResult = await gameResponse.json();
				setGame(gameResult);
				
				if(loggedInId>=0){
					const hostResponse = await fetch(`http://localhost:8080/Friends/${gameResult.host}/${loggedInId}`);
					if(hostResponse.status === 200){
						const hostResult = await hostResponse.json();
						setHostFriend(hostResult.status==="CONFIRMED");
					}else{
						setHostFriend(false);
					}
				}else{
					setHostFriend(false);
				}

				const inGameResponse = await fetch(`http://localhost:8080/Game/${gameId}/Players`);
				if(inGameResponse.status === 200){
					const inGameResult: GamePlayer[] = await inGameResponse.json();
					setInGame(inGameResult.filter(p=>p.playerId===loggedInId).length>0);
				}else{
					setInGame(false);
				}
			}catch(error){
				console.error('Error fetching data: ', error)
			}
		}
		fetching();
	}, [gameId, loggedInId]);
	if(game===null){
		return(<div>Loading...</div>)
	}
	if(game.visibility === "INVITE" && !inGame){
		return null;
	}
	if(game.visibility === "FRIENDS" && !hostFriend && !inGame){
		return null;
	}
	return(
		<div className="GameTableRow">
			<HostName hostId={game.host}/>
			<PlayerCount gameId={gameId}/>
			<div className="visibilityColumn">{game.visibility}</div>
			<JoinButton gameId={gameId} inGame={inGame} gameState={game.gameState}/>
			<SpectateButton gameId={gameId} inGame={inGame}/>
		</div>
	)
}

function HostName({hostId}: {hostId: number}){
	const [host, setHost] = useState<User | null>(null);
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

function PlayerCount({gameId}: {gameId:number}){
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

function SpectateButton({gameId, inGame}: {gameId:number, inGame:boolean}){
	const navigate = useNavigate();
	function SpectateGame(){
		fetch(`http://localhost:8080/Game/${gameId}`)
			.then(response => response.json())
			.then(data=>{
				let state = data.gameState;
				if(state === "CREATING"){
					navigate(`/GameLobby/${gameId}`);
				}else if(state === "ENDING"){
					alert("The game you are attempting to join has ended");
				}else{
					navigate(`/GameScreen/${gameId}`);
				}
			})
			.catch(error=>{
				console.error(error);
				alert("There was an error loading the game");
			})
	}
	return(
		<div className="spectateColumn">
			<button className="spectateButton" onClick={SpectateGame}>{inGame?"Return":"Spectate"}</button>
		</div>
	)
}

function JoinButton({gameId, inGame, gameState}: {gameId:number, inGame:boolean, gameState: string}){
	let {loggedInId} = useLoggedInId();
	const navigate = useNavigate();
	function JoinGame(){
		axios.post('http://localhost:8080/Game/Join', 
			[gameId, loggedInId]
		).then((response)=>{
			if(response.status === 200){
				let state = response.data.gameState;
				if(state === "CREATING"){
					navigate(`/GameLobby/${gameId}`);
				}else if(state === "ENDING"){
					alert("The game you are attempting to join has ended");
				}else{
					navigate(`/GameScreen/${gameId}`);
				}
			}
		}).catch((error)=>{
			console.error(error);
		})
	}
	return(
		<div className="joinColumn">
			<button className="joinButton" onClick={JoinGame} disabled={(!inGame && gameState!=="CREATING")||loggedInId<0}>{inGame?"Return":"Join"}</button>
		</div>
	)
}

export default GameList;