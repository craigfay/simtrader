-- Roles in postgres are very robust, and important to understand because
-- they dictate which requesters can read/write which data.
-- This is especially true with Postgraphile, as graphql permissions directly
-- mirror the underlying role permissions.

-- The default, and least privileged role
create role anonymous;

-- The role of a human client who's identity has been verified
create role authorized;

-- A role to be assumed by the graphql client
-- postgraphile can do anything anonymous or authorized can do
create role postgraphile login password 'change_me';
grant anonymous to postgraphile;
grant authorized to postgraphile;


-- The shape of JSON Web Tokens used by Postgraphile to authorize requesters
-- The name of this type is referenced in the postgraphile command with --token
create type public.jwt_token as (
    role text,
    account_id integer,
    exp bigint
);

-- Postgraphile will map this function to a graphql query
create function public.authenticate(email text, password text) 
    returns public.jwt_token as
    $$
    declare
        account private.account;
    begin
        -- Get an account record matching the email argument
        select a.* into account
        from private.account as a
        where a.email = $1;

        -- Verify that the password arg matches what is stored
        if account.password_hash = crypt(password, account.password_hash) then
            return (
                'authorized',
                account.account_id,
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
'Creates a JWT token that will securely identify a client with an account '
'and give them certain permissions. This token expires in 2 days.';


-- Get the currently logged in account
create function public.current_account() returns public.account as $$
  select *
  from public.account
  where id = nullif(current_setting('jwt.claims.account_id', true), '')::integer
$$ language sql stable;

comment on function public.current_account() is
'Gets the account who was identified by our JWT.';
