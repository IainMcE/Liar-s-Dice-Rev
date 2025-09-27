import './MiniUser.css';
import { createContext, useContext, useState } from 'react';
import { MiniProfile } from './PlayerProfile';

const DisplayUserContext = createContext();

export const useDisplayUser = () => useContext(DisplayUserContext);

export function DisplayUserProvider({ children }) {
	const [id, setId] = useState(0);
	return(
		<DisplayUserContext.Provider value={{ id, setId }}>
			{children}
		</DisplayUserContext.Provider>
	);
}

function MiniUser(){
	const {id} = useContext(DisplayUserContext);
	return(
		<div className="MiniUserDisplay" onClick={(event)=>{event.stopPropagation()}}>
			<MiniProfile userId={id}/>
		</div>
	)
}

function DisplayMiniUser(event, alignmentX, alignmentY){
	event.stopPropagation();
	let elStyle = document.querySelector(".MiniUserDisplay").style
	let bRect = event.target.getBoundingClientRect();
	if(alignmentX === "left"){
		elStyle.left = bRect.right+"px";
		elStyle.right = "";
	}else{
		elStyle.right = bRect.left+"px";
		elStyle.left = "";
	}
	if(alignmentY === "top"){
		elStyle.top = bRect.bottom+"px";
		elStyle.bottom = "";
	}else{
		elStyle.bottom = bRect.top+"px";
		elStyle.top = "";
	}
	elStyle.visibility = "visible";
	return null;
}

function hideMiniUser(){
	let elStyle = document.querySelector(".MiniUserDisplay").style;
	elStyle.visibility = "hidden";
}

export {MiniUser, hideMiniUser, DisplayMiniUser};