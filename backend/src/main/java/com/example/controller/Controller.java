package com.example.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import com.example.service.AccountService;
import com.example.entity.Account;
import com.example.service.GameService;
import com.example.entity.Game;
import com.example.service.GamePlayerService;
import com.example.entity.GamePlayer;


@RestController
public class Controller{
	@Autowired
	AccountService accountService;
	@Autowired
	GameService gameService;
	@Autowired
	GamePlayerService gamePlayerService;

	@PostMapping("/SignUp")
	public ResponseEntity<Account> createAccount(@RequestBody Account newAcc){
		if(newAcc.getUsername().length()<4 || newAcc.getPassword().length()==0){
			return ResponseEntity.status(400).body(null);
		}

		if(accountService.hasAccountWithUsername(newAcc.getUsername())){
			return ResponseEntity.status(400).body(null);
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
        return ResponseEntity.status(200).body(null);
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
		return ResponseEntity.status(200).body(null);
	}

	@GetMapping("/Game/{gameId}/Players")
	public ResponseEntity<List<GamePlayer>> getPlayers(
		@PathVariable("gameId") int gameId
	){
		return ResponseEntity.status(200).body(gamePlayerService.getPlayersByGameId(gameId));
	}
}