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
}