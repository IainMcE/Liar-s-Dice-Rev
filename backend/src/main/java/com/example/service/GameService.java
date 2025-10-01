package com.example.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Arrays;
import java.util.ArrayList;
import java.util.Optional;

import com.example.entity.Game;
import com.example.repository.GameRepository;

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
}