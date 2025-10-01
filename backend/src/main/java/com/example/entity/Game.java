package com.example.entity;

import javax.persistence.*;
import java.util.List;
import java.util.Arrays;
import java.util.ArrayList;
import com.example.enums.Visibility;

/**
 * This is a class that models a Game.
 */
@Entity
@Table(name="game")
public class Game {
    /**
     * An id for this Game. You should use this as the Entity's ID.
     */
    @Column(name="gameId")
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer gameId;
	/**
     * The host's id
     */
	private Integer host;
    /**
     * The list of player ids for those playing the game
     */
    // private List<Integer> playerIds;
    /**
     * A setting that controls the privacy of the game to outsiders
     */
    @Enumerated(EnumType.STRING)
    private Visibility visibility;
    /**
     * A default, no-args constructor, as well as correctly formatted getters and setters, are needed for
     * Jackson Objectmapper to work.
     */
    public Game(){
		
    }
    /**
     * The initialization of a Game with a provided user id, adding them to the list of players
     */
    public Game(int host){
        this.host = host;
		// this.playerIds = new ArrayList<Integer>(Arrays.asList(host));
		this.visibility = Visibility.INVITE;
    }
    /**
     * Properly named getters and setters are necessary for Jackson ObjectMapper to work. You may use them as well.
     * @return gameId
     */
    public Integer getGameId() {
        return gameId;
    }
    /**
     * Properly named getters and setters are necessary for Jackson ObjectMapper to work. You may use them as well.
     * @param gameId
     */
    public void setGameId(Integer gameId) {
        this.gameId = gameId;
    }
    /**
     * Properly named getters and setters are necessary for Jackson ObjectMapper to work. You may use them as well.
     * @return host
     */
    public Integer getHost() {
        return host;
    }
    /**
     * Properly named getters and setters are necessary for Jackson ObjectMapper to work. You may use them as well.
     * @param host
     */
    public void setHost(Integer host) {
        this.host = host;
    }
    /**
     * Properly named getters and setters are necessary for Jackson ObjectMapper to work. You may use them as well.
     * @return username
     */
    public Visibility getVisibility() {
        return visibility;
    }
    /**
     * Properly named getters and setters are necessary for Jackson ObjectMapper to work. You may use them as well.
     * @param visibility
     */
    public void setVisibility(Visibility visibility) {
        this.visibility = visibility;
    }
    /**
     * Properly named getters and setters are necessary for Jackson ObjectMapper to work. You may use them as well.
     * @return password
     */
    // public List<Integer> getPlayerIds() {
    //     return playerIds;
    // }
    /**
     * Properly named getters and setters are necessary for Jackson ObjectMapper to work. You may use them as well.
     * @param playerIds
     */
    // public void setPlayerIds(List<Integer> playerIds) {
    //     this.playerIds = new ArrayList<Integer>(playerIds);
    // }
	// public void addPlayerId(int playerId){
	// 	this.playerIds.add(playerId);
	// }
    /**
     * Overriding the default equals() method adds functionality to tell when two objects are identical, allowing
     * Assert.assertEquals and List.contains to function.
     * @param o the other object.
     * @return true if o is equal to this object.
     */
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
		// if (playerIds == null) {
		// 	if (other.playerIds != null)
		// 		return false;
		// } else if (!playerIds.equals(other.playerIds))
		// 	return false;
		if (visibility == null) {
			if (other.visibility != null)
				return false;
		} else if (!visibility.equals(other.visibility))
			return false;
		return true;
	}

    /**
     * Overriding the default toString() method allows for easy debugging.
     * @return a String representation of this class.
     */
    @Override
    public String toString() {
        return "Game{" +
                "gameId=" + gameId +
                ", host='" + host + '\'' +
                // ", playerIds='" + playerIds.toString() + '\'' +
                ", visibility='" + visibility.name() + '\'' +
                '}';
    }
}