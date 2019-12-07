-- Make the public schema visible to anonymous and actor users
grant usage on schema public to anonymous, actor;

-- Both anonymous and actor can read from the actors table,
-- but only actor can perform updates/deletes
grant usage, select on public.actor_id_seq to anonymous, actor;
grant usage, select on public.position_id_seq to anonymous, actor;
grant usage, select on public.transaction_id_seq to anonymous, actor;
grant select on table public.actor to anonymous, actor;
grant select, insert on table public.transaction to anonymous, actor;
grant select, insert, update, delete on table public.position to anonymous, actor;