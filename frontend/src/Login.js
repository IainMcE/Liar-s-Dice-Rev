import './Login.css'
import {useNavigate} from 'react-router-dom';
import { useState, useContext, createContext } from 'react';
import {hideUserIconPopUp, useLoggedInId} from './App.js';
import axios from 'axios';

const LoginErrorContext = createContext();

const useLoginError = () => useContext(LoginErrorContext);

function LoginErrorProvider({ children }) {
	const [loginError, setLoginError] = useState(null);
	return(
		<LoginErrorContext.Provider value={{loginError, setLoginError}}>
			{children}
		</LoginErrorContext.Provider>
	);
}

function LoginPage(){
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();
	let {loggedInId} = useLoggedInId();
	if(loggedInId>=0){
		navigate(`/User/${loggedInId}`);
	}
	return(
		<LoginErrorProvider>
			<div className="centering">
				<header className="LoginHeader">Log In</header>
				<LoginForm>
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
				</LoginForm>
				<ToSignUpButton/>
			</div>
		</LoginErrorProvider>
	)
}

//have a mini login element to be displayed over other pages?
function MiniLogin(){
	const [showPassword, setShowPassword] = useState(false);	//this should not persist between being shown and hidden
	return(
		<LoginErrorProvider>
			<div className="centering">
				<header className="LoginHeader">Log In</header>
				<LoginForm>
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
				</LoginForm>
				<ToSignUpButton/>
			</div>
		</LoginErrorProvider>
	)
}

function LoginForm({children}){
	const navigate = useNavigate();
	let {setLoginError} = useLoginError();
	let {setLoggedInId} = useLoggedInId();

	function HandleLogin(e){
		e.preventDefault();
		//get username
		let usernameInput = document.querySelector("#username").value;
		//get password
		let passwordInput = document.querySelector("#password").value;
		axios.post('http://localhost:8080/Login', {
			username:usernameInput,
			password:passwordInput
		}).then((response)=>{
			if(response.status === 200){
				setLoginError(null);
				let userId = response.data.accountId;
				setLoggedInId(userId);
				hideUserIconPopUp();
				navigate(`/User/${userId}`);
			}
		}).catch((error)=>{
			if(error.status===401){
				setLoginError("Username or Password is incorrect");
			}else{
				console.error("Unexpected response code: "+error);
			}
		})
	}

	return(
		<form className="LoginForm" onSubmit={HandleLogin}>
			{children}
			<LoginError/>
			<input type="submit"/>
		</form>
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

function LoginError(){
	let {loginError} = useLoginError();
	if(loginError === null){
		return null;
	}
	return(
		<div className="errorText">{loginError}</div>
	)
}

export {MiniLogin}
export default LoginPage;