import { useEffect, useState } from 'react';
import './PlayerProfile.css'
import { useParams } from 'react-router-dom';
import {Link} from 'react-router-dom';
import { useLoggedInId, type User, type FriendData } from './App';
import axios from 'axios';

function PlayerProfile(){
	const [playerData, setPlayerData] = useState<User|null>(null);
	let {id: idString} = useParams();
	let id = idString?parseInt(idString):NaN;
	useEffect(()=>{
		fetch('http://localhost:8080/User/'+id)
			.then(response=>response.json())
			.then(data => setPlayerData(data))
			.catch(error => console.error('Error fetching data: ', error))
	}, [id]);
	return(
		<div className="userProfile">
			<header className="username">{playerData?.username??"Loading..."}</header>
			<div className="GameStats">Win rate: {playerData!=null?(playerData?.wins/(playerData?.wins+playerData?.losses)*100):0}%</div>
			<div className="addFriend">
				<AddFriendButton userId={id}/>
			</div>
			<div className="FriendListHolder">
				<header className="FriendListHeader">Friends</header>
				<hr/>
				<div className="FriendList">
					<DisplayFriendList userId={id}/>
				</div>
			</div>
		</div>
	)
}

function DisplayFriendList({userId}: {userId: number}){
	const {loggedInId} = useLoggedInId();
	const [friendData, setFriendData] = useState<FriendData[]>([]);
	useEffect(()=>{
		fetch('http://localhost:8080/Friends/'+userId)
			.then(response=>response.json())
			.then(data => setFriendData(data))
			.catch(error => console.error('Error fetching data: ', error))
	}, [userId]);
	if(loggedInId<0){
		return(
			<div className="FriendRow">Log in to see a users friends</div>
		)
	}else if(friendData.length===0){
		return(
			<div className="FriendRow">Play some games, make some friends</div>
		)
	}else{
		let confirmed = friendData.filter(f=>f.status==="CONFIRMED")
		let result = confirmed.map((f)=>{
			let friendId = f.userId1 === userId?f.userId2:f.userId1;
			return <FriendListRow key={friendId.toString()} friendId={friendId}/>;
		})
		if(loggedInId !== userId){
			return(<div>
				{result}
			</div>)
		}else{
			let pendingOut = friendData.filter(f=>f.status==="PENDING"&&f.userId1===userId)
			let resultPendingOut = pendingOut.map((f)=>{
				let friendId = f.userId2;
				return <FriendListRow key={friendId.toString()} friendId={friendId}/>;
			})
			let pendingIn = friendData.filter(f=>f.status==="PENDING"&&f.userId2===userId)
			let resultPendingIn = pendingIn.map((f)=>{
				let friendId = f.userId1;
				return <FriendListRow key={friendId.toString()} friendId={friendId}/>;
			})
			return(
				<div>
					{result}
					{resultPendingIn.length>0?<h4>Friend Requests:</h4>:null}
					{resultPendingIn}
					{resultPendingOut.length>0?<h4>Pending Response:</h4>:null}
					{resultPendingOut}
				</div>
			)
		}
		
	}
}

function FriendListRow({friendId}: {friendId: number}){
	const [playerData, setPlayerData] = useState<User|null>(null);
	useEffect(()=>{
		fetch('http://localhost:8080/User/'+friendId)
			.then(response=>response.json())
			.then(data => setPlayerData(data))
			.catch(error => console.error('Error fetching data: ', error))
	}, [friendId]);
	return(
		<Link className="FriendRow" to={"/User/"+friendId}>{playerData?.username??"Loading..."}</Link>
	)
}

function MiniProfile({userId}: {userId: number}){
	//playerData = fetch short display info by id
	console.log(userId)
	const [playerData, setPlayerData] = useState<User|null>(null);
	useEffect(()=>{
		fetch('http://localhost:8080/User/'+userId)
			.then(response=>{
				if(response.status === 204 || parseInt(response.headers.get("Content-Length")??"0")=== 0){
					return null;
				}
				return response.json();
			})
			.then(data => {console.log(data);setPlayerData(data)})
			.catch(error => console.error(userId, 'Error fetching data: ', error))
	}, [userId]);
	return(
		<div className="miniUserProfile">
			<Link to={"/User/"+userId} className="miniUsername">{playerData?.username??playerData+""}</Link>
			<div className="miniAddFriend">
				<AddFriendButton userId={userId}/>
			</div>
		</div>
	)
}

function AddFriendButton({userId}: {userId: number}){
	const {loggedInId} = useLoggedInId();
	const [friendship, setFriendship] = useState<FriendData|null>(null);
	useEffect(()=>{
		fetch(`http://localhost:8080/Friends/${loggedInId}/${userId}`)
			.then(response=>{
				if(response.status === 204 || parseInt(response.headers.get("Content-Length")??"0")===0){
					return null;
				}
				return response.json();
			})
			.then(data => setFriendship(data))
			.catch(error => console.error('Error fetching data: ', error))
	}, [loggedInId, userId]);

	function AddFriendPressed(){
		let friend = {userId1: loggedInId, userId2: userId}
		let post = 'http://localhost:8080/Friends/'
		if(friendship===null){
			post+='Initiate';
		}else if(friendship.status==="CONFIRMED"){
			post+='Remove';
		}else if(friendship.status==="PENDING"){
			if(friendship.userId1 === loggedInId){
				post += 'Remove';
			}else{
				post += 'Accept';
			}
		}
		axios.post(post, friend).then((response)=>{
			if(response.status === 200){
				if((typeof(response.data)==="string" && response.data.length > 0)
					|| typeof(response.data)==="object"){
					setFriendship(response.data);
				}else{
					setFriendship(null);
				}
			}
		}).catch((error)=>{console.error(error)});
	}

	if(loggedInId<0 || loggedInId === userId){
		return(null)
	}
	if(friendship === null){
		return(<button onClick={AddFriendPressed}>Add Friend</button>)
	}
	if(friendship.status === "CONFIRMED"){
		return(<button onClick={AddFriendPressed}>Remove Friend</button>)
	}
	if(friendship.userId1 === loggedInId){
		return(<button onClick={AddFriendPressed}>Cancel Request</button>)
	}
	return(<button onClick={AddFriendPressed}>Accept Request</button>)
}

export {MiniProfile};
export default PlayerProfile;