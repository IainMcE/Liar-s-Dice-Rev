package com.example.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Arrays;
import java.util.ArrayList;
import java.util.Optional;
import java.util.stream.Collectors;

import com.example.entity.Game;
import com.example.entity.GamePlayer;
import com.example.repository.GameRepository;
import com.example.repository.GamePlayerRepository;
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
		return game;
	}

	public Game setHost(Game game, Integer host){
		game.setHost(host);
		return game;
	}

	public Game nextPlayer(Game game, List<GamePlayer> players){
		int currentIndex;
		if(game.getCurrentPlayer() < 0){
			currentIndex = (int)Math.floor(Math.random()*players.size())-1;
		}else{
			game.setPreviousPlayer(game.getCurrentPlayer());
			List<GamePlayer> filtered = players.stream().filter(gP -> gP.getPlayerId() == game.getCurrentPlayer()).collect(Collectors.toList());
			GamePlayer current = filtered.get(0);
			currentIndex = players.indexOf(current);
		}
		int nextIndex = (currentIndex+1)%players.size();
		game.setCurrentPlayer(players.get(nextIndex).getPlayerId());
		return game;
	}

	public Game resetDice(Game game){
		game.setCount1s(0);
		game.setCount2s(0);
		game.setCount3s(0);
		game.setCount4s(0);
		game.setCount5s(0);
		game.setCount6s(0);
		return gameRepository.save(game);
	}

	public Game countRoll(Game game, int roll){
		switch(roll){
			case 1:
				game.setCount1s(game.getCount1s()+1);
				break;
			case 2:
				game.setCount2s(game.getCount2s()+1);
				break;
			case 3:
				game.setCount3s(game.getCount3s()+1);
				break;
			case 4:
				game.setCount4s(game.getCount4s()+1);
				break;
			case 5:
				game.setCount5s(game.getCount5s()+1);
				break;
			case 6:
				game.setCount6s(game.getCount6s()+1);
				break;
		}
		return game;
	}
}