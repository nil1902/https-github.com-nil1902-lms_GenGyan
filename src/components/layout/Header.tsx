import {
  Bell,
  Menu,
  MessageSquare,
  Search,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { ThemeToggle } from "../ThemeToggle";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Sidebar } from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
  user?: {
    name: string;
    avatar?: string;
    role: string;
    unreadNotifications: number;
    unreadMessages: number;
  };
  onLogout?: () => void;
  onToggleSidebar?: () => void;
}

export function Header({
  user = {
    name: "John Doe",
    avatar: "",
    role: "user",
    unreadNotifications: 3,
    unreadMessages: 5,
  },
  onLogout,
  onToggleSidebar,
}: HeaderProps) {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleNotificationsClick = () => {
    navigate("/notifications");
  };

  const handleMessagesClick = () => {
    navigate("/messages");
  };

  return (
    <header className="bg-background border-b py-4 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center space-x-4">
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar userRole={user.role as any} isMobile={true} />
          </SheetContent>
        </Sheet>

        <h1
          className="text-xl sm:text-2xl font-bold text-primary cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          GyanGen
        </h1>
        <div className="relative hidden md:block w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search courses, trainers..." className="pl-8" />
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4">
        <ThemeToggle />

        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={handleNotificationsClick}
        >
          <Bell className="h-5 w-5" />
          {user.unreadNotifications > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
              {user.unreadNotifications}
            </Badge>
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={handleMessagesClick}
        >
          <MessageSquare className="h-5 w-5" />
          {user.unreadMessages > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
              {user.unreadMessages}
            </Badge>
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-block">{user.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
