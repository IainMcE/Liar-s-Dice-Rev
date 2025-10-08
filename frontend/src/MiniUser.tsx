import './MiniUser.css';
import { createContext, useContext, useState, type ReactNode } from 'react';
import { MiniProfile } from './PlayerProfile';

const DisplayUserContext = createContext<DisplayUserContextType>({id:0, setId:()=>{}});

interface DisplayUserContextType{
	id:number;
	setId: React.Dispatch<React.SetStateAction<number>>;
}

export const useDisplayUser = () => useContext(DisplayUserContext);

export function DisplayUserProvider({ children }: DisplayUserContextProviderProps) {
	const [id, setId] = useState(0);
	return(
		<DisplayUserContext.Provider value={{ id, setId }}>
			{children}
		</DisplayUserContext.Provider>
	);
}

interface DisplayUserContextProviderProps{
	children: ReactNode;
}

function MiniUser(){
	const {id} = useContext(DisplayUserContext);
	return(
		<div className="MiniUserDisplay" onClick={(event)=>{event.stopPropagation()}}>
			<MiniProfile userId={id}/>
		</div>
	)
}

function DisplayMiniUser(event: React.MouseEvent<HTMLDivElement, MouseEvent>, alignmentX: string, alignmentY: string){
	event.stopPropagation();
	let el = document.querySelector(".MiniUserDisplay") as HTMLElement;
	let elStyle = el.style
	let clicked = event.target as Element;
	if(clicked === null){
		return;
	}
	let bRect = clicked.getBoundingClientRect();
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
	let el = document.querySelector(".MiniUserDisplay") as HTMLElement;
	el.style.visibility = "hidden";
}

export {MiniUser, hideMiniUser, DisplayMiniUser};