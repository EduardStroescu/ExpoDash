import { supabase } from "@/lib/supabase/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/reduxStore";
import { UpdateTables } from "@/lib/types";

export const useUpdateProfileAvatar = () => {
  const queryClient = useQueryClient();
  const { session } = useSelector((state: RootState) => state.auth);
  const id = session?.user.id;

  return useMutation({
    async mutationFn(data: UpdateTables<"profiles">) {
      if (!id) {
        return null;
      }

      const { data: updatedProfileAvatar, error } = await supabase
        .from("profiles")
        .update({
          avatar_url: data.avatar_url,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return updatedProfileAvatar;
    },
    async onSuccess(_, { id }) {
      await queryClient.invalidateQueries({ queryKey: ["profile", id] });
    },
  });
};

export const useUpdateProfileDetails = () => {
  const queryClient = useQueryClient();
  const { session } = useSelector((state: RootState) => state.auth);
  const id = session?.user.id;

  return useMutation({
    async mutationFn(data: UpdateTables<"profiles">) {
      if (!id) {
        return null;
      }

      const { data: updatedProfileAvatar, error } = await supabase
        .from("profiles")
        .update({
          username: data.username,
          phone: data.phone,
          email: data.email,
          address: data.address,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return updatedProfileAvatar;
    },
    async onSuccess(_, { id }) {
      await queryClient.invalidateQueries({ queryKey: ["profile", id] });
    },
  });
};
