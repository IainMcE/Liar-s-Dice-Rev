package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Arrays;
import java.util.ArrayList;
import java.util.Optional;

import com.example.entity.Game;

public interface GameRepository extends JpaRepository<Game, Long>{
	public List<Game> findAll();
	@Query("SELECT g.gameId FROM Game g")
	public List<Integer> getGameIds();
	public boolean existsByGameId(int gameId);
	public Optional<Game> findByGameId(int gameId);
}