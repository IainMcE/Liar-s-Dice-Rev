import './App.css';
import {BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';
// import GameScreen from './GameScreen.js';
import GameList from './GameList.js';
// import PlayerProfile from './PlayerProfile.js'
import Login from './Login.js'
import SignUp from './SignUp.js'

function App() {
	return (
		<Router>
			<nav className="NavHeader">
				<Link to="/GameList">Active Games</Link>
				<Link to="/Login">Log In</Link>
				<Link to="/SignUp">Sign Up</Link>
			</nav>
			<div className="MainDisplay">
				<Routes>
					<Route path="/"element={<Missing/>}/>
					<Route path="/GameList"element={<GameList/>}/>
					<Route path="/Login"element={<Login/>}/>
					<Route path="/SignUp"element={<SignUp/>}/>
				</Routes>
			</div>
			{/* {GameScreen(4)} */}
			{/* <PlayerProfile/> */}
		</Router>
	);
}

function Missing(){
	return(
		<h2>Page Not Found</h2>
	)
}

export default App;
