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
	visibility varchar(10)
);
create table gamePlayer (
	entryId int primary key auto_increment,
	gameId int,
	playerId int,
	diceCount int,

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


insert into account values(11, 'Jimmy', 'password', 1, 4);
insert into account values(12, 'Frank', 'password', 2, 3);
insert into account values(13, 'Eliza', 'password', 3, 2);
insert into account values(14, 'Terrence', 'password', 4, 1);
insert into account values(15, 'Ollie', 'password', 0, 1);

insert into game values(11, 11, 'PUBLIC');
insert into game values(13, 14, 'FRIENDS');
insert into game values(15, 14, 'INVITE');	-- implement invite system
insert into game values(12, 15, 'FRIENDS');

insert into gamePlayer values(11, 11, 11, 6);
insert into gamePlayer values(12, 11, 12, 6);
insert into gamePlayer values(13, 11, 13, 6);
insert into gamePlayer values(14, 11, 14, 6);
insert into gamePlayer values(15, 12, 15, 6);
insert into gamePlayer values(16, 12, 11, 6);

insert into friend values(11, 11, 12, 'CONFIRMED');
insert into friend values(12, 13, 11, 'PENDING');
insert into friend values(13, 11, 14, 'PENDING');
insert into friend values(14, 15, 11, 'CONFIRMED');