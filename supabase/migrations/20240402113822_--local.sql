alter table "public"."order_items" drop constraint "public_order_items_product_id_fkey";

alter table "public"."order_items" add constraint "public_order_items_product_id_fkey" FOREIGN KEY (product_id) REFERENCES products(id) ON UPDATE CASCADE not valid;

alter table "public"."order_items" validate constraint "public_order_items_product_id_fkey";


