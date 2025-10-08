import './Login.css'
import {useNavigate} from 'react-router-dom';
import { useState, useContext, createContext, type ReactNode} from 'react';
import {hideUserIconPopUp, useLoggedInId} from './App';
import axios from 'axios';

const LoginErrorContext = createContext<LogInErrorContextType>({loginError:"", setLoginError:()=>{}});

interface LogInErrorContextType{
	loginError: string;
	setLoginError: React.Dispatch<React.SetStateAction<string>>;
}

const useLoginError = () => useContext(LoginErrorContext);

interface LogInErrorProviderProps{
	children: ReactNode;
}

function LoginErrorProvider({ children }: LogInErrorProviderProps) {
	const [loginError, setLoginError] = useState("");
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

function LoginForm({children}: {children: ReactNode}){
	const navigate = useNavigate();
	let {setLoginError} = useLoginError();
	let {setLoggedInId} = useLoggedInId();

	function KeyHandle(event: React.KeyboardEvent<HTMLFormElement>){
		if(event.key === "Enter"){
			event.preventDefault();
			let el = document.querySelector('.LoginForm input[type="submit"]') as HTMLElement
			el.click();
		}
	}

	function HandleLogin(event: React.FormEvent<HTMLFormElement>){
		event.preventDefault();
		//get username
		let user = document.querySelector("#username") as HTMLInputElement
		let usernameInput = user.value;
		//get password
		let pass = document.querySelector("#password") as HTMLInputElement
		let passwordInput = pass.value;
		axios.post('http://localhost:8080/Login', {
			username:usernameInput,
			password:passwordInput
		}).then((response)=>{
			if(response.status === 200){
				setLoginError("");
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
		<form className="LoginForm" onSubmit={HandleLogin} onKeyDown={KeyHandle}>
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
			<button onClick={ToSignUp}>Sign Up</button>
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