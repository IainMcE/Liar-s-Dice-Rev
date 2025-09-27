import './Login.css'
import {useNavigate} from 'react-router-dom';
import { useState } from 'react';
import {hideUserIconPopUp} from './App.js';

function LoginForm(){
	const [showPassword, setShowPassword] = useState(false);
	return(
		<div className="centering">
			<header className="LoginHeader">Log In</header>
			<form className="LoginForm">
				<div>
					<label htmlFor="username">Username:</label>
					<input type="text" id="username" name="username" placeholder="Username"/>
				</div>
				<div>
					<label htmlFor="password">Password:</label>
					<input type={showPassword?"text":"password"} id="password" name="password" placeholder="Password"/>
					<button className="passwordVisibility" onClick={(e)=>{
						e.preventDefault(); setShowPassword(!showPassword)
						}}>{showPassword?"Hide":"Show"} Password</button>
				</div>
				<input type="submit"/>
			</form>
			<ToSignUpButton/>
		</div>
	)
}

//have a mini login element to be displayed over other pages?
function MiniLogin(){
	const [showPassword, setShowPassword] = useState(false);	//this should not persist between being shown and hidden
	return(
		<div className="centering">
			<header className="LoginHeader">Log In</header>
			<form className="LoginForm">
				<div>
					<label htmlFor="username">Username:</label><br/>
					<input type="text" id="username" name="username" placeholder="Username"/>
				</div>
				<div>
					<label htmlFor="password">Password:</label><br/>
					<input type={showPassword?"text":"password"} id="password" name="password" placeholder="Password"/>
					<button className="passwordVisibility" onClick={(e)=>{
						e.preventDefault(); setShowPassword(!showPassword)
						}}>{showPassword?"Hide Password":"Show Password"}</button>
				</div>
				<input type="submit"/>
			</form>
			<ToSignUpButton/>
		</div>
	)
}

function ToSignUpButton(){
	const navigate = useNavigate();
	function ToSignUp(){
		navigate("/SignUp");
		hideUserIconPopUp();
	}
	return(
		<div className="signUpSpacer">
			<button title="Lead to sign in page" onClick={ToSignUp}>Sign Up</button>
		</div>
	)
}

export {MiniLogin}
export default LoginForm;