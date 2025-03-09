import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/components/ThemeProvider";
import { useToast } from "@/components/ui/use-toast";
import { useSupabaseMutation } from "@/hooks/useSupabaseMutation";
import { useAuth } from "@/context/AuthContext";

export default function Settings() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    darkMode: theme === "dark",
    autoPlayVideos: true,
    showProgressBar: true,
    language: "english",
  });

  const { mutate: updateUserSettings } = useSupabaseMutation({
    table: "users",
    type: "update",
  });

  const handleSaveSettings = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Update user settings in database
      await updateUserSettings(
        {
          id: user.id,
          settings: settings,
        },
        "id",
      );

      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error saving settings",
        description: error.message || "There was an error saving your settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDarkModeToggle = (checked: boolean) => {
    setSettings({ ...settings, darkMode: checked });
    setTheme(checked ? "dark" : "light");
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Settings</h1>

        <Tabs defaultValue="preferences">
          <TabsList>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>

          <TabsContent value="preferences" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Learning Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Auto-play Videos</h3>
                    <p className="text-sm text-muted-foreground">
                      Automatically play videos when a lesson loads
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoPlayVideos}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, autoPlayVideos: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Show Progress Bar</h3>
                    <p className="text-sm text-muted-foreground">
                      Display progress bar on course cards
                    </p>
                  </div>
                  <Switch
                    checked={settings.showProgressBar}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, showProgressBar: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="language">Language</Label>
                  <select
                    id="language"
                    className="p-2 rounded-md border border-input bg-background"
                    value={settings.language}
                    onChange={(e) =>
                      setSettings({ ...settings, language: e.target.value })
                    }
                  >
                    <option value="english">English</option>
                    <option value="spanish">Spanish</option>
                    <option value="french">French</option>
                    <option value="german">German</option>
                    <option value="hindi">Hindi</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive course updates and announcements via email
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, emailNotifications: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Push Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications in your browser
                    </p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, pushNotifications: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Dark Mode</h3>
                    <p className="text-sm text-muted-foreground">
                      Switch between light and dark themes
                    </p>
                  </div>
                  <Switch
                    checked={settings.darkMode}
                    onCheckedChange={handleDarkModeToggle}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button onClick={handleSaveSettings} disabled={loading}>
            {loading ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
