import './PlayerProfile.css'
import { useParams } from 'react-router-dom';
import {Link} from 'react-router-dom';

function PlayerProfile(){//get id, passed in? from url?
	let {id} = useParams();
	id = parseInt(id);
	//playerData = fetch full display info by id
	let playerData = {username:"Frank", wins:5, losses:5}
	if(id===1){
		playerData = {username:"Jerry (from Seinfeld)", wins:2, losses:4}
	}
	return(
		<div className="userProfile">
			<header className="username">{playerData.username}</header>
			<div className="GameStats">Win rate: {playerData.wins/(playerData.wins+playerData.losses)*100}%</div>
			<div className="addFriend" title="If the profile is not the logged in user">
				<button title="Show add or remove based on the">Add/Remove Friend</button>
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
		for(let user of list){
			result.push(friendListRow(user));
		}
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
	let playerData = {username:"Frank"}
	if(userId===1){
		playerData = {username:"Jerry (from Seinfeld)"}
	}
	return(
		<div className="miniUserProfile">
			<Link to={"/User/"+userId} className="miniUsername">{playerData.username}</Link>
			<div className="miniAddFriend" title="If the profile is not the logged in user">
				<button title="Show add or remove based on the">Add/Remove Friend</button>
			</div>
			{/* some navigation to the full profile (id) */}
		</div>
	)
}

export {MiniProfile};
export default PlayerProfile;