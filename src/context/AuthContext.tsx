import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@/types";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check for active session on mount
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          try {
            const { data: userData, error } = await supabase
              .from("users")
              .select("*")
              .eq("id", session.user.id)
              .single();

            if (error) {
              console.error("Error fetching user data:", error);
              // Create user profile if it doesn't exist
              const { data: newUserData, error: insertError } = await supabase
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
                return;
              }

              setUser({
                id: newUserData.id,
                name: newUserData.name,
                email: newUserData.email,
                role: newUserData.role,
                avatar: newUserData.avatar_url,
              });
            } else {
              setUser({
                id: userData.id,
                name: userData.name,
                email: userData.email,
                role: userData.role,
                avatar: userData.avatar_url,
              });
            }
          } catch (error) {
            console.error("Error in user data handling:", error);
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        try {
          const { data: userData, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (error) {
            console.log("User profile not found, creating one...");
            // Create user profile if it doesn't exist
            const { data: newUserData, error: insertError } = await supabase
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
              toast({
                title: "Error",
                description: "Failed to create user profile",
                variant: "destructive",
              });
              return;
            }

            setUser({
              id: newUserData.id,
              name: newUserData.name,
              email: newUserData.email,
              role: newUserData.role,
              avatar: newUserData.avatar_url,
            });
          } else {
            setUser({
              id: userData.id,
              name: userData.name,
              email: userData.email,
              role: userData.role,
              avatar: userData.avatar_url,
            });
          }
        } catch (error) {
          console.error("Error handling auth state change:", error);
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        navigate("/login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log("Attempting to sign in with email:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Supabase auth error:", error);
        throw error;
      }

      console.log(
        "Sign in successful, session:",
        data.session ? "exists" : "null",
      );

      // Ensure user profile exists
      if (data.user) {
        await createUserIfNotExists(
          data.user.id,
          data.user.email || email,
          data.user.user_metadata?.name || "User",
        );
      }
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Helper function to ensure user profile exists
  const createUserIfNotExists = async (
    userId: string,
    email: string,
    name: string,
  ) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id")
        .eq("id", userId)
        .single();

      if (error) {
        console.log("User profile not found, creating one...");
        const { error: insertError } = await supabase.from("users").insert({
          id: userId,
          email,
          name,
          role: "user",
          created_at: new Date().toISOString(),
        });

        if (insertError) {
          console.error("Error creating user profile:", insertError);
        }
      }
    } catch (err) {
      console.error("Error in createUserIfNotExists:", err);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);

      // Create auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });

      if (error) throw error;

      // Create user profile
      if (data.user) {
        try {
          const { error: profileError } = await supabase.from("users").insert({
            id: data.user.id,
            email,
            name,
            role: "user",
            created_at: new Date().toISOString(),
          });

          if (profileError) {
            console.error("Error creating user profile:", profileError);
            // Don't throw here, as the auth user is already created
            // We'll create the profile when they sign in
            toast({
              title: "Registration successful",
              description: "Your account has been created. You can now log in.",
            });
          }
        } catch (profileError) {
          console.error("Exception creating user profile:", profileError);
          // Continue anyway, as the auth user is created
        }
      }
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
