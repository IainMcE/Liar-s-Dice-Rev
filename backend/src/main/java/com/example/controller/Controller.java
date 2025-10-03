package com.example.controller;

import java.util.List;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;

import com.example.service.AccountService;
import com.example.entity.Account;
import com.example.service.GameService;
import com.example.entity.Game;
import com.example.enums.GameState;
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

	@PostMapping("/Game/Create")
	public ResponseEntity<Game> createGame(@RequestBody Game game){
		game = new Game(game.getHost());
		game = gameService.createGame(game);
		gamePlayerService.addGamePlayer(game.getGameId(), game.getHost());
		return ResponseEntity.status(200).body(game);
	}

	@PostMapping("/Game/Visibility")
	public ResponseEntity<Game> setGameVisibility(@RequestBody Game game){
		Game fullGame = gameService.getGameById(game.getGameId());
		return ResponseEntity.status(200).body(gameService.setVisibility(fullGame, game.getVisibility()));
	}

	@PostMapping("/Game/Join")
	public ResponseEntity<Game> joinGame(@RequestBody List<Integer> ids){
		Integer gameId = ids.get(0);
		Integer playerId = ids.get(1);
		if(gameId == null || playerId == null){
			return ResponseEntity.status(400).body(null);
		}
		Game game = gameService.getGameById(gameId);
		if(game.getGameState() != GameState.ENDED){
			if(gamePlayerService.getEntityByGameAndUser(gameId, playerId)==null){
				GamePlayer player = gamePlayerService.addGamePlayer(gameId, playerId);
			}
		}
		return ResponseEntity.status(200).body(game);
	}

	@PostMapping("/Game/Leave")
	public ResponseEntity<Void> leaveGame(@RequestBody GamePlayer gamePlayer){
		int gameId = gamePlayer.getGameId();
		GamePlayer toRemove = gamePlayerService.getEntityByGameAndUser(gameId, gamePlayer.getPlayerId());
		if(toRemove != null){
			gamePlayerService.removeGamePlayer(toRemove);
		}
		List<GamePlayer> players = gamePlayerService.getPlayersByGameId(gameId);
		if(players.size() == 0){
			gameService.deleteGame(gameService.getGameById(gameId));
		}else{
			Game theGame = gameService.getGameById(gameId);
			gameService.setHost(theGame, players.get(0).getPlayerId());
		}
		return ResponseEntity.status(200).body(null);
	}

	@PostMapping("/Game/Start")
	public ResponseEntity<Game> startGame(@RequestBody Game game){
		game = gameService.getGameById(game.getGameId());
		System.out.println(game);
		if(game == null){
			return ResponseEntity.status(400).body(null);
		}
		if(game.getGameState() == GameState.CREATING){
			gameService.setState(game, GameState.PLAYING);
			return ResponseEntity.status(200).body(gameService.saveGame(game));
		}
		return ResponseEntity.status(204).body(null);
	}
}