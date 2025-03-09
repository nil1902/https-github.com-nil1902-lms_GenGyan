import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      "x-application-name": "gyanGen",
    },
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export async function getCurrentUser() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return null;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", session.user.id)
    .single();

  if (error) {
    console.error("Error fetching user:", error);
    return null;
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) console.error("Error signing out:", error);
}
