alter table "public"."profiles" drop constraint "profiles_address_key";

drop index if exists "public"."profiles_address_key";

alter table "public"."products" drop column "price";

alter table "public"."products" add column "l_price" real not null;

alter table "public"."products" add column "m_price" real not null;

alter table "public"."products" add column "s_price" real not null;

alter table "public"."products" add column "xl_price" real not null;

alter table "public"."profiles" alter column "email" set default ''::character varying;

alter table "public"."profiles" alter column "full_name" set default ''::text;

alter table "public"."profiles" alter column "username" set default 'Not added yet'::text;


