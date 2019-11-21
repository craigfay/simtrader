-- database "db" and schema "public" will exist by default

\connect db;

CREATE TABLE public.actors (
    id SERIAL PRIMARY KEY,
    cash FLOAT(2) NOT NULL DEFAULT 0.00,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE public.actors IS
'Actors represent people/programs that interact with the simulator';

CREATE TABLE public.actions (
    id SERIAL PRIMARY KEY,
    name TEXT
);

INSERT INTO public.actions(name) VALUES ('BUY'), ('SELL');

COMMENT ON TABLE public.actions IS
'Actions is a reference table that defines the available types of transactions';

CREATE TABLE public.transactions (
    id SERIAL PRIMARY KEY,
    symbol TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price FLOAT(2) NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    action INTEGER NOT NULL REFERENCES public.actions(id),
    actor_id INTEGER NOT NULL REFERENCES public.actors(id)
);

CREATE TABLE public.positions (
    id SERIAL PRIMARY KEY,
    symbol TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    actor_id INTEGER NOT NULL REFERENCES public.actors(id)
);

COMMENT ON TABLE public.transactions IS
'Transactions represent asset trades by a particular actor';