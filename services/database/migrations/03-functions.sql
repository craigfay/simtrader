create extension if not exists "pgcrypto";
-- Create an actor, storing public actor fields in public.actor,
-- and private fields in private.actor
create function public.register_actor (password text) 
    returns public.actor as
    $$
    declare
        actor public.actor;
    begin
        insert into public.actor (cash)
            values (10000.00)
            returning * into actor;

        insert into private.actor(actor_id, password_hash)
            values(actor.id, crypt(password, gen_salt('bf')));

        return actor;
    end;
    $$
language plpgsql strict security definer;

comment on function public.register_actor(text) is
'Registers a single actor';