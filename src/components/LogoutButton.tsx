import { View, Text } from "react-native";
import React from "react";
import { supabase } from "../lib/supabase";
import { router } from "expo-router";
import Button from "./Button";
import { useDispatch } from "react-redux";

export default function LogoutButton() {
  const dispatch = useDispatch();
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
