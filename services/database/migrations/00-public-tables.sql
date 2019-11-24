-- database "db" and schema "public" will exist by default

\connect db;

create table public.actor (
    id serial primary key,
    cash float(2) not null default 0.00,
    created_date timestamp default current_timestamp,
    updated_date timestamp default current_timestamp
);

comment on table public.actor IS
'Actors represent people/programs that interact with the simulator';

create table public.action (
    id serial primary key,
    name text
);

INSERT INTO public.action(name) VALUES ('BUY'), ('SELL');

comment on table public.action IS
'Actions is a reference table that defines the available types of transactions';

create table public.transaction (
    id serial primary key,
    symbol text not null,
    quantity integer not null,
    price float(2) not null,
    created_date timestamp default current_timestamp,
    updated_date timestamp default current_timestamp,
    action integer not null references public.action(id),
    actor_id integer not null references public.actor(id)
);

create table public.position (
    id serial primary key,
    symbol text not null,
    quantity integer not null,
    actor_id integer not null references public.actor(id)
);

comment on table public.transaction is
'Transactions represent asset trades by a particular actor';
