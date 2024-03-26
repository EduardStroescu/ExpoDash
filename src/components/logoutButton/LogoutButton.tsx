import React from "react";
import { supabase } from "../../lib/supabase/supabase";
import { router } from "expo-router";
import Button from "../Button";

type LogoutButtonProps = React.ComponentPropsWithoutRef<typeof Button>;

export default function LogoutButton(props: LogoutButtonProps) {
  return (
    <Button
      {...props}
      text="Sign out"
      onPress={() => {
        supabase.auth.signOut();
        router.replace("/");
      }}
    />
  );
}
