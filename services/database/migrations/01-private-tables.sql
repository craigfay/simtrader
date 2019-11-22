-- Create private tables related to roles/authentication

create schema private;

-- This is the private counterpart to public.account
create table private.account (
    account_id integer primary key references public.account(id) on delete cascade,
    email text not null unique check (email ~* '^.+@.+\..+$'),
    password_hash text not null
);

comment on column private.account.email is
'Email associated with a client holder';

comment on column private.account.email is
'A hashed representation of an client''s secret password';