CREATE TABLE IF NOT EXISTS pokemon (
	id SERIAL PRIMARY KEY,
	num VARCHAR(255),
	name VARCHAR(255),
	img VARCHAR(255),
	weight VARCHAR(255),
	height VARCHAR(255),
	is_deleted VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS users (
	id SERIAL PRIMARY KEY,
	email VARCHAR(255),
	password VARCHAR(255)
);