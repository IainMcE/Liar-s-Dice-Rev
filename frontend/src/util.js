function SwitchPasswordVisibility(){
	function swapVis(event){
		event.preventDefault();
		let passwords = document.querySelectorAll(".password");
		for(let pw of passwords){
			pw.type = pw.type==="password"?"text":"password";
		}
	}
	return(
		<button onClick={swapVis}>Show Password</button>
	)
}

export {SwitchPasswordVisibility}