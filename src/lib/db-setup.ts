import { supabase } from "./supabase";

// This function can be called to ensure all required tables exist
export async function setupDatabase() {
  try {
    console.log("Checking database setup...");

    // Check if users table exists
    const { error: usersError } = await supabase
      .from("users")
      .select("id")
      .limit(1);

    if (usersError) {
      console.log("Creating users table...");
      // Create users table
      await supabase.rpc("create_users_table");
    }

    // Check and create other tables as needed
    // This is just a placeholder - in a real app, you would create
    // stored procedures in Supabase to handle table creation

    console.log("Database setup complete");
    return true;
  } catch (error) {
    console.error("Error setting up database:", error);
    return false;
  }
}

// SQL for creating tables (to be executed in Supabase SQL editor)
/*
-- Users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'client_admin', 'super_admin')),
  organization_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  settings JSONB
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own data" 
  ON public.users FOR SELECT 
  USING (auth.uid() = id);
  
CREATE POLICY "Users can update their own data" 
  ON public.users FOR UPDATE 
  USING (auth.uid() = id);

-- Trigger to create user profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role, created_at)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', 'User'), 'user', NOW())
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
*/
