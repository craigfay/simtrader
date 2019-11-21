CREATE DATABASE tradesim;

\connect tradesim;

CREATE SCHEMA tradesim_schema;

CREATE TABLE tradesim_schema.actors (
    id SERIAL PRIMARY KEY,
    cash FLOAT(2) NOT NULL DEFAULT 0.00
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE tradesim_schema.actors IS
'Actors represent people/programs that interact with the simulator';

CREATE TABLE tradesim_schema.actions (
    id SERIAL PRIMARY KEY
    name TEXT
)

INSERT INTO tradesim_schema.actions VALUES ('BUY'), ('SELL')

COMMENT ON TABLE tradesim_schema.actions IS
'Actions is a reference table that defines the available types of transactions'

CREATE TABLE tradesim_schema.transactions (
    id SERIAL PRIMARY KEY,
    action ENUM('BUY', 'SELL') NOT NULL,
    symbol TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price FLOAT(2) NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actor_id INTEGER NOT NULL REFERENCES tradesim_schema.actors(id)
);

CREATE TABLE tradesim_schema.positions (
    id SERIAL PRIMARY KEY,
    symbol TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    actor_id INTEGER NOT NULL REFERENCES tradesim_schema.actors(id)
);

COMMENT ON TABLE tradesim_schema.transactions IS
'Transactions represent asset trades by a particular actor';