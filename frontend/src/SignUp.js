import './SignUp.css'

function SignUpForm(){
	return(
		<div className="centering">
			<header className="SignUpHeader">Sign Up</header>
			<form className="SignUpForm">
				<div>
					<div>
						<label htmlFor="username">Username:</label>
						<label htmlFor="password">Password:</label>
						<label htmlFor="repeatPassword">Repeat Password:</label>
					</div>
					<div>
						<input type="text" id="username" name="username" placeholder="Username"/>
						<input type="password" id="password" name="password" placeholder="Password"/>
						<input type="password" id="repeatPassword" name="repeatPassword" placeholder="Repeat Password"/>
					</div>
					<div>
						<button title="onclick: password and repeat input type swaps between 'text' and 'password'">Show Password</button>
					</div>
				</div>
				<input type="submit"/>
			</form>
			<div className="loginSpacer">
				<button title="Lead to log in page">Log In</button>
			</div>
		</div>
	)
}

//have a mini login element to be displayed over other pages?

export default SignUpForm;