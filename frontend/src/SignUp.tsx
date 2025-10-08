import './SignUp.css';
import {useNavigate} from 'react-router-dom';
import { useState, createContext, useContext, type ReactNode } from 'react';
import { useLoggedInId } from './App';
import axios from 'axios';

const SignUpErrorContext = createContext<SignUpErrorContextType>({signUpError:"", setSignUpError:()=>{}});

interface SignUpErrorContextType{
	signUpError: string;
	setSignUpError: React.Dispatch<React.SetStateAction<string>>;
}

const useSignUpError = () => useContext(SignUpErrorContext);

interface SignUpErrorProviderProps{
	children: ReactNode;
}

function SignUpErrorProvider({ children }: SignUpErrorProviderProps) {
	const [signUpError, setSignUpError] = useState("");
	return(
		<SignUpErrorContext.Provider value={{signUpError, setSignUpError}}>
			{children}
		</SignUpErrorContext.Provider>
	);
}

function SignUp(){
	const navigate = useNavigate();
	let {loggedInId} = useLoggedInId();
	if(loggedInId>=0){
		navigate(`/User/${loggedInId}`);
	}
	function ToLogin(){
		navigate("/Login");
	}
	return(
		<div className="centering">
			<header className="SignUpHeader">Sign Up</header>
			<SignUpErrorProvider>
				<SignUpForm/>
			</SignUpErrorProvider>
			<div className="loginSpacer">
				<button onClick={ToLogin}>Log In</button>
			</div>
		</div>
	)
}

function SignUpForm(){
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();
	let {setSignUpError} = useSignUpError();
	let {setLoggedInId} = useLoggedInId();

	function KeyHandle(e: React.KeyboardEvent<HTMLFormElement>){
		if(e.key === "Enter"){
			e.preventDefault();
			let el = document.querySelector('.SignUpForm input[type="submit"]') as HTMLElement
			el.click();
		}
	}

	function HandleSignUp(e: React.FormEvent<HTMLFormElement>){
		e.preventDefault();
		//get username
		let user = document.querySelector("#signUpUsername") as HTMLInputElement
		let usernameInput = user.value;
		//get password
		let pass = document.querySelector("#signUpPassword") as HTMLInputElement
		let passwordInput = pass.value;
		let passCheck = document.querySelector("#repeatPassword") as HTMLInputElement
		let passwordCheck = passCheck.value;
		if(passwordInput !== passwordCheck){
			setSignUpError("Passwords must match");
			return;
		}
		if(passwordInput.length === 0){
			setSignUpError("Password fields are empty");
			return;
		}
		if(usernameInput.length < 4){
			setSignUpError("Username must be at least 4 characters");
			return;
		}
		axios.post('http://localhost:8080/SignUp', {
			username:usernameInput,
			password:passwordInput
		}).then((response)=>{
			if(response.status === 200){
				setSignUpError("");
				let userId = response.data.accountId;
				setLoggedInId(userId);
				navigate(`/User/${userId}`);
			}
		}).catch((error)=>{
			if(error.status===400){
				setSignUpError(error.data);
			}else if(error.status===401){
				setSignUpError("Username is already taken");
			}else{
				console.error("Unexpected response code: "+error);
			}
		})
	}

	return(
		<form className="SignUpForm" onSubmit={HandleSignUp} onKeyDown={KeyHandle}>
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
			<SignUpError/>
			<input type="submit"/>
		</form>
	)
}

function SignUpError(){
	let {signUpError} = useSignUpError();
	if(signUpError === null){
		return <div className="errorText"></div>;
	}
	return(
		<div className="errorText">{signUpError}</div>
	)
}

export default SignUp;