# Liar-s-Dice-Rev

A web app that allows users to play Liar's dice online.

Users are able to:
* Create an account/log in
* View games if they are public or are made by a friend
* Join, spectate, or return (if already joined) to those games
	* Users cannot join a game already in progress
	* Users are only allowed to spectate if they are not logged in
* Play a game of Liar's Dice
	* Increase the bid
	* Challenge the previous bid
	* Watch as the results play out
* View user profiles
* Add friends

Technology Used:
* Spring Boot, Spring Web, Spring JPA
* SQL (H2 embedded)
* React
* TypeScript
* CSS
* Maven
* GitHub
* Docker
* AWS

Ideas for future development:
* An invite system
* Sort the list of games to prioritize certain games
* Match history
* Profile authentication
* "Physically" simulated dice using three.js