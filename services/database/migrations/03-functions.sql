-- Functions in postgres are mapped to custom queries/mutations by postgraphile
create function public.search_product_reviews(term text)
    returns setof public.product_review as
    $$
        select review.*
        from public.product_review as review
        where position(lower(term) in lower(review.title)) > 0 
        or position(lower(term) in lower(review.product_handle)) > 0
        or position(lower(term) in lower(review.author)) > 0
    $$
language sql stable;

comment on function public.search_product_reviews(text) is
'Search product reviews whose title or product_handle contain a search term';


create extension if not exists "pgcrypto";
-- Create an account, storing public account fields in public.account,
-- and private fields in private.account
create function public.register_account (name text, email text, password text) 
    returns public.account as
    $$
    declare
        account public.account;
    begin
        insert into public.account (name)
            values (name)
            returning * into account;

        insert into private.account(account_id, email, password_hash)
            values(account.id, email, crypt(password, gen_salt('bf')));

        return account;
    end;
    $$
language plpgsql strict security definer;

comment on function public.register_account(text, text, text) is
'Registers a single account';