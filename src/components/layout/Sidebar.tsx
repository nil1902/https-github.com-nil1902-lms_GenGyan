import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Calendar,
  Home,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Users,
  BarChart,
  LogOut,
} from "lucide-react";
import { Separator } from "../ui/separator";

interface SidebarProps {
  userRole?: "super_admin" | "client_admin" | "user";
  isMobile?: boolean;
}

export function Sidebar({ userRole = "user", isMobile = false }: SidebarProps) {
  const location = useLocation();

  const userNavItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: "Courses",
      href: "/courses",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      name: "Messages",
      href: "/messages",
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      name: "Schedule",
      href: "/schedule",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  const adminNavItems = [
    {
      name: "Admin Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "User Management",
      href: "/admin/users",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: <BarChart className="h-5 w-5" />,
    },
  ];

  const superAdminNavItems = [
    {
      name: "Client Management",
      href: "/super-admin/clients",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "System Settings",
      href: "/super-admin/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  const navItems = [...userNavItems];

  if (userRole === "client_admin") {
    navItems.push(...adminNavItems);
  }

  if (userRole === "super_admin") {
    navItems.push(...adminNavItems, ...superAdminNavItems);
  }

  return (
    <aside
      className={cn(
        "bg-background border-r w-64 h-screen overflow-y-auto",
        isMobile ? "block" : "hidden md:block",
      )}
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold text-primary">GyanGen</h2>
        <p className="text-sm text-muted-foreground">
          {userRole === "super_admin"
            ? "Super Admin"
            : userRole === "client_admin"
              ? "Client Admin"
              : "Learning Portal"}
        </p>
      </div>

      <Separator />

      <nav className="mt-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium transition-colors",
                  location.pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {isMobile && (
        <div className="absolute bottom-8 w-full px-2">
          <Separator className="mb-4" />
          <Link
            to="/login"
            className="flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium transition-colors text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </Link>
        </div>
      )}
    </aside>
  );
}
