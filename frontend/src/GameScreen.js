import './GameScreen.css'
import {useState, useEffect} from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLoggedInId } from './App';
import axios from 'axios';

function GameScreen() {//replace with ids and dice left
	let {gameId} = useParams();
	gameId = parseInt(gameId);
	let {loggedInId} = useLoggedInId();
	const [game, setGame] = useState(null);
	const [players, setPlayers] = useState([]);
	let [userPlayer, setUserPlayer] = useState(null);
	const [inGame, setInGame] = useState([]);
	useEffect(()=>{
		const fetching = async()=>{
			try{
				const gameResponse = await fetch(`http://localhost:8080/Game/${gameId}`);
				const gameResult = await gameResponse.json();
				setGame(gameResult);
				
				const playersResponse = await fetch(`http://localhost:8080/Game/${gameId}/Players`);
				const playersResult = await playersResponse.json();
				setPlayers(playersResult);
				let curPlay = playersResult.filter(p=>p.playerId===loggedInId)
				setInGame(curPlay.length>0);
				setUserPlayer(curPlay[0]);
			}catch(error){
				console.error('Error fetching data: ', error)
			}
		}
		fetching();
	}, [gameId, loggedInId]);
	if(game === null){
		return(<h1>The game does not exist.</h1>)
	}
	if(game.gameState === "CREATING"){
		return(<div>
			<h1>The game has not started yet</h1>
			<Link to={"/GameLobby/"+gameId}>Go to lobby</Link>
			</div>)
	}
	return (
	<div className="GameScreen">
		<div className="CurrentPlayers">
		{players.map((player)=>{
			return <PlayerDiceInfo playerId={player.playerId} diceLeft={player.diceCount} currentPlayer={game.currentPlayer} maxDice={game.maxDice??6}/>
		})}
		</div>
		<hr/>
		<PreviousBet game={game}/>
		<BetUI game={game} inGame={inGame} setGame={setGame}/>
		<PlayersDice inGame={inGame} dice={userPlayer?[userPlayer.die1, userPlayer.die2, userPlayer.die3, userPlayer.die4, userPlayer.die5, userPlayer.die6].slice(0, userPlayer.diceCount):[]}/>
	</div>
	);
}

function PlayerDiceInfo({playerId, diceLeft, currentPlayer, maxDice}){
	const {loggedInId} = useLoggedInId();
	const [playerData, setPlayerData] = useState(null);
	useEffect(()=>{
		fetch('http://localhost:8080/User/'+playerId)
			.then(response=>response.json())
			.then(data => setPlayerData(data))
			.catch(error => console.error('Error fetching data: ', error))
	}, [playerId]);
	return (
		<div className={"PlayerInfoContainer "+(currentPlayer===playerId?"CurrentPlayer":"")}>
			<header className="pInfoHeader">
				{playerId===loggedInId?"You":(playerData?.username??"Loading...")}
			</header>
			<div>Dice in play:</div>
			<img className="DiceLeft" src={"/dice/"+diceLeft+".png"} alt=""></img>
			<div className="LostDice">Lost dice: {maxDice-diceLeft}</div>
		</div>
	);
}

function PreviousBet({game}){
	let {loggedInId} = useLoggedInId();
	let displayText = game.betCount === 0 || game.betDie === 0;//both should be >1 if a valid guess was made
	const [playerData, setPlayerData] = useState(null);
	const [previousPlayerData, setPreviousPlayerData] = useState(null);
	useEffect(()=>{
		fetch('http://localhost:8080/User/'+game.currentPlayer)
			.then(response=>response.json())
			.then(data => setPlayerData(data))
			.catch(error => console.error('Error fetching data: ', error))
	}, [game]);
	useEffect(()=>{
		fetch('http://localhost:8080/User/'+game.previousPlayer)
			.then(response=>response.json())
			.then(data => setPreviousPlayerData(data))
			.catch(error => console.error('Error fetching data: ', error))
	}, [game]);
	if(displayText){
		if(game.currentPlayer === loggedInId){
			return (
				<div className="prevBet">
					Make the first bet to start the round
				</div>
			)
		}else{
			return (
				<div className="prevBet">
					{playerData?.username??""} is making the first bet
				</div>
			)
		}
	}
	if(game.gameState === "CONTESTING"){
		if(game.previousPlayer === loggedInId){
			return(
				<div className="prevBet">
					{playerData?.username??""} challenged your bet of {game.betCount} {game.betDie}s
				</div>
			)
		}else if(game.currentPlayer === loggedInId){
			return(
				<div className="prevBet">
					You challenged {previousPlayerData?.username??""}'s bet of {game.betCount} {game.betDie}s
				</div>
			)
		}else{
			return(
				<div className="prevBet">
					{playerData?.username??""} challenged {previousPlayerData?.username??""}'s bet of {game.betCount} {game.betDie}s
				</div>
			)
		}
	}
	if(game.gameState === "RESOLVING"){
		if(game.loserId === loggedInId){
			return(
				<div className="prevBet">
					There were {game.actualCount} {game.betDie}s. You lose 1 die.
				</div>
			)
		}else{
			return(
				<div className="prevBet">
					There were {game.actualCount} {game.betDie}s. {game.loserId===game.previousPlayer?(previousPlayerData?.username??""):(playerData?.username??"")} loses 1 die.
				</div>
			)
		}
	}
	if(game.previousPlayer === loggedInId){
		return(
			<div className="prevBet">
				You bet there is: {game.betCount} {game.betDie}s
			</div>
		)
	}else{
		return(
			<div className="prevBet">
				{previousPlayerData?.username??""} bets there is: {game.betCount} {game.betDie}s
			</div>
		)
	}
}

