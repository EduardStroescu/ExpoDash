import { RootState } from "@/lib/reduxStore";
import { supabase } from "@/lib/supabase/supabase";
import { InsertTables, UpdateTables } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";

export const useAdminOrderList = ({ archived }: { archived: boolean }) => {
  const status = archived
    ? ["Delivered"]
    : ["New", "Cooking", "Delivering", "Cancelled"];

  return useQuery({
    queryKey: ["orders", { archived }],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .in("status", status)
        .order("created_at", { ascending: false });
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useUserOrderList = () => {
  const { session } = useSelector((state: RootState) => state.auth);
  const id = session?.user.id;
  return useQuery({
    queryKey: ["orders", { userId: id }],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", id)
        .order("created_at", { ascending: false });
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useOrderDetails = (id: number) => {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*, products(*))")
        .eq("id", id)
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useInsertOrder = () => {
  const queryClient = useQueryClient();
  const { session } = useSelector((state: RootState) => state.auth);
  const userId = session?.user.id;

  return useMutation({
    async mutationFn(data: InsertTables<"orders">) {
      if (!userId) return null;
      const { data: newOrder, error } = await supabase
        .from("orders")
        .insert({ ...data, user_id: userId })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return newOrder;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn({
      id,
      updatedFields,
    }: {
      id: number;
      updatedFields: UpdateTables<"orders">;
    }) {
      const { error, data: updatedOrder } = await supabase
        .from("orders")
        .update(updatedFields)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return updatedOrder;
    },
    async onSuccess(_, { id }) {
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      await queryClient.invalidateQueries({ queryKey: ["orders", id] });
    },
  });
};

export const useOrderStatistics = () => {
  return useQuery({
    queryKey: ["order_statistics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("order_statistics")
        .select(
          `
        total_new_orders_day,
        total_delivered_orders_day,
        total_new_orders_week,
        total_delivered_orders_week,
        total_new_orders_month,
        total_delivered_orders_month,
        total_new_orders_year,
        total_delivered_orders_year
        `,
        )
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) {
        throw new Error(error.message);
      }

      if (!data || data.length === 0) {
        throw new Error("No data found");
      }

      return data[0];
    },
  });
};
