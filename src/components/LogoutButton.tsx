import React from "react";
import { supabase } from "../lib/supabase";
import { router } from "expo-router";
import Button from "./Button";

export default function LogoutButton() {
  return (
    <Button
      text="Sign out"
      onPress={() => {
        supabase.auth.signOut();
        router.replace("/");
      }}
    />
  );
}
