import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { auth } from "@/lib/firebase";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { signIn, signUp, resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialTab, setInitialTab] = useState("login");

  // Check if we should show the register tab initially
  useEffect(() => {
    const state = location.state as { tab?: string } | null;
    if (state?.tab === "register") {
      setInitialTab("register");
    }
  }, [location]);

  // Check if we have an active session
  useEffect(() => {
    const checkSession = async () => {
      if (auth.currentUser) {
        navigate("/dashboard");
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Add error handling for network issues
      if (!navigator.onLine) {
        throw new Error(
          "You appear to be offline. Please check your internet connection.",
        );
      }

      await signIn(email, password);
      navigate("/dashboard");
      toast({
        title: "Login successful",
        description: "Welcome back to GyanGen!",
      });
    } catch (error: any) {
      console.error("Login error:", error);

      // Handle different error types
      let errorMessage;
      if (
        error.message?.includes("Failed to fetch") ||
        error.message?.includes("NetworkError")
      ) {
        errorMessage =
          "Network error. Please check your internet connection and try again.";
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "Invalid email or password";
      } else if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage =
          "Too many failed login attempts. Please try again later.";
      } else {
        errorMessage =
          error.message || "Please check your credentials and try again";
      }

      setError(errorMessage);
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      console.log("Attempting to register with email:", email);
      await signUp(email, password, name);

      toast({
        title: "Registration successful",
        description: "Your account has been created. You can now log in.",
      });

      // Clear form fields
      setPassword("");

      // Switch to login tab after successful registration
      const loginTab = document.querySelector('[value="login"]') as HTMLElement;
      if (loginTab) loginTab.click();
    } catch (error: any) {
      console.error("Registration error:", error);

      // Handle specific error messages
      let errorMessage;
      if (error.code === "auth/email-already-in-use") {
        errorMessage =
          "This email is already registered. Please log in instead.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address format.";
      } else if (error.code === "auth/weak-password") {
        errorMessage =
          "Password is too weak. Please use at least 6 characters.";
      } else {
        errorMessage =
          error.message || "There was an error creating your account";
      }

      setError(errorMessage);
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await resetPassword(resetEmail);
      toast({
        title: "Password reset email sent",
        description:
          "Please check your email for instructions to reset your password",
      });
      setShowResetForm(false);
    } catch (error: any) {
      let errorMessage;
      if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address format.";
      } else if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email.";
      } else {
        errorMessage =
          error.message || "There was an error sending the reset email";
      }

      setError(errorMessage);
      toast({
        title: "Password reset failed",
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
          <p className="text-muted-foreground">
            Comprehensive Learning Management System
          </p>
        </div>

        {showResetForm ? (
          <Card className="border-muted">
            <form onSubmit={handleResetPassword}>
              <CardHeader>
                <CardTitle>Reset Password</CardTitle>
                <CardDescription>
                  Enter your email to receive password reset instructions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="name@example.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setShowResetForm(false);
                    setError(null);
                  }}
                >
                  Back to Login
                </Button>
              </CardFooter>
            </form>
          </Card>
        ) : (
          <Card className="border-muted">
            <Tabs
              defaultValue={initialTab}
              onValueChange={() => setError(null)}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin}>
                  <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>
                      Enter your credentials to access your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {error && (
                      <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <button
                          type="button"
                          className="text-sm text-primary hover:underline"
                          onClick={() => {
                            setShowResetForm(true);
                            setError(null);
                          }}
                        >
                          Forgot password?
                        </button>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember-me"
                        checked={rememberMe}
                        onCheckedChange={(checked) =>
                          setRememberMe(checked as boolean)
                        }
                      />
                      <label
                        htmlFor="remember-me"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Remember me
                      </label>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Logging in..." : "Login"}
                    </Button>
                  </CardFooter>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister}>
                  <CardHeader>
                    <CardTitle>Create an account</CardTitle>
                    <CardDescription>
                      Enter your details to create a new account
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {error && (
                      <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <Input
                        id="register-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                      {loading ? "Creating account..." : "Create account"}
                    </Button>
                  </CardFooter>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
        )}
      </div>
    </div>
  );
}
