package com.example.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;

import com.example.service.AccountService;
import com.example.entity.Account;
import com.example.service.GameService;
import com.example.entity.Game;
import com.example.service.GamePlayerService;
import com.example.entity.GamePlayer;
import com.example.service.FriendService;
import com.example.entity.Friend;
import com.example.enums.FriendStatus;


@RestController
public class Controller{
	@Autowired
	AccountService accountService;
	@Autowired
	GameService gameService;
	@Autowired
	GamePlayerService gamePlayerService;
	@Autowired
	FriendService friendService;

	@PostMapping("/SignUp")
	public ResponseEntity<Account> createAccount(@RequestBody Account newAcc){
		if(newAcc.getUsername().length()<4 || newAcc.getPassword().length()==0){
			return ResponseEntity.status(400).body(null);
		}

		if(accountService.hasAccountWithUsername(newAcc.getUsername())){
			return ResponseEntity.status(401).body(null);
		}
		
		return ResponseEntity.status(200).body(accountService.addAccount(newAcc));
	}

	@PostMapping("/Login")
    public ResponseEntity<Account> verifyLogin(@RequestBody Account loggingIn){
        Account result = accountService.validateAccountPassword(loggingIn);
        if(result != null){
            return ResponseEntity.status(200).body(result);
        }else{
            return ResponseEntity.status(401).body(null);
        }
    }

	@GetMapping("/User/{accountId}")
    public ResponseEntity<Account> getAccount(@PathVariable("accountId") int accountId){
        if(accountService.hasAccountWithId(accountId)){
            return ResponseEntity.status(200).body(accountService.getDisplayAccountById(accountId));
        }
        return ResponseEntity.status(204).body(null);
    }


	//get mapping /users/accountId/gameHistory | history

	@GetMapping("/GameList")
	public ResponseEntity<List<Integer>> getGameIds(){
		return ResponseEntity.status(200).body(gameService.getGameIds());
	}

	@GetMapping("/Game/{gameId}")
	public ResponseEntity<Game> getGame(@PathVariable("gameId") int gameId){
		if(gameService.hasGameWithId(gameId)){
			return ResponseEntity.status(200).body(gameService.getGameById(gameId));
		}
		return ResponseEntity.status(204).body(null);
	}

	@GetMapping("/Game/{gameId}/Players")
	public ResponseEntity<List<GamePlayer>> getPlayers(
		@PathVariable("gameId") int gameId
	){
		return ResponseEntity.status(200).body(gamePlayerService.getPlayersByGameId(gameId));
	}

	@GetMapping({"/User/{userId}/Friends", "/Friends/{userId}"})
	public ResponseEntity<List<Friend>> getFriends(
		@PathVariable("userId") int userId
	){
		return ResponseEntity.status(200).body(friendService.friendList(userId));
	}

	@GetMapping("/Friends/{userId}/{user2}")
	public ResponseEntity<Friend> friendStatus(
		@PathVariable("userId") int userId,
		@PathVariable("user2") int user2
	){
		if(userId != user2){
			Friend result = friendService.friendStatus(userId, user2);
			if(result != null){
				return ResponseEntity.status(200).body(result);
			}
		}
		return ResponseEntity.status(204).body(null);
	}

	@PostMapping("/Friends/Initiate")
	public ResponseEntity<Friend> requestFriend(@RequestBody Friend friend){
		if(friendService.friendStatus(friend.getUserId1(), friend.getUserId2()) != null){
			return ResponseEntity.status(204).body(null);
		}
		return ResponseEntity.status(200).body(friendService.addFriend(friend));
	}

	@PostMapping("/Friends/Accept")
	public ResponseEntity<Friend> acceptFriend(@RequestBody Friend friend){
		Friend currentFriend = friendService.friendStatus(friend.getUserId1(), friend.getUserId2());
		if(currentFriend == null || currentFriend.getStatus() != FriendStatus.PENDING){
			return ResponseEntity.status(204).body(null);
		}
		return ResponseEntity.status(200).body(friendService.acceptFriend(currentFriend));
	}

	@PostMapping("/Friends/Remove")
	public ResponseEntity<Friend> removeFriend(@RequestBody Friend friend){
		Friend currentFriend = friendService.friendStatus(friend.getUserId1(), friend.getUserId2());
		if(currentFriend == null){
			return ResponseEntity.status(204).body(null);
		}
		friendService.removeFriend(currentFriend);
		return ResponseEntity.status(200).body(null);
	}
}