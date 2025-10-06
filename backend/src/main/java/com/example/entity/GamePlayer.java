package com.example.entity;

import javax.persistence.*;

@Entity
@Table(name="gamePlayer")
public class GamePlayer {
	@Column(name="entryId")
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer entryId;
	private Integer gameId;
	private Integer playerId;
	private Integer diceCount;
	private Integer die1;
	private Integer die2;
	private Integer die3;
	private Integer die4;
	private Integer die5;
	private Integer die6;

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

	public Integer getDie1(){
		return die1;
	}
	public void setDie1(int die1){
		this.die1 = die1;
	}

	public Integer getDie2(){
		return die2;
	}
	public void setDie2(int die2){
		this.die2 = die2;
	}

	public Integer getDie3(){
		return die3;
	}
	public void setDie3(int die3){
		this.die3 = die3;
	}

	public Integer getDie4(){
		return die4;
	}
	public void setDie4(int die4){
		this.die4 = die4;
	}

	public Integer getDie5(){
		return die5;
	}
	public void setDie5(int die5){
		this.die5 = die5;
	}

	public Integer getDie6(){
		return die6;
	}
	public void setDie6(int die6){
		this.die6 = die6;
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
				", dice rolls: [" + die1+","+ die2+","+ die3+","+ die4+","+ die5+","+ die6+","+ ']' +
				'}';
	}
}