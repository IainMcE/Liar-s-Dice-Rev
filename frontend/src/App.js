import './App.css';
import {BrowserRouter as Router, Route, Link, Routes, useLocation} from 'react-router-dom';
import GameScreen from './GameScreen.js';
import GameList from './GameList.js';
import PlayerProfile, {MiniProfile} from './PlayerProfile.js'
import Login, {MiniLogin} from './Login.js'
import SignUp from './SignUp.js'
import { useState } from 'react';

function hideUserIconPopUp(){
	let elStyle = document.querySelector(".UserIconPopUp").style
	elStyle.visibility = "hidden";
}

function App() {
	const [isLoggedIn, setLoggedIn] = useState(false);

	return (
		<div className="App" onClick={hideUserIconPopUp}>
			<Router>
				<nav className="NavHeader">
					<Link to="/GameList">Active Games</Link>
					<UserIcon/>
				</nav>
				<div className="MainDisplay">
					<Routes>
						<Route path="/" element={<Missing/>}/>
						<Route path="/GameList" element={<GameList/>}/>
						<Route path="/Login" element={<Login/>}/>
						<Route path="/SignUp" element={<SignUp/>}/>
						<Route path="/GameScreen" element={<GameScreen/>}/>
						<Route path="/User" element={<PlayerProfile/>}/>
					</Routes>
				</div>
				{/* create game button, link to game screen, pos bottom right? 
				conditional visibility? ie not visible on game screen or login/sign up?
				also onclick if logged in go to create, else bring up login/sign up*/}
				<div className="UserIconPopUp">
					<UserIconPopUp isLoggedIn={isLoggedIn}/>
				</div>
			</Router>
		</div>
	);
}

function Missing(){		//replace with a homepage
	return(
		<h2>Page Not Found</h2>
	)
}

function UserIcon(){
	const location = useLocation();
	const path = location.pathname;
	function displayUserIconPopUp(x, y, alignmentX, alignmentY){
		let elStyle = document.querySelector(".UserIconPopUp").style
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
			<img className="profilePicture" 
				onClick={(event)=>{displayUserIconPopUp("0.5vh", "5vh", "right", "top"); event.stopPropagation()}}
			/>
		)
	}else{
		return <div></div>
	}
}

const UserIconPopUp = ({isLoggedIn})=>{
	let result;
	if(!isLoggedIn){
		result = <MiniLogin/>
	}else{
		result = <MiniProfile/>
	}
	return(
		<div className="miniIcon" onClick={(event)=>{event.stopPropagation()}}>
			{result}
		</div>
	)
}

export default App;
export {hideUserIconPopUp};