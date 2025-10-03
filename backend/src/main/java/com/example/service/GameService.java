package com.example.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Arrays;
import java.util.ArrayList;
import java.util.Optional;

import com.example.entity.Game;
import com.example.repository.GameRepository;
import com.example.enums.GameState;
import com.example.enums.Visibility;

@Service
public class GameService{
	@Autowired
    GameRepository gameRepository;

    public List<Game> getGames(){
		return gameRepository.findAll();
	}

	public List<Integer> getGameIds(){
		return gameRepository.getGameIds();
	}

	public boolean hasGameWithId(int gameId){
		return gameRepository.existsByGameId(gameId);
	}

	public Game getGameById(int gameId){
		Optional<Game> matching = gameRepository.findByGameId(gameId);
        if(matching.isPresent()){
            return matching.get();
        }
        return null;
	}

	public Game createGame(Game game){
		return gameRepository.save(game);
	}

	public Game saveGame(Game game){
		return gameRepository.save(game);
	}

	public void deleteGame(Game game){
		gameRepository.delete(game);
	}

	public Game setState(Game game, GameState state){
		game.setGameState(state);
		return game;
	}

	public Game setVisibility(Game game, Visibility visibility){
		game.setVisibility(visibility);
		return gameRepository.save(game);
	}

	public Game setHost(Game game, Integer host){
		game.setHost(host);
		return gameRepository.save(game);
	}
}