-- database "db" and schema "public" will exist by default

\connect db;

create table public.actors (
    id serial primary key,
    cash float(2) not null default 0.00,
    created_date timestamp default current_timestamp,
    updated_date timestamp default current_timestamp
);

comment on table public.actors IS
'Actors represent people/programs that interact with the simulator';

create table public.actions (
    id serial primary key,
    name text
);

INSERT INTO public.actions(name) VALUES ('BUY'), ('SELL');

comment on table public.actions IS
'Actions is a reference table that defines the available types of transactions';

create table public.transactions (
    id serial primary key,
    symbol text not null,
    quantity integer not null,
    price float(2) not null,
    created_date timestamp default current_timestamp,
    updated_date timestamp default current_timestamp,
    action integer not null references public.actions(id),
    actor_id integer not null references public.actors(id)
);

create table public.positions (
    id serial primary key,
    symbol text not null,
    quantity integer not null,
    actor_id integer not null references public.actors(id)
);

comment on table public.transactions is
'Transactions represent asset trades by a particular actor';
