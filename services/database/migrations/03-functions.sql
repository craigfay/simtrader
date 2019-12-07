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

-- create function public.buy (
--     actor_id integer,
--     symbol text,
--     price float,
--     quantity integer
-- ) returns public.position as $$
--     declare
--         actor public.actor;
--         position public.position;
--     begin
--         select 1 into actor from public.actor where id = $1;
--         if actor is null return then
--             return null;
--         end if;

--         if actor.cash < $3 * $4

--         select 1 into position from public.position where actor_id = $1;
--         if position is null return then
--             insert 
--         end if;


--         return null;
--     end;
-- $$
-- language plpgsql;
