import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useToast } from "@/components/ui/use-toast";
import { updatePassword } from "@/lib/firebase";
import { auth } from "@/lib/firebase";
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionCode, setActionCode] = useState<string | null>(null);

  useEffect(() => {
    // Get the action code from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("oobCode");

    if (!code) {
      navigate("/login");
      return;
    }

    setActionCode(code);

    // Verify the password reset code is valid
    const verifyCode = async () => {
      try {
        await verifyPasswordResetCode(auth, code);
      } catch (error) {
        console.error("Invalid or expired action code", error);
        toast({
          title: "Invalid reset link",
          description: "This password reset link is invalid or has expired.",
          variant: "destructive",
        });
        navigate("/login");
      }
    };

    verifyCode();
  }, [navigate, toast]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      if (!actionCode) {
        throw new Error("Reset code not found");
      }

      // Complete the password reset process
      await confirmPasswordReset(auth, actionCode, password);

      toast({
        title: "Password updated",
        description:
          "Your password has been successfully updated. You can now log in with your new password.",
      });
      navigate("/login");
    } catch (error: any) {
      let errorMessage;
      if (error.code === "auth/weak-password") {
        errorMessage =
          "Password is too weak. Please use at least 6 characters.";
      } else if (error.code === "auth/expired-action-code") {
        errorMessage =
          "This password reset link has expired. Please request a new one.";
      } else if (error.code === "auth/invalid-action-code") {
        errorMessage =
          "This password reset link is invalid. Please request a new one.";
      } else {
        errorMessage = error.message || "Failed to update password";
      }

      setError(errorMessage);
      toast({
        title: "Password update failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">GyanGen</h1>
          <p className="text-muted-foreground">Reset Your Password</p>
        </div>

        <Card className="border-muted">
          <form onSubmit={handleResetPassword}>
            <CardHeader>
              <CardTitle>Create New Password</CardTitle>
              <CardDescription>Please enter your new password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <p className="text-xs text-muted-foreground">
                  Password must be at least 6 characters long
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
