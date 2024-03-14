import { useEffect } from "react";
import { supabase } from "../supabase";
import { useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/reduxStore";

export function useRealtimeAdminOrders() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const orders = supabase
      .channel("admin-orders")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          console.log("Change received!", payload);
          queryClient.invalidateQueries({ queryKey: ["orders"] });
        }
      )
      .subscribe();
    return () => {
      orders.unsubscribe();
    };
  }, []);
}

export function useRealtimeUserOrders() {
  const queryClient = useQueryClient();
  const { session } = useSelector((state: RootState) => state.auth);
  const userId = session?.user.id;

  useEffect(() => {
    const orders = supabase
      .channel("user-orders")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ["orders"] });
        }
      )
      .subscribe();

    return () => {
      orders.unsubscribe();
    };
  }, []);
}
