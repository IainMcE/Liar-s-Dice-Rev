package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Arrays;
import java.util.ArrayList;

import com.example.entity.Game;

public interface GameRepository extends JpaRepository<Game, Long>{
    public List<Game> findAll();
}