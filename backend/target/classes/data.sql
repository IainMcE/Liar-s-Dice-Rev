drop table if exists game;
drop table if exists account;
drop table if exists gamePlayer;
drop table if exists friend;
create table account (
	accountId int primary key auto_increment,
	username varchar(255) not null unique,
	password varchar(255),
	wins int,
	losses int
);
create table game (
	gameId int primary key auto_increment,
	host int,
	visibility varchar(10),
	gameState varchar(10),
	maxDice int default 6,
	currentPlayer int default -1,
	previousPlayer int default -1,
	betCount int default 0,
	betDie int default 0,
	count1s int default 0,
	count2s int default 0,
	count3s int default 0,
	count4s int default 0,
	count5s int default 0,
	count6s int default 0,
	loserId int default -1,
	actualCount int default -1
);
create table gamePlayer (
	entryId int primary key auto_increment,
	gameId int,
	playerId int,
	diceCount int default 0,
	die1 int default 0,
	die2 int default 0,
	die3 int default 0,
	die4 int default 0,
	die5 int default 0,
	die6 int default 0,

	foreign key (gameId) references game(gameId),
	foreign key (playerId) references account(accountId)
);
create table friend(
	friendId int primary key auto_increment,
	userId1 int,
	userId2 int,
	status varchar(10),

	foreign key (userId1) references account(accountId),
	foreign key (userId2) references account(accountId)
);


insert into account (username, password, wins, losses) values('Jimmy', 'password', 1, 4);
insert into account (username, password, wins, losses) values('Frank', 'password', 2, 3);
insert into account (username, password, wins, losses) values('Eliza', 'password', 3, 2);
insert into account (username, password, wins, losses) values('Terrence', 'password', 4, 1);
insert into account (username, password, wins, losses) values('Ollie', 'password', 0, 1);

insert into game (gameId, host, visibility, gameState) values(11, 1, 'PUBLIC', 'CREATING');
insert into game (gameId, host, visibility, gameState) values(12, 4, 'FRIENDS', 'PLAYING');
insert into game (gameId, host, visibility, gameState) values(13, 4, 'INVITE', 'CREATING');	-- implement invite system

insert into gamePlayer (entryId, gameId, playerId) values(11, 11, 1);
insert into gamePlayer (entryId, gameId, playerId) values(12, 11, 2);
insert into gamePlayer (entryId, gameId, playerId) values(13, 11, 3);
insert into gamePlayer (entryId, gameId, playerId) values(14, 11, 4);
insert into gamePlayer (entryId, gameId, playerId) values(15, 12, 5);
insert into gamePlayer (entryId, gameId, playerId) values(16, 12, 1);

insert into friend (userId1, userId2, status) values(1, 2, 'CONFIRMED');
insert into friend (userId1, userId2, status) values(3, 1, 'PENDING');
insert into friend (userId1, userId2, status) values(1, 4, 'PENDING');
insert into friend (userId1, userId2, status) values(5, 1, 'CONFIRMED');