function PlayersDice({inGame, dice}){
	if(!inGame){
		return null;
	}
	return(
		<div className="YourDice">
			<header className="ShowDice">
				Your Dice:
			</header>
			{dice.map(d=><PlayerDie roll={d??0}/>)}
		</div>
	)
}

function PlayerDie({roll}){
	return(
		<img className="playerDice" src={"/dice/"+roll+".png"} alt=""></img>
	)
}

function BetUI({game, inGame, setGame}){
	let {loggedInId} = useLoggedInId();
	let navigate = useNavigate();
	let [count, setCount] = useState(game.betCount+1);
	let [die, setDie] = useState(game.betDie);
	let lockOut = game.gameState !== "PLAYING";
	function leaveGame(){
		axios.post('http://localhost:8080/Game/Leave', {
			gameId:game.gameId,
			playerId:loggedInId
		}).then((response)=>{
			if(response.status === 200){
				navigate("/GameList");
			}
		}).catch((error)=>{
			console.error(error);
		})
	}
	function increaseDie(){
		setDie(Math.min(die+1, 6));
	}
	function decreaseDie(){
		if(die-1<=game.betDie){
			setCount(Math.max(count, game.betCount+1))
		}
		setDie(Math.max(die-1, 1));
	}
	function increaseCount(){
		setCount(count+1);
	}
	function decreaseCount(){
		setCount(Math.max(count-1, 1));
	}
	function placeBet(){
		axios.post('http://localhost:8080/Game/Bet', {
			gameId:game.gameId,
			betCount: count,
			betDie: die
		}).then((response)=>{
			if(response.status === 200){
				setGame(response.data);
			}
		}).catch((error)=>{
			console.error(error);
		})
	}
	function challengeBet(){
		
	}
	if(!inGame){
		return(
			<div className="Bet">
				<div className="RoundEndButtonHolder">
					<button onClick={leaveGame}>Stop Watching</button>
				</div>
			</div>
		)
	}
	return(
		<div className="Bet">
			<header>Place your bet:</header>
			<div className="BetChangeButtons">
				<button className="incrBetCount betButtonWidth" onClick={increaseCount} disabled={lockOut || game.currentPlayer!==loggedInId}>/\</button>
				<div className="betSpacer"></div>
				<button className="incrBetDie betButtonWidth" onClick={increaseDie} disabled={lockOut || game.currentPlayer!==loggedInId || die>=6}>/\</button>
				<br/>
				<div className="betContainer">
					<p className="betCount betButtonWidth">{count}</p>
					<div className="betSpacer">x</div>
					<img src={"/dice/"+die+".png"} className="betDie betButtonWidth" alt="Bet Dice Size"/>
				</div>
				<button className="decrBetCount betButtonWidth" onClick={decreaseCount} disabled={lockOut || game.currentPlayer!==loggedInId || (count<=game.betCount+1&&die<=game.betDie) || count<=1}>\/</button>
				<div className="betSpacer"></div>
				<button className="decrBetDie betButtonWidth" onClick={decreaseDie} disabled={lockOut || game.currentPlayer!==loggedInId || die<=game.betDie || die<=1}>\/</button>
				<br/>
			</div>
			<div className="RoundEndButtonHolder">
				<button onClick={challengeBet} disabled={lockOut || game.currentPlayer!==loggedInId || game.betCount===0 || game.betDie===0}>Challenge previous bet</button>
				<button onClick={placeBet} disabled={lockOut || game.currentPlayer!==loggedInId}>Place new bet</button>
				<button onClick={leaveGame}>Forfeit</button>
			</div>
		</div>
	)
}

export default GameScreen;