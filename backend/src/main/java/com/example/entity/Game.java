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
	@Enumerated(EnumType.STRING)
	private Visibility visibility;
	@Enumerated(EnumType.STRING)
	private GameState gameState;
	private Integer maxDice;
	private Integer currentPlayer;
	private Integer previousPlayer;
	private Integer betCount;
	private Integer betDie;
	private Integer count1s;
	private Integer count2s;
	private Integer count3s;
	private Integer count4s;
	private Integer count5s;
	private Integer count6s;

	public Game(){
		
	}
	public Game(int host){
		this.host = host;
		this.visibility = Visibility.PUBLIC;
		this.gameState = GameState.CREATING;
		currentPlayer = -1;
		previousPlayer = -1;
		maxDice = 6;
		betCount = 0;
		betDie = 0;
		count1s = 0;
		count2s = 0;
		count3s = 0;
		count4s = 0;
		count5s = 0;
		count6s = 0;
	}
	public Game(int host, Visibility visibility, GameState gameState, int currentPlayer, int previousPlayer, int maxDice, int betCount, int betDie){
		this.host = host;
		this.visibility = visibility;
		this.gameState = gameState;
		this.currentPlayer = currentPlayer;
		this.previousPlayer = previousPlayer;
		this.maxDice = maxDice;
		this.betCount = betCount;
		this.betDie = betDie;
		count1s = 0;
		count2s = 0;
		count3s = 0;
		count4s = 0;
		count5s = 0;
		count6s = 0;
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

	public Integer getMaxDice() {
		return maxDice;
	}
	public void setMaxDice(Integer maxDice) {
		this.maxDice = maxDice;
	}

	public Integer getCurrentPlayer() {
		return currentPlayer;
	}
	public void setCurrentPlayer(Integer currentPlayer) {
		this.currentPlayer = currentPlayer;
	}

	public Integer getPreviousPlayer() {
		return previousPlayer;
	}
	public void setPreviousPlayer(Integer previousPlayer) {
		this.previousPlayer = previousPlayer;
	}

	public Integer getBetCount() {
		return betCount;
	}
	public void setBetCount(Integer betCount) {
		this.betCount = betCount;
	}

	public Integer getBetDie() {
		return betDie;
	}
	public void setBetDie(Integer betDie) {
		this.betDie = betDie;
	}

	public Integer getCount1s() {
		return count1s;
	}
	public void setCount1s(Integer count1s) {
		this.count1s = count1s;
	}

	public Integer getCount2s() {
		return count2s;
	}
	public void setCount2s(Integer count2s) {
		this.count2s = count2s;
	}

	public Integer getCount3s() {
		return count3s;
	}
	public void setCount3s(Integer count3s) {
		this.count3s = count3s;
	}

	public Integer getCount4s() {
		return count4s;
	}
	public void setCount4s(Integer count4s) {
		this.count4s = count4s;
	}

	public Integer getCount5s() {
		return count5s;
	}
	public void setCount5s(Integer count5s) {
		this.count5s = count5s;
	}

	public Integer getCount6s() {
		return count6s;
	}
	public void setCount6s(Integer count6s) {
		this.count6s = count6s;
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
				", gameState='" + gameState.name() + '\'' +
				", dice counts: [" + count1s+","+ count2s+","+ count3s+","+ count4s+","+ count5s+","+ count6s+","+ + ']' +
				'}';
	}

	public Game displayInformation(){
		return new Game(host, visibility, gameState, currentPlayer, previousPlayer, maxDice, betCount, betDie);
	}
}