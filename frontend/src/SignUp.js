import './SignUp.css';
import {useNavigate} from 'react-router-dom';
import { useState } from 'react';

function SignUp(){
	const navigate = useNavigate();
	function ToLogin(){
		navigate("/Login");
	}
	return(
		<div className="centering">
			<header className="SignUpHeader">Sign Up</header>
			<SignUpForm/>
			<div className="loginSpacer">
				<button title="Lead to log in page" onClick={ToLogin}>Log In</button>
			</div>
		</div>
	)
}

function SignUpForm(){
	const [showPassword, setShowPassword] = useState(false);
	return(
		<form className="SignUpForm">
			<div>
				<div>
					<label htmlFor="signUpUsername">Username:</label>
					<label htmlFor="signUpPassword">Password:</label>
					<label htmlFor="repeatPassword">Repeat Password:</label>
				</div>
				<div>
					<input type="text" id="signUpUsername" name="username" placeholder="Username"/>
					<input type={showPassword?"text":"password"} id="signUpPassword" name="password" placeholder="Password"/>
					<input type={showPassword?"text":"password"} id="repeatPassword" name="repeatPassword" placeholder="Repeat Password"/>
				</div>
				<div>
					<button className="passwordVisibility" onClick={(e)=>{
						e.preventDefault(); setShowPassword(!showPassword)
						}}>{showPassword?"Hide":"Show"} Password</button>
				</div>
			</div>
			<input type="submit"/>
		</form>
	)
}

export default SignUp;