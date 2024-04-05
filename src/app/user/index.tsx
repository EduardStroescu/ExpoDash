import { Redirect, useRouter } from "expo-router";
import { useEffect } from "react";

export default function TabIndex() {
  return <Redirect href={"/user/menu/"} />;
}
