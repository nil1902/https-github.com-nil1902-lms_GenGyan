import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import type { User } from "@/types";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import {
  auth,
  signInWithEmail,
  signUpWithEmail,
  resetPassword as firebaseResetPassword,
  signOut as firebaseSignOut,
} from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

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
    // Subscribe to auth changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || "User",
          email: firebaseUser.email || "",
          role: "user", // Default role, can be updated based on your needs
          avatar: firebaseUser.photoURL || undefined,
        });
      } else {
        // User is signed out
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log("Attempting to sign in with email:", email);
      await signInWithEmail(email, password);
      // Navigation will happen automatically due to the auth state change
    } catch (error) {
      console.error("Firebase auth error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      await signUpWithEmail(email, password, name);
      toast({
        title: "Registration successful",
        description: "Your account has been created. You can now log in.",
      });
      // Navigation will happen automatically due to the auth state change
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
      await firebaseSignOut();
      navigate("/login");
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
      await firebaseResetPassword(email);
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
