alter table "public"."orders" drop constraint "public_orders_user_id_fkey";

alter table "public"."orders" add constraint "public_orders_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON UPDATE CASCADE not valid;

alter table "public"."orders" validate constraint "public_orders_user_id_fkey";

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


