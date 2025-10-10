package com.example.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.context.ApplicationEventPublisher;
import java.util.List;
import java.util.Arrays;
import java.util.ArrayList;
import java.util.Optional;

import com.example.entity.GamePlayer;
import com.example.repository.GamePlayerRepository;
import com.example.entity.Game;
import com.example.controller.ControllerEvent;

@Service
public class GamePlayerService{
	@Autowired
	GamePlayerRepository gamePlayerRepository;
	@Autowired
	AccountService accountService;
	@Autowired
	ApplicationEventPublisher eventPublisher;
	
	public List<GamePlayer> getPlayersByGameId(int gameId){
		return gamePlayerRepository.findByGameId(gameId);
	}

	public GamePlayer addGamePlayer(int gameId, int playerId){
		return gamePlayerRepository.save(new GamePlayer(gameId, playerId));
	}

	public GamePlayer saveGamePlayer(GamePlayer gamePlayer){
		gamePlayer = gamePlayerRepository.save(gamePlayer);
		eventPublisher.publishEvent(new ControllerEvent(this, "Player", gamePlayer.getGameId()));
		return gamePlayer;
	}

	public GamePlayer getEntityByGameAndUser(int gameId, int playerId){
		return gamePlayerRepository.findByGameIdAndAccountAccountId(gameId, playerId);
	}

	public void removeGamePlayer(GamePlayer gamePlayer){
		gamePlayerRepository.delete(gamePlayer);
	}

	public List<GamePlayer> setDiceCounts(Game game){
		List<GamePlayer> players = getPlayersByGameId(game.getGameId());
		for(GamePlayer player : players){
			player.setDiceCount(game.getMaxDice());
			saveGamePlayer(player);
		}
		return players;
	}

	public GamePlayer setPlayerRoll(GamePlayer gamePlayer, int index, int roll){
		gamePlayer.setRollByDie(index, roll);
		return gamePlayer;
	}

	public GamePlayer loseDie(GamePlayer gamePlayer){
		gamePlayer.loseDie();
		return saveGamePlayer(gamePlayer);
	}

	public GamePlayer gameEnd(GamePlayer gamePlayer){
		String result = "";
		if(gamePlayer.getDiceCount()>0){
			result = "Won";
		}else{
			result = "Lost"
		}
		gamePlayer.setAccount(accountService.gameEnd(gamePlayer.getAccount(), result));
		//removeGamePlayer(gamePlayer);	//the users leaving will remove the game players (maybe, clean up would be a good idea)
		return saveGamePlayer(gamePlayer);
	}
}