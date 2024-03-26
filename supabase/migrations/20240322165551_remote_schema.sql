create policy "Allow ALL for authenticated users 16wiy3a_0"
on "storage"."objects"
as permissive
for select
to authenticated
using ((bucket_id = 'product-images'::text));


create policy "Allow ALL for authenticated users 16wiy3a_1"
on "storage"."objects"
as permissive
for update
to authenticated
using ((bucket_id = 'product-images'::text));


create policy "Allow ALL for authenticated users 16wiy3a_2"
on "storage"."objects"
as permissive
for delete
to authenticated
using ((bucket_id = 'product-images'::text));


create policy "Allow ALL for authenticated users 16wiy3a_3"
on "storage"."objects"
as permissive
for insert
to authenticated
with check ((bucket_id = 'product-images'::text));


create policy "Anyone can upload an avatar."
on "storage"."objects"
as permissive
for insert
to public
with check ((bucket_id = 'avatars'::text));


create policy "Avatar images are publicly accessible."
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'avatars'::text));



