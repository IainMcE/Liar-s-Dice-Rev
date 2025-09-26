import './SignUp.css';
import {useNavigate} from 'react-router-dom';
import {SwitchPasswordVisibility} from './util.js';

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
					<input type="password" id="signUpPassword" name="password" placeholder="Password"/>
					<input type="password" id="repeatPassword" name="repeatPassword" placeholder="Repeat Password"/>
				</div>
				<div>
					<SwitchPasswordVisibility/>
				</div>
			</div>
			<input type="submit"/>
		</form>
	)
}

export default SignUp;