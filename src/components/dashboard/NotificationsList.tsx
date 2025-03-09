import { Bell, MessageSquare, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Notification } from "@/types";

interface NotificationsListProps {
  notifications: Notification[];
  onViewAll?: () => void;
  onMarkAsRead?: (id: string) => void;
}

export function NotificationsList({
  notifications = [
    {
      id: "1",
      title: "New Course Available",
      message: "A new course on Data Science has been added to the catalog.",
      date: "2 hours ago",
      read: false,
      type: "announcement" as const,
    },
    {
      id: "2",
      title: "Message from Instructor",
      message: "Your instructor has replied to your question.",
      date: "Yesterday",
      read: true,
      type: "message" as const,
    },
    {
      id: "3",
      title: "Certificate Generated",
      message: "Your certificate for JavaScript Fundamentals is ready.",
      date: "3 days ago",
      read: false,
      type: "system" as const,
    },
  ],
  onViewAll = () => {},
  onMarkAsRead = () => {},
}: NotificationsListProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "announcement":
        return <Bell className="h-4 w-4" />;
      case "message":
        return <MessageSquare className="h-4 w-4" />;
      case "system":
        return <Info className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Notifications</CardTitle>
        <Button variant="ghost" size="sm" onClick={onViewAll}>
          View all
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex space-x-4 ${!notification.read ? "bg-muted/50 -mx-4 p-4 rounded-md" : ""}`}
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
                  onClick={() => onMarkAsRead(notification.id)}
                >
                  Mark as read
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
