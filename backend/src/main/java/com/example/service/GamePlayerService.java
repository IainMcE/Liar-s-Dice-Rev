package com.example.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Arrays;
import java.util.ArrayList;
import java.util.Optional;

import com.example.entity.GamePlayer;
import com.example.repository.GamePlayerRepository;

@Service
public class GamePlayerService{
	@Autowired
	GamePlayerRepository gamePlayerRepository;

	public List<GamePlayer> getPlayersByGameId(int gameId){
		return gamePlayerRepository.findByGameId(gameId);
	}

	public GamePlayer addGamePlayer(int gameId, int playerId){
		return gamePlayerRepository.save(new GamePlayer(gameId, playerId));
	}

	public GamePlayer getEntityByGameAndUser(int gameId, int playerId){
		return gamePlayerRepository.findByGameIdAndPlayerId(gameId, playerId);
	}

	public void removeGamePlayer(GamePlayer gamePlayer){
		gamePlayerRepository.delete(gamePlayer);
	}
}