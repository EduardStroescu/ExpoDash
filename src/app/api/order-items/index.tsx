import { supabase } from "@/lib/supabase/supabase";
import { InsertTables } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";

export const useInsertOrderItems = () => {
  return useMutation({
    async mutationFn(items: InsertTables<"order_items">[]) {
      const { error, data: newOrderItems } = await supabase
        .from("order_items")
        .insert(items)
        .select();

      if (error) {
        throw new Error(error.message);
      }
      return newOrderItems;
    },
  });
};
