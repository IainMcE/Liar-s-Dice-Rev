import './GameScreen.css'
import {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom';
import { useLoggedInId } from './App';

//requires integration with backend for game info (players, dice left/player)

const startingDice = 6;

function GameScreen() {//replace with ids and dice left
	let {gameId} = useParams();
	gameId = parseInt(gameId);
	const [players, setPlayers] = useState([]);
	useEffect(()=>{
		fetch(`http://localhost:8080/Game/${gameId}/Players`)
			.then(response=>response.json())
			.then(data => setPlayers(data))
			.catch(error => console.error('Error fetching data: ', error))
	}, [gameId]);
	rollDice(startingDice);
	return (
	<div className="GameScreen">
		<div className="CurrentPlayers">
		{players.map((player)=>{
			return <PlayerDiceInfo playerId={player.playerId} diceCount={player.diceCount}/>
		})}
		</div>
		<hr/>
		{PreviousBet()}
		<CallUI/>
		<PlayersDice/>
	</div>
	);
}

function PlayerDiceInfo(input){
	const {loggedInId, setLoggedInId} = useLoggedInId();
	let id = input.playerId;
	let diceLeft = input.diceCount;
	const [playerData, setPlayerData] = useState(null);
	id = parseInt(id);
	useEffect(()=>{
		fetch('http://localhost:8080/User/'+id)
			.then(response=>response.json())
			.then(data => setPlayerData(data))
			.catch(error => console.error('Error fetching data: ', error))
	}, [id]);
	return (
		<div className="PlayerInfoContainer">
			<header className="pInfoHeader">
				{id===loggedInId?"You":(playerData?.username??"Loading...")}
			</header>
			<div>Dice in play:</div>
			<img className="DiceLeft" src={"/dice/"+diceLeft+".png"} alt=""></img>
			<div className="LostDice">Lost dice: {startingDice-diceLeft}</div>
		</div>
	);
}

function PreviousBet(count = 0, size = 0){
	let displayText = count === 0 || size === 0;//both should be >1 if a valid guess was made
	if(displayText){
		return (
			<div className="prevCall">
				Make the first call to start the round
			</div>
		)
	}else{
		return(
			<div className="prevCall">
				Previous call was: {count} {size}s
			</div>
		)
	}		
}

let dice = [];

function PlayersDice(){
	let blocks = [];
	for(let i = 0; i<dice.length; i++){
		blocks.push(playerDie(dice[i]));
	}
	return(
		<div className="YourDice">
			<header className="ShowDice">
				Your Dice:
			</header>
			{blocks}
		</div>
	)
}

function rollDice(n){
	let result = [];
	for(let i = 0; i<n; i++){
		result.push(Math.floor(Math.random()*6)+1);
	}
	dice = result;
}

function playerDie(roll){
	return(
		<img className="playerDice" src={"/dice/"+roll+".png"} alt=""></img>
	)
}

function CallUI(){
	return(
		<div className="Call">
			<header>Place your call:</header>
			<div className="CallChangeButtons">
				<button className="incrCallCount callButtonWidth">/\</button><button className="incrCallSize callButtonWidth">/\</button><br/>
				<input value="1" className="callCount callButtonWidth"/><input value="1" className="callSize callButtonWidth"/><br/>
				<button  className="decrCallCount callButtonWidth">\/</button><button className="decrCallSize callButtonWidth">\/</button><br/>
			</div>
			<div className="RoundEndButtonHolder">
				<button>Challenge previous call</button>
				<button>Place new call</button>
				<button>Forfeit</button>
			</div>
		</div>
	)
}

export default GameScreen;