-- Roles in postgres are very robust, and important to understand because
-- they dictate which requesters can read/write which data.
-- This is especially true with Postgraphile, as graphql permissions directly
-- mirror the underlying role permissions.

-- The default, and least privileged role
create role anonymous;

-- The role of a actor who's identity has been verified
create role actor;

-- A role to be assumed by the graphql client
-- postgraphile can do anything anonymous or actor can do
create role postgraphile login password 'change_me';
grant anonymous to postgraphile;
grant actor to postgraphile;


-- The shape of JSON Web Tokens used by Postgraphile to authorize requesters
-- The name of this type is referenced in the postgraphile command with --token
create type public.jwt_token as (
    role text,
    actor_id integer,
    exp bigint
);

-- Postgraphile will map this function to a graphql query
create function public.authenticate(actor_id integer , password text) 
    returns public.jwt_token as
    $$
    declare
        actor private.actor;
    begin
        -- Get an actor record matching the email argument
        select a.* into actor
        from private.actor as a
        where a.actor_id = $1;

        -- Verify that the password arg matches what is stored
        if actor.password_hash = crypt(password, actor.password_hash) then
            return (
                'actor',
                actor.actor_id,
                extract(epoch from (now() + interval '2 days'))
            )::public.jwt_token;
        else
            return null;
        end if;
    end;
    $$ 
language plpgsql strict security definer;

-- PostGraphile will serialize each JWT to the database in the form of 
-- local settings that exist on a per-transaction basis
comment on function public.authenticate(text, text) is
'Creates a JWT token that will securely identify a client with an actor '
'and give them certain permissions. This token expires in 2 days.';


-- Get the currently logged in actor
create function public.current_actor() returns public.actor as $$
  select *
  from public.actor
  where id = nullif(current_setting('jwt.claims.actor_id', true), '')::integer
$$ language sql stable;

comment on function public.current_actor() is
'Gets the actor who was identified by our JWT.';
