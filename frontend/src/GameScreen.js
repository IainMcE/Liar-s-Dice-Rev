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
		<PreviousBet count={game.betCount} size={game.betDie} currentPlayer={game.currentPlayer}/>
		<BetUI gameId={gameId} inGame={inGame} currentPlayer={game.currentPlayer} betCount={game.betCount} betDie={game.betDie}/>
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

function PreviousBet({count, size, currentPlayer}){
	let {loggedInId} = useLoggedInId();
	let displayText = count === 0 || size === 0;//both should be >1 if a valid guess was made
	const [playerData, setPlayerData] = useState(null);
	useEffect(()=>{
		fetch('http://localhost:8080/User/'+currentPlayer)
			.then(response=>response.json())
			.then(data => setPlayerData(data))
			.catch(error => console.error('Error fetching data: ', error))
	}, [currentPlayer]);
	if(displayText){
		if(currentPlayer === loggedInId){
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
	}else{
		return(
			<div className="prevBet">
				{playerData?.username??""} bets there is: {count} {size}s
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

function BetUI({gameId, inGame, currentPlayer, betCount, betDie}){
	let {loggedInId} = useLoggedInId();
	let navigate = useNavigate();
	let [count, setCount] = useState(betCount);
	let [die, setDie] = useState(betDie);
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
	function increaseDie(){
		setDie(Math.min(die+1, 6));
	}
	function decreaseDie(){
		if(die-1<=betDie){
			setCount(Math.max(count, betCount))
		}
		setDie(Math.max(die-1, 1));
	}
	function increaseCount(){
		setCount(count+1);
	}
	function decreaseCount(){
		setCount(Math.max(count-1, 1));
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
				<button className="incrBetCount betButtonWidth" onClick={increaseCount} disabled={currentPlayer!==loggedInId}>/\</button>
				<div className="betSpacer"></div>
				<button className="incrBetDie betButtonWidth" onClick={increaseDie} disabled={currentPlayer!==loggedInId || die>=6}>/\</button>
				<br/>
				<div className="betContainer">
					<p className="betCount betButtonWidth">{count}</p>
					<div className="betSpacer">x</div>
					<img src={"/dice/"+die+".png"} className="betDie betButtonWidth" alt="Bet Dice Size"/>
				</div>
				<button className="decrBetCount betButtonWidth" onClick={decreaseCount} disabled={currentPlayer!==loggedInId || (count<=betCount&&die<=betDie) || count<=1}>\/</button>
				<div className="betSpacer"></div>
				<button className="decrBetDie betButtonWidth" onClick={decreaseDie} disabled={currentPlayer!==loggedInId || die<=betDie || die<=1}>\/</button>
				<br/>
			</div>
			<div className="RoundEndButtonHolder">
				<button disabled={currentPlayer!==loggedInId}>Challenge previous bet</button>
				<button disabled={currentPlayer!==loggedInId}>Place new bet</button>
				<button onClick={leaveGame}>Forfeit</button>
			</div>
		</div>
	)
}

export default GameScreen;