-- In this file, we revoke all all priviliges, and add back only what
-- we deem appropriate according to our business rules
alter default privileges revoke execute on functions from public;

-- Make the public schema visible to anonymous and authorized users
grant usage on schema public to anonymous, authorized;

-- Both anonymous and authorized can read from the accounts table,
-- but only authorized can perform updates/deletes
grant select on table public.account to anonymous, authorized;
grant update, delete on table public.account to authorized;

-- anonymous users can read and write to product_review table
-- authorized can read, update, and delete
grant select, insert on table public.product_review to anonymous;
grant select, update, delete on table public.product_review to authorized;

-- anonymous and authorized users can use these functions
grant execute on function public.search_product_reviews(text) to anonymous, authorized;
grant execute on function public.authenticate(text, text) to anonymous, authorized;
grant execute on function public.current_account() to anonymous, authorized;

-- Only authorized roles can create new accounts
grant execute on function public.register_account(text, text, text) to authorized;

-- Without the commands below, accounts could update and delete any row
-- in the account table that they want

-- By enabling row level security, our roles don’t have any access to a table 
-- that you don’t explicitly give
alter table private.account enable row level security;

-- Re-enable account reads, which were revoked above
create policy select_account on public.account for select
  using (true);

-- Re-enable product_review reads access, which were revoked above
create policy select_product_review on public.product_review for select
    using (true);

-- Allow account holders delete their own accounts
create policy delete_account on public.account for update
    to authorized
    using (id = nullif(current_setting('jwt.claims.account_id', true), '')::integer);

-- Allow account holders to update their own accounts
create policy update_account on public.account for update
    to authorized
    using (id = nullif(current_setting('jwt.claims.account_id', true), '')::integer);

-- Allow authorized and anonymous clients to create product_reviews
create policy insert_product_review on public.product_review for insert
    to anonymous, authorized
    with check (true);

-- Allow authorized clients to update product_reviews
create policy update_product_review on public.product_review for update 
    to authorized
    using (true);

-- Allow authorized clients to delete product_reviews
create policy delete_product_review on public.product_review for delete
    to authorized
    using (true);

