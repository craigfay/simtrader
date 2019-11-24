-- Create private tables related to roles/authentication

create schema private;

-- This is the private counterpart to public.actor
create table private.actor (
    actor_id integer primary key references public.actor(id) on delete cascade,
    password_hash text not null
);

comment on column private.actor.email is
'A hashed representation of an actor''s secret password';