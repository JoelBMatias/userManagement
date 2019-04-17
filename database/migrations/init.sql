create table Utilizador (
	id serial primary key,
	email text unique,
	givenName text,
	familyName text,
	created timestamp default now()
);
