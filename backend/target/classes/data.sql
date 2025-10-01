drop table if exists game;
drop table if exists account;
drop table if exists gamePlayer;
create table account (
	accountId int primary key auto_increment,
	username varchar(255) not null unique,
	password varchar(255),
	wins int,
	losses int
	-- friend list
);
create table game (
	gameId int primary key auto_increment,
	host int,
	visibility varchar(10)
	-- players
);
create table gamePlayer (
	entryId int primary key auto_increment,
	gameId int,
	playerId int,
	diceCount int,

	foreign key (gameId) references game(gameId),
	foreign key (playerId) references account(accountId)
);


insert into account values(1, 'Jimmy', 'password', 1, 4);
insert into account values(2, 'Frank', 'password', 2, 3);
insert into account values(3, 'Eliza', 'password', 3, 2);
insert into account values(4, 'Terrence', 'password', 4, 1);

insert into game values(1, 1, 'PUBLIC');
insert into game values(3, 4, 'FRIENDS');	-- implement friend list to handle appearance
insert into game values(5, 4, 'INVITE');	-- TODO should not appear

insert into gamePlayer values(1, 1, 1, 6);
insert into gamePlayer values(2, 1, 2, 6);
insert into gamePlayer values(3, 1, 3, 6);
insert into gamePlayer values(4, 1, 4, 6);