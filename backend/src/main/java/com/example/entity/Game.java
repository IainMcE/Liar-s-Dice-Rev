package com.example.entity;

import javax.persistence.*;
import java.util.List;
import java.util.Arrays;
import java.util.ArrayList;
import com.example.enums.Visibility;
import com.example.enums.GameState;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
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
	private Integer actualCount;
	private Integer loserId;

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
		loserId = -1;
		actualCount = -1;
	}
	public Game(int host, Visibility visibility, GameState gameState, int currentPlayer, int previousPlayer, int maxDice, int betCount, int betDie, int actualCount, int loserId){
		this.host = host;
		this.visibility = visibility;
		this.gameState = gameState;
		this.currentPlayer = currentPlayer;
		this.previousPlayer = previousPlayer;
		this.maxDice = maxDice;
		this.betCount = betCount;
		this.betDie = betDie;
		this.actualCount = actualCount;
		this.loserId = loserId;
		count1s = 0;
		count2s = 0;
		count3s = 0;
		count4s = 0;
		count5s = 0;
		count6s = 0;
	}

	public boolean validBet(int newCount, int newDie){
		if(newCount < 1 || newDie < 1){
			return false;
		}
		if(newDie < betDie){
			return false;
		}
		if(newCount <= betCount){
			return newDie > betDie;
		}
		return true;
	}

	public Integer getCountByDie(int die){
		switch(die){
			case 1:
				return count1s;
			case 2:
				return count2s;
			case 3:
				return count3s;
			case 4:
				return count4s;
			case 5:
				return count5s;
			case 6:
				return count6s;
			default:
				return -1;
		}
	}

	public void setCountByDie(Integer die, Integer count){
		switch(die){
			case 1:
				count1s = count;
				break;
			case 2:
				count2s = count;
				break;
			case 3:
				count3s = count;
				break;
			case 4:
				count4s = count;
				break;
			case 5:
				count5s = count;
				break;
			case 6:
				count6s = count;
				break;
			default:
				return;
		}
	}

	public void incrementCountByDie(Integer die){
		switch(die){
			case 1:
				count1s++;
				break;
			case 2:
				count2s++;
				break;
			case 3:
				count3s++;
				break;
			case 4:
				count4s++;
				break;
			case 5:
				count5s++;
				break;
			case 6:
				count6s++;
				break;
			default:
				return;
		}
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
		return new Game(host, visibility, gameState, currentPlayer, previousPlayer, maxDice, betCount, betDie, actualCount, loserId);
	}
}