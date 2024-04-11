import { setProfile, setSession } from "@/lib/features/authSlice";
import { router } from "expo-router";
import React from "react";
import { useDispatch } from "react-redux";
import { supabase } from "../../lib/supabase/supabase";
import Button from "../Button";

type LogoutButtonProps = React.ComponentPropsWithoutRef<typeof Button>;

export default function LogoutButton(props: LogoutButtonProps) {
  const dispatch = useDispatch();
  return (
    <Button
      {...props}
      text="Sign out"
      onPress={() => {
        supabase.auth.signOut();
        dispatch(setSession(null));
        dispatch(setProfile(null));
        router.replace("/");
      }}
    />
  );
}
