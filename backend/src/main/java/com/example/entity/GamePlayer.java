package com.example.entity;

import javax.persistence.*;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
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

	public void setRollByDie(int index, int roll){
		switch(index){
			case 0:
				die1 = roll;
				break;
			case 1:
				die2 = roll;
				break;
			case 2:
				die3 = roll;
				break;
			case 3:
				die4 = roll;
				break;
			case 4:
				die5 = roll;
				break;
			case 5:
				die6 = roll;
				break;
			default:
				return;
		}
	}

	public Integer getRollByDie(int index){
		switch(index){
			case 0:
				return die1;
			case 1:
				return die2;
			case 2:
				return die3;
			case 3:
				return die4;
			case 4:
				return die5;
			case 5:
				return die6;
			default:
				return -1;
		}
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
				", dice rolls: [" + die1+","+ die2+","+ die3+","+ die4+","+ die5+","+ die6+","+ ']' +
				'}';
	}
}