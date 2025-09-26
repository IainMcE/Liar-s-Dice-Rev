import './Login.css'
import {useNavigate} from 'react-router-dom';
import {SwitchPasswordVisibility} from './util.js';
import {hideUserIconPopUp} from './App.js';

function LoginForm(){
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
					<input type="password" id="password" name="password" placeholder="Password" className="password"/>
					<SwitchPasswordVisibility/>
				</div>
				<input type="submit"/>
			</form>
			<ToSignUpButton/>
		</div>
	)
}

//have a mini login element to be displayed over other pages?
function MiniLogin(){
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
					<input type="password" id="password" name="password" placeholder="Password" className="password"/>
					<SwitchPasswordVisibility/>
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