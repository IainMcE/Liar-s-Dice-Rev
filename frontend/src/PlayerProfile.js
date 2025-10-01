import { useEffect, useState } from 'react';
import './PlayerProfile.css'
import { useParams } from 'react-router-dom';
import {Link} from 'react-router-dom';
import { useLoggedInId } from './App';

function PlayerProfile(){
	const [playerData, setPlayerData] = useState(null);
	let {id} = useParams();
	id = parseInt(id);
	useEffect(()=>{
		fetch('http://localhost:8080/User/'+id)
			.then(response=>response.json())
			.then(data => setPlayerData(data))
			.catch(error => console.error('Error fetching data: ', error))
	}, [id]);
	return(
		<div className="userProfile">
			<header className="username">{playerData?.username??"Loading..."}</header>
			<div className="GameStats">Win rate: {playerData!=null?(playerData.wins/(playerData.wins+playerData.losses)*100):0}%</div>
			<div className="addFriend">
				<AddFriendButton userId={id}/>
			</div>
			<div className="FriendListHolder" title="Only if profile is logged in user. Alternatively show mutual friends?">
				<header className="FriendListHeader">Friends</header>
				<hr/>
				<div className="FriendList">
					<DisplayFriendList/>
				</div>
			</div>
		</div>
	)
}

function DisplayFriendList(){
	let list = [];
	let result = []
	if(list.length===0){
		return(
			<div className="FriendRow">Play some games, make some friends</div>
		)
	}else{
		list.map((user)=>{
			result.push(friendListRow(user));
		})
		return(
			{result}
		)
	}
}

function friendListRow(user){//is it id? is it string?
	return(
		<div className="FriendRow" title="onclick visit profile, on hover view profile snippet">{user}</div>
	)
}

function MiniProfile(userId){
	//playerData = fetch short display info by id
	userId = userId.userId;	//why does it do this?
	const [playerData, setPlayerData] = useState(null);
	useEffect(()=>{
		fetch('http://localhost:8080/User/'+userId)
			.then(response=>response.json())
			.then(data => setPlayerData(data))
			.catch(error => console.error('Error fetching data: ', error))
	}, [userId]);
	return(
		<div className="miniUserProfile">
			<Link to={"/User/"+userId} className="miniUsername">{playerData?.username??"Loading..."}</Link>
			<div className="miniAddFriend">
				<AddFriendButton userId={userId}/>
			</div>
		</div>
	)
}

function AddFriendButton(input){
	const {loggedInId, setLoggedInId} = useLoggedInId();
	let userId = input.userId;
	if(userId === loggedInId){
		return(null)
	}else{
		//if(userId is in friend list)
		return(<button>Add/Remove Friend</button>)
	}
}

export {MiniProfile};
export default PlayerProfile;