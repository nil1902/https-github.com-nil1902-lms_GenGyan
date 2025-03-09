import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, MessageSquare, Info, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { useSupabaseMutation } from "@/hooks/useSupabaseMutation";
import type { Notification } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Notifications() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

  // Fetch notifications
  const {
    data: notifications,
    loading,
    refetch,
  } = useSupabaseQuery<Notification[]>({
    table: "notifications",
    select: "*",
    filters:
      activeTab === "unread"
        ? { user_id: user?.id, read: false }
        : { user_id: user?.id },
    order: { column: "created_at", ascending: false },
    dependencies: [user?.id, activeTab],
  });

  // Mutation for marking notifications as read
  const { mutate: markAsRead } = useSupabaseMutation<Notification>({
    table: "notifications",
    type: "update",
  });

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead({ id: notificationId, read: true }, "id");
      refetch();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // In a real app, you would use a batch update or custom RPC function
      if (notifications) {
        const unreadNotifications = notifications.filter((n) => !n.read);
        for (const notification of unreadNotifications) {
          await markAsRead({ id: notification.id, read: true }, "id");
        }
        refetch();
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "announcement":
        return <Bell className="h-5 w-5" />;
      case "message":
        return <MessageSquare className="h-5 w-5" />;
      case "system":
        return <Info className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Notifications</h1>
          <Button variant="outline" onClick={handleMarkAllAsRead}>
            <Check className="mr-2 h-4 w-4" />
            Mark All as Read
          </Button>
        </div>

        <Tabs
          defaultValue="all"
          onValueChange={(value) => setActiveTab(value as "all" | "unread")}
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
          </TabsList>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Your Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                <p className="mt-2 text-muted-foreground">
                  Loading notifications...
                </p>
              </div>
            ) : notifications && notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex space-x-4 p-4 rounded-lg ${!notification.read ? "bg-muted/50" : ""}`}
                  >
                    <div className="mt-0.5">
                      <div className="bg-primary/10 p-2 rounded-full">
                        {getIcon(notification.type)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{notification.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.date}
                      </p>
                    </div>
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        Mark as read
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">
                  No notifications to display
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
