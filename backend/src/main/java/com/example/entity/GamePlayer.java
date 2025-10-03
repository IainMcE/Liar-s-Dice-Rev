package com.example.entity;

import javax.persistence.*;

@Entity
@Table(name="gamePlayer")
public class GamePlayer {
	@Column(name="entryId")
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer entryId;
	@Column(name="gameId")
	private Integer gameId;
	@Column(name="playerId")
	private Integer playerId;
	@Column(name="diceCount")
	private Integer diceCount;

	public GamePlayer(){}
	public GamePlayer(int gameId, int playerId){
		this.gameId = gameId;
		this.playerId = playerId;
		this.diceCount = 6;
	}
	public GamePlayer(int entryId, int gameId, int playerId, int diceCount){
		this.entryId = entryId;
		this.gameId = gameId;
		this.playerId = playerId;
		this.diceCount = diceCount;
	}

	public Integer getEntryId(){
		return entryId;
	}
	public void setEntryId(int entryId){
		this.entryId = entryId;
	}

	public Integer getGameId(){
		return gameId;
	}
	public void setGameId(int gameId){
		this.gameId = gameId;
	}

	public Integer getPlayerId(){
		return playerId;
	}
	public void setPlayerId(int playerId){
		this.playerId = playerId;
	}

	public Integer getDiceCount(){
		return diceCount;
	}
	public void setDiceCount(int diceCount){
		this.diceCount = diceCount;
	}
	public void loseDie(){
		this.diceCount--;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		GamePlayer other = (GamePlayer) obj;
		if (gameId == null) {
			if (other.gameId != null)
				return false;
		} else if (!gameId.equals(other.gameId))
			return false;
		if (playerId == null) {
			if (other.playerId != null)
				return false;
		} else if (!playerId.equals(other.playerId))
			return false;
		if (diceCount == null) {
			if (other.diceCount != null)
				return false;
		} else if (!diceCount.equals(other.diceCount))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "GamePlayer{" +
				"gameId=" + gameId +
				", playerId='" + playerId + '\'' +
				", diceCount='" + diceCount + '\'' +
				'}';
	}
}