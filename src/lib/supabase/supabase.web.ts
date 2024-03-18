import { createClient } from "@supabase/supabase-js";
import { Database } from "../database.types";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLIC_KEY!;

//For Web Version
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
