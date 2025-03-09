import { ReactNode, useState, useEffect } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/context/AuthContext";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";

interface MainLayoutProps {
  children: ReactNode;
  userRole?: "super_admin" | "client_admin" | "user";
}

export function MainLayout({ children, userRole }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  // Get unread notifications count
  const { data: notificationsData } = useSupabaseQuery<{ count: number }>({
    table: "notifications",
    select: "count",
    filters: { user_id: user?.id, read: false },
    dependencies: [user?.id],
  });

  // Get unread messages count
  const { data: messagesData } = useSupabaseQuery<{ count: number }>({
    table: "messages",
    select: "count",
    filters: { receiver_id: user?.id, read: false },
    dependencies: [user?.id],
  });

  const unreadNotifications = notificationsData?.count || 0;
  const unreadMessages = messagesData?.count || 0;

  // Use the user's role from context if not explicitly provided
  const effectiveUserRole = userRole || user?.role || "user";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        user={{
          name: user?.name || "Guest",
          avatar:
            user?.avatar ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || "Guest"}`,
          role: effectiveUserRole,
          unreadNotifications,
          unreadMessages,
        }}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onLogout={() => {
          // This will be handled by the AuthContext
        }}
      />
      <div className="flex flex-1">
        <Sidebar userRole={effectiveUserRole} />
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
