drop table if exists game;
drop table if exists account;
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


insert into account values(1, 'Jimmy', 'password', 1, 4);
insert into account values(2, 'Frank', 'password', 2, 3);
insert into account values(3, 'Eliza', 'password', 3, 2);
insert into account values(4, 'Terrence', 'password', 4, 1);

insert into game values(1, 1, 'PUBLIC');
insert into game values(2, 4, 'PUBLIC');
insert into game values(3, 4, 'FRIENDS');
insert into game values(4, 4, 'FRIENDS');
insert into game values(5, 4, 'INVITE');	--should not appear
insert into game values(6, 4, 'INVITE');	--should not appear