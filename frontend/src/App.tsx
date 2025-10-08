import './App.css';
import {BrowserRouter as Router, Route, Link, Routes, useLocation, useNavigate} from 'react-router-dom';
import GameScreen from './GameScreen';
import GameList from './GameList';
import PlayerProfile, {MiniProfile} from './PlayerProfile'
import Login, {MiniLogin} from './Login'
import SignUp from './SignUp'
import { createContext, useContext, useState, type ReactNode } from 'react';
import { DisplayUserProvider } from './MiniUser';
import GameLobby from './GameLobby';
import axios from 'axios';

export type Game = {
	gameId:number;
	host: number;
	visibility: string;
	gameState: string;
	currentPlayer:number;
	previousPlayer:number;
	maxDice:number;
	betCount:number;
	betDie: number;
	loserId:number;
	actualCount:number;
}

export type GamePlayer = {
	playerId: number;
	username: string;
	diceCount:number;
	diceLeft:number;
	die1:number;
	die2:number;
	die3:number;
	die4:number;
	die5:number;
	die6:number;
}

export type User = {
	username:string;
	wins: number;
	losses: number;
}

export type FriendData = {
	userId1: number;
	userId2: number;
	status: string;
}

const LoggedInIdContext = createContext<LoggedInIdContextType>({loggedInId:-1, setLoggedInId:()=>{}});

export const useLoggedInId = () => useContext(LoggedInIdContext);

interface LoggedInIdContextType{
	loggedInId: number;
	setLoggedInId: React.Dispatch<React.SetStateAction<number>>;
}

interface LoggedInIdProviderProps{
	children: ReactNode;
}

export function LoggedInIdProvider({ children }: LoggedInIdProviderProps) {
	const [loggedInId, setLoggedInId] = useState<number>(-1);
	return(
		<LoggedInIdContext.Provider value={{loggedInId, setLoggedInId}}>
			{children}
		</LoggedInIdContext.Provider>
	);
}

function hideUserIconPopUp(){
	let el = document.querySelector(".UserIconPopUp") as HTMLElement;
	if(el==null){
		return;
	}
	el.style.visibility = "hidden";
}

function App() {
	return (
		<div className="App" onClick={hideUserIconPopUp}>
			<LoggedInIdProvider>
			<Router>
				<nav className="NavHeader">
					<Link to="/GameList">Active Games</Link>
					<UserIcon/>
				</nav>
				<div className="MainDisplay">
					<Routes>
						<Route path="/" element={<HomePage/>}/>
						<Route path="/GameList" element={<DisplayUserProvider><GameList/></DisplayUserProvider>}/>
						<Route path="/Login" element={<Login/>}/>
						<Route path="/SignUp" element={<SignUp/>}/>
						<Route path="/GameLobby/:gameId" element={<GameLobby/>}/>
						<Route path="/GameScreen/:gameId" element={<GameScreen/>}/>
						<Route path="/User/:id" element={<PlayerProfile/>}/>
						<Route path="/:param" element={<Missing/>}/>
					</Routes>
				</div>
				<CreateGameButton/>
				<div className="UserIconPopUp">
					<UserIconPopUp/>
				</div>
			</Router>
			</LoggedInIdProvider>
		</div>
	);
}

function Missing(){
	return(
		<h2>Page Not Found</h2>
	)
}

function HomePage(){
	return(
		<div>
			<h2>Liar's Dice</h2>
			<div className='rules'>
				<h3>Rules of the Game</h3>
				Liars Dice is a popular dice game that combines strategy and bluffing. The game is played with dice and can have multiple players. Here are the basic rules:
				<ol>
					<li>Each player starts with a set of dice (typically 5 dice per player).</li>
					<li>Players take turns making bids on the total number of dice showing a specific value (e.g., "Three 4s").</li>
					<li>Players can either raise the bid or challenge the previous bid.</li>
					<ul>
						<li>A player can raise the bid by increasing the number of dice or by increasing the face of the die.</li>
						<li>If a player increases the face of a die, they can bid any number of dice.</li>
					</ul>
					<li>If challenged the bid is checked, and if the number of dice in the bid was equal to or lower than the actual amount, the challenger loses a die. If the number of dice is higher, the player who placed the challenged bid loses a die.</li>
					<li>The game continues until only one player has dice remaining, and that player wins.</li>
				</ol>
			</div>
			<div className='howToUseUI'>
				<h3>How to Play</h3>
				<ol>
					<li>You must log in, or sign up if you don't have an account, to create or play a game of Liar's Dice. Otherwise you may only spectate other games.</li>
					<li>You can create a game by clicking the "+" in the lower right corner, or join an available game by visiting the Game List.</li>
					<li>The host will start the game, but once the game has started you cannot join it even if you once were a player.</li>
					<ul><li>If you navigate away from the game without using the leave or forfeit buttons, you can return to the game from the Game List.</li></ul>
					<li>Once in the game, when it is your turn, you will see the buttons are useable and you can take your turn.</li>
				</ol>
			</div>
		</div>
	)
}

function UserIcon(){
	const location = useLocation();
	const path = location.pathname;
	function displayUserIconPopUp(x: string, y: string, alignmentX: string, alignmentY: string){
		let el = document.querySelector(".UserIconPopUp") as HTMLElement
		let elStyle = el.style
		if(alignmentX === "left"){
			elStyle.left = x;
			elStyle.right = "";
		}else{
			elStyle.right = x;
			elStyle.left = "";
		}
		if(alignmentY === "top"){
			elStyle.top = y;
			elStyle.bottom = "";
		}else{
			elStyle.bottom = y;
			elStyle.top = "";
		}
		elStyle.visibility = "visible";
	}
	if(path !== "/SignUp" && path !== "/Login"){
		return(
			<img className="profilePicture" alt="Your Profile" src="/userProfile.png"
				onClick={(event)=>{displayUserIconPopUp("0.5vh", "5vh", "right", "top"); event.stopPropagation()}}
			/>
		)
	}else{
		return <div></div>
	}
}

const UserIconPopUp = ()=>{
	const {loggedInId} = useLoggedInId();
	let result;
	if(loggedInId < 0){
		result = <MiniLogin/>
	}else{
		result = <MiniProfile userId={loggedInId}/>
	}
	return(
		<div className="miniIcon" onClick={(event)=>{event.stopPropagation()}}>
			{result}
		</div>
	)
}

function CreateGameButton(){
	const location = useLocation();
	const path = location.pathname;
	const {loggedInId} = useLoggedInId();
	let navigate = useNavigate();

	//onclick create game, nav to gamelobby
	function createGame(){
		axios.post('http://localhost:8080/Game/Create', {
			host:loggedInId
		}).then((response)=>{
			if(response.status === 200){
				navigate(`/GameLobby/${response.data.gameId}`);
			}
		}).catch((error)=>{
			console.error(error);
			alert("There was an error creating the game");
		})
	}

	if(loggedInId<0){
		return null;
	}
	let validPaths = [/\/GameList/gm, /\/User\/\d+/gm, /^\/$/]
	let isValid = false
	for(let vPath of validPaths){
		if(vPath.test(path)){
			isValid = true;
		}
	}
	if(isValid){
		return(
			<div className="CreateGameButton" onClick={createGame}>
				+
			</div>
		)
	}
	return null;
}

export default App;
export {hideUserIconPopUp};