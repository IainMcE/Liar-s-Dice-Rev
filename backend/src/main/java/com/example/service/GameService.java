package com.example.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Arrays;
import java.util.ArrayList;

import com.example.entity.Game;
import com.example.repository.GameRepository;

@Service
public class GameService{
	@Autowired
    GameRepository gameRepository;

    public List<Game> getGames(){
		return gameRepository.findAll();
	}
}