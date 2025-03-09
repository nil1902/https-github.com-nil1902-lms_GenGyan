import { supabase } from "./supabase";
import { User } from "@/types";

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signUpWithEmail(
  email: string,
  password: string,
  name: string,
) {
  // First create the auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  if (authError) throw authError;

  // Then create the user profile
  if (authData.user) {
    try {
      const { error: profileError } = await supabase.from("users").insert({
        id: authData.user.id,
        email,
        name,
        role: "user",
        created_at: new Date().toISOString(),
      });

      if (profileError) {
        console.error("Error creating user profile:", profileError);
        // We won't throw here, as the auth user is created
        // The profile will be created when they sign in
      }
    } catch (error) {
      console.error("Exception creating user profile:", error);
      // Continue anyway, as the auth user is created
    }
  }

  return authData;
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) throw error;
  return true;
}

export async function updatePassword(password: string) {
  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) throw error;
  return true;
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function getUserRole(): Promise<
  "super_admin" | "client_admin" | "user" | null
> {
  const session = await getSession();
  if (!session) return null;

  try {
    const { data, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (error) {
      console.error("Error fetching user role:", error);
      // Create user profile if it doesn't exist
      const { data: userData, error: insertError } = await supabase
        .from("users")
        .insert({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || "User",
          role: "user",
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) {
        console.error("Error creating user profile:", insertError);
        return "user";
      }

      return userData.role;
    }

    return data.role;
  } catch (error) {
    console.error("Exception in getUserRole:", error);
    return "user";
  }
}

export async function createUserIfNotExists(
  userId: string,
  email: string,
  name: string,
) {
  try {
    // Check if user exists
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      // User doesn't exist, create profile
      const { error: insertError } = await supabase.from("users").insert({
        id: userId,
        email,
        name,
        role: "user",
        created_at: new Date().toISOString(),
      });

      if (insertError) {
        console.error("Error creating user profile:", insertError);
        return false;
      }
      return true;
    }

    return true; // User already exists
  } catch (error) {
    console.error("Exception in createUserIfNotExists:", error);
    return false;
  }
}
