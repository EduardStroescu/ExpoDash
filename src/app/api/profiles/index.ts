import { supabase } from "@/lib/supabase/supabase";
import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/reduxStore";
import { UpdateTables } from "@/lib/types";
import { setProfile } from "@/lib/features/authSlice";

export const useUpdateProfileAvatar = () => {
  const { session } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
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
    onSuccess(_, profile) {
      dispatch(setProfile(profile));
    },
  });
};

export const useUpdateProfileDetails = () => {
  const { session } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
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
          city: data.city,
          country: data.country,
          postal_code: data.postal_code,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return updatedProfileAvatar;
    },
    onSuccess(profile) {
      dispatch(setProfile(profile));
    },
  });
};
