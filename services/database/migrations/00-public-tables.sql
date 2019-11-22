-- database "db" and schema "public" will exist by default

\connect db;

create table public.account (
    id serial primary key,
    name text unique not null,
    created_date timestamp default current_timestamp
);

comment on table public.account is
'Individual people/programs that want to interact with the data';


create table public.product_review (
    id serial primary key,
    product_handle text not null,
    stars integer not null,
    author text not null,
    title text not null,
    message text not null,
    reply text,
    published boolean not null default false,
    created_date timestamp default current_timestamp
);

comment on table public.product_review is
'product_reviews are created by customers in response to a purchase';

comment on column public.product_review.product_handle is
'A unique slug that refers to the product that the customer is reviewing';

comment on column public.product_review.stars is
'Value from 1 to 5 that indicates how much the customer liked the product';

comment on column public.product_review.author is
'The name that the customer chooses to publicly identify themselves';

comment on column public.product_review.title is
'A brief summary to understand the review at a glance';

comment on column public.product_review.message is
'The customer''s full description of their experience';

comment on column public.product_review.reply is
'A response to the review by the guest services team';

comment on column public.product_review.published is
'Whether or not the review has been approved for public display';




