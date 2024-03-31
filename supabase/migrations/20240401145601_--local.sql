alter table "public"."profiles" drop constraint "profiles_id_fkey";

alter table "public"."orders" add column "address" character varying;

alter table "public"."products" add column "description" text not null;

alter table "public"."profiles" drop column "website";

alter table "public"."profiles" add column "address" character varying;

alter table "public"."profiles" add column "email" character varying not null;

alter table "public"."profiles" add column "phone" text;

alter table "public"."profiles" alter column "updated_at" set default (now() AT TIME ZONE 'utc'::text);

CREATE UNIQUE INDEX profiles_address_key ON public.profiles USING btree (address);

CREATE UNIQUE INDEX public_orders_address_fkey ON public.profiles USING btree (email);

alter table "auth"."users" add constraint "public_profiles_email_fkey" UNIQUE (email);

alter table "public"."profiles" add constraint "profiles_address_key" UNIQUE using index "profiles_address_key";

alter table "public"."profiles" add constraint "public_orders_address_fkey" UNIQUE using index "public_orders_address_fkey";

alter table "public"."profiles" add constraint "public_profiles_email_fkey" FOREIGN KEY (email) REFERENCES auth.users(email) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "public_profiles_email_fkey";

alter table "public"."profiles" add constraint "public_profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON UPDATE CASCADE not valid;

alter table "public"."profiles" validate constraint "public_profiles_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  insert into public.profiles (id, full_name, avatar_url, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', NEW.email);
  return new;
end;
$function$
;


