import './Login.css'
import {useNavigate} from 'react-router-dom';

function LoginForm(){
	const navigate = useNavigate();
	function ToSignUp(){
		navigate("/SignUp");
	}
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
					<input type="password" id="password" name="password" placeholder="Password"/>
					<button title="onclick: password input type swaps between 'text' and 'password'">Show Password</button>
				</div>
				<input type="submit"/>
			</form>
			<div className="signUpSpacer">
				<button title="Lead to sign in page" onClick={ToSignUp}>Sign Up</button>
			</div>
		</div>
	)
}

//have a mini login element to be displayed over other pages?

export default LoginForm;