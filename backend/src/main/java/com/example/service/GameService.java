package com.example.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Arrays;
import java.util.ArrayList;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Random;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import com.example.entity.Game;
import com.example.entity.GamePlayer;
import com.example.repository.GameRepository;
import com.example.service.GamePlayerService;
import com.example.enums.GameState;
import com.example.enums.Visibility;

@Service
public class GameService{
	@Autowired
    GameRepository gameRepository;
	@Autowired
	GamePlayerService gamePlayerService;
	private final ScheduledExecutorService scheduledExecutorService;
	private Random random;

	@Autowired
	public GameService() {
		this.scheduledExecutorService = Executors.newSingleThreadScheduledExecutor();
		this.random = new Random();
	}

	public void setRandom(Random random){
		this.random = random;
	}

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

	public Game newRound(Game game){
		List<GamePlayer> players = gamePlayerService.getPlayersByGameId(game.getGameId());
		game = resetDice(game);
		for(GamePlayer player : players){
			game = playerRollDice(game, player);
		}
		game = nextPlayer(game, players);
		return saveGame(game);
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
		while(players.get(nextIndex).getDiceCount()<=0){
			nextIndex = nextIndex+1%players.size();
			if(nextIndex == currentIndex){	//prevent infinite loops
				game.setGameState(GameState.ENDED);
				return game;
			}
		}
		game.setCurrentPlayer(players.get(nextIndex).getPlayerId());
		return game;
	}

	public Game resetDice(Game game){
		for(int i = 1; i<=6; i++){
			game.setCountByDie(i, 0);
		}
		return gameRepository.save(game);
	}

	public Game playerRollDice(Game game, GamePlayer gamePlayer){
		for(int i = 0; i<gamePlayer.getDiceCount(); i++){
			int roll = random.nextInt(1, 7);
			gamePlayer = gamePlayerService.setPlayerRoll(gamePlayer, i, roll);
			game = countRoll(game, roll);
		}
		gamePlayerService.saveGamePlayer(gamePlayer);
		return game;
	}

	public Game countRoll(Game game, int roll){
		game.incrementCountByDie(roll);
		return game;
	}

	public boolean validBet(Game game, int count, int die){
		return game.validBet(count, die);
	}

	public Game setBet(Game game, int count, int die){
		game.setBetCount(count);
		game.setBetDie(die);
		return game;
	}

	public Game placeBet(Game game, int count, int die){
		game = setBet(game, count, die);
		game = nextPlayer(game, gamePlayerService.getPlayersByGameId(game.getGameId()));
		return saveGame(game);
	}

	public Game challengeBet(Game game){
		game.setGameState(GameState.CONTESTING);
		gameRepository.save(game);

		scheduledExecutorService.schedule(()->{
			Game game1 = roundResult(game);
			saveGame(game1);
			game1.setGameState(GameState.RESOLVING);
			scheduledExecutorService.schedule(()->{
				endOfRound(game1);
				game1.setGameState(GameState.PLAYING);
				Game game2 = newRound(game1);
				saveGame(game2);
				return game2;
			}, 3, TimeUnit.SECONDS);
		}, 3, TimeUnit.SECONDS);
		return game;
	}

	public Game roundResult(Game game){
		int actualCount = game.getCountByDie(game.getBetDie());
		if(actualCount <= game.getBetCount()){ //prev was correct, caller loses
			game.setLoserId(game.getPreviousPlayer());
		}else{ //prev was wrong and loses
			game.setLoserId(game.getCurrentPlayer());
		}
		game.setActualCount(actualCount);
		return game;
	}

	public Game endOfRound(Game game){
		GamePlayer loser = gamePlayerService.getEntityByGameAndUser(game.getGameId(), game.getLoserId());
		gamePlayerService.loseDie(loser);
		return game;
	}
}