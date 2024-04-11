alter table "public"."profiles" drop constraint "profiles_username_key";

drop index if exists "public"."profiles_username_key";

alter table "public"."orders" add column "city" text;

alter table "public"."orders" add column "country" text;

alter table "public"."orders" add column "phone" text;

alter table "public"."orders" add column "postal_code" text;

alter table "public"."orders" add column "user_name" text;

alter table "public"."profiles" drop column "full_name";

alter table "public"."profiles" add column "city" text;

alter table "public"."profiles" add column "country" text;

alter table "public"."profiles" add column "postal_code" text;


