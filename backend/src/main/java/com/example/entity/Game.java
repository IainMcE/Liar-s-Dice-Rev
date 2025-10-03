package com.example.entity;

import javax.persistence.*;
import java.util.List;
import java.util.Arrays;
import java.util.ArrayList;
import com.example.enums.Visibility;
import com.example.enums.GameState;

@Entity
@Table(name="game")
public class Game {
	@Column(name="gameId")
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer gameId;
	private Integer host;
	private Integer currentPlayer;
	@Enumerated(EnumType.STRING)
	private Visibility visibility;
	@Enumerated(EnumType.STRING)
	private GameState gameState;

	public Game(){
		
	}
	public Game(int host){
		this.host = host;
		this.visibility = Visibility.PUBLIC;
		this.gameState = GameState.CREATING;
	}

	public Integer getGameId() {
		return gameId;
	}
	public void setGameId(Integer gameId) {
		this.gameId = gameId;
	}

	public Integer getHost() {
		return host;
	}
	public void setHost(Integer host) {
		this.host = host;
	}

	public Integer getCurrentPlayer() {
		return currentPlayer;
	}
	public void setCurrentPlayer(Integer currentPlayer) {
		this.currentPlayer = currentPlayer;
	}

	public Visibility getVisibility() {
		return visibility;
	}
	public void setVisibility(Visibility visibility) {
		this.visibility = visibility;
	}

	public GameState getGameState(){
		return gameState;
	}
	public void setGameState(GameState gameState){
		this.gameState = gameState;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Game other = (Game) obj;
		if (host == null) {
			if (other.host != null)
				return false;
		} else if (!host.equals(other.host))
			return false;
		if (visibility == null) {
			if (other.visibility != null)
				return false;
		} else if (!visibility.equals(other.visibility))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "Game{" +
				"gameId=" + gameId +
				", host='" + host + '\'' +
				", visibility='" + visibility.name() + '\'' +
				'}';
	}
}