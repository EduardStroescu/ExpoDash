import React from "react";
import { supabase } from "../../lib/supabase/supabase";
import { router } from "expo-router";
import Button from "../Button";
import { useDispatch } from "react-redux";
import { setProfile, setSession } from "@/lib/features/authSlice";

type LogoutButtonProps = React.ComponentPropsWithoutRef<typeof Button>;

export default function LogoutButton(props: LogoutButtonProps) {
  const dispatch = useDispatch();
  return (
    <Button
      {...props}
      text="Sign out"
      onPress={() => {
        supabase.auth.signOut();
        dispatch(setSession(null))
        dispatch(setProfile(null));
        router.replace("/");
      }}
    />
  );
}
