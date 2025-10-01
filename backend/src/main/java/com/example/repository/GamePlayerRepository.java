package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Arrays;
import java.util.ArrayList;
import java.util.Optional;

import com.example.entity.GamePlayer;

public interface GamePlayerRepository extends JpaRepository<GamePlayer, Long>{
	public List<GamePlayer> findByGameId(int gameId);
}