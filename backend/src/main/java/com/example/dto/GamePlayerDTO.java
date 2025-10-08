package com.example.dto;

import java.util.Objects;
import lombok.AllArgsConstructor;
import lombok.Data;

import com.example.entity.GamePlayer;
import com.example.entity.Account;

@Data
@AllArgsConstructor
public class GamePlayerDTO{
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
	private String username;

	public GamePlayerDTO(GamePlayer player){
		this.username = player.getAccount().getUsername();
		this.entryId = player.getEntryId();
		this.gameId = player.getGameId();
		this.playerId = player.getPlayerId();
		this.diceCount = player.getDiceCount();
		this.die1 = player.getDie1();
		this.die2 = player.getDie2();
		this.die3 = player.getDie3();
		this.die4 = player.getDie4();
		this.die5 = player.getDie5();
		this.die6 = player.getDie6();
	}
}