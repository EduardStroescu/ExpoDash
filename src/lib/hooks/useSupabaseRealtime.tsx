import { useEffect } from "react";
import { supabase } from "../supabase/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/reduxStore";

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
        () => {
          queryClient.invalidateQueries({ queryKey: ["orders"] });
        }
      )
      .subscribe();

    return () => {
      orders.unsubscribe();
    };
  }, []);
}

export function useRealtimeAdminOrderStatistics() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const order_statistics = supabase
      .channel("admin-order-statistics")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "order_statistics" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["order_statistics"] });
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "order_statistics" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["order_statistics"] });
        }
      )
      .subscribe();
    return () => {
      order_statistics.unsubscribe();
    };
  }, []);
}
