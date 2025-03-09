import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { MoreHorizontal, Search } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  lastLogin: string;
  avatar?: string;
}

interface UserManagementTableProps {
  users: User[];
  onEditUser?: (userId: string) => void;
  onDeleteUser?: (userId: string) => void;
  onResetPassword?: (userId: string) => void;
}

export function UserManagementTable({
  users = [
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      role: "user",
      status: "active" as const,
      lastLogin: "2 hours ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "client_admin",
      status: "active" as const,
      lastLogin: "1 day ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    },
    {
      id: "3",
      name: "Michael Johnson",
      email: "michael.johnson@example.com",
      role: "user",
      status: "inactive" as const,
      lastLogin: "2 weeks ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    },
  ],
  onEditUser = () => {},
  onDeleteUser = () => {},
  onResetPassword = () => {},
}: UserManagementTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button>Add User</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`${user.role === "client_admin" ? "border-blue-500 text-blue-500" : ""}`}
                  >
                    {user.role === "super_admin"
                      ? "Super Admin"
                      : user.role === "client_admin"
                        ? "Client Admin"
                        : "User"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={user.status === "active" ? "default" : "secondary"}
                    className={user.status === "inactive" ? "opacity-70" : ""}
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>{user.lastLogin}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditUser(user.id)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onResetPassword(user.id)}
                      >
                        Reset Password
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => onDeleteUser(user.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
