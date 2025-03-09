import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "super_admin" | "client_admin" | "user";
}

export function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    } else if (!loading && user && requiredRole) {
      // Check if user has the required role
      if (requiredRole === "super_admin" && user.role !== "super_admin") {
        navigate("/dashboard");
      } else if (
        requiredRole === "client_admin" &&
        user.role !== "super_admin" &&
        user.role !== "client_admin"
      ) {
        navigate("/dashboard");
      }
    }
  }, [user, loading, navigate, requiredRole]);

  // Show loading state or render children
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return user ? <>{children}</> : null;
}
