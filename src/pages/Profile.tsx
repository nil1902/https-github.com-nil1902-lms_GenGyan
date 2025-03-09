import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { useSupabaseMutation } from "@/hooks/useSupabaseMutation";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
  });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const { mutate: updateUser } = useSupabaseMutation({
    table: "users",
    type: "update",
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        avatar: user.avatar || "",
      });
    }
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      let avatarUrl = profileData.avatar;

      // Upload new avatar if selected
      if (avatarFile) {
        const fileExt = avatarFile.name.split(".").pop();
        const filePath = `avatars/${user.id}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, avatarFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);
        avatarUrl = data.publicUrl;
      }

      // Update user profile
      await updateUser(
        {
          id: user.id,
          name: profileData.name,
          avatar_url: avatarUrl,
        },
        "id",
      );

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description:
          error.message || "There was an error updating your profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;

      toast({
        title: "Password updated",
        description: "Your password has been successfully updated",
      });

      setPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({
        title: "Password update failed",
        description:
          error.message || "There was an error updating your password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Your Profile</h1>

        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                    <div className="flex flex-col items-center space-y-2">
                      <Avatar className="h-24 w-24">
                        <AvatarImage
                          src={
                            avatarPreview ||
                            profileData.avatar ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileData.name}`
                          }
                          alt={profileData.name}
                        />
                        <AvatarFallback>
                          {profileData.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <Label
                        htmlFor="avatar-upload"
                        className="cursor-pointer text-sm text-primary hover:underline"
                      >
                        Change avatar
                      </Label>
                      <Input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </div>

                    <div className="flex-1 space-y-4 w-full">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              name: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          disabled
                        />
                        <p className="text-xs text-muted-foreground">
                          Email cannot be changed
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={loading}>
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
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
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" disabled={loading}>
                      {loading ? "Updating..." : "Update Password"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
