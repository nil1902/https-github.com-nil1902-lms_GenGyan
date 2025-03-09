import { MainLayout } from "@/components/layout/MainLayout";
import { UserManagementTable } from "@/components/admin/UserManagementTable";

export default function UserManagement() {
  const users = [
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
    {
      id: "4",
      name: "Sarah Williams",
      email: "sarah.williams@example.com",
      role: "user",
      status: "active" as const,
      lastLogin: "3 days ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    {
      id: "5",
      name: "David Lee",
      email: "david.lee@example.com",
      role: "user",
      status: "active" as const,
      lastLogin: "5 hours ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    },
    {
      id: "6",
      name: "Emily Chen",
      email: "emily.chen@example.com",
      role: "client_admin",
      status: "active" as const,
      lastLogin: "Yesterday",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    },
    {
      id: "7",
      name: "Robert Wilson",
      email: "robert.wilson@example.com",
      role: "user",
      status: "inactive" as const,
      lastLogin: "1 month ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
    },
  ];

  const handleEditUser = (userId: string) => {
    console.log(`Edit user with ID: ${userId}`);
    // In a real app, you would open a modal or navigate to an edit page
  };

  const handleDeleteUser = (userId: string) => {
    console.log(`Delete user with ID: ${userId}`);
    // In a real app, you would show a confirmation dialog and then delete the user
  };

  const handleResetPassword = (userId: string) => {
    console.log(`Reset password for user with ID: ${userId}`);
    // In a real app, you would trigger a password reset email
  };

  return (
    <MainLayout userRole="client_admin">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">
          Manage users, roles, and permissions
        </p>

        <UserManagementTable
          users={users}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
          onResetPassword={handleResetPassword}
        />
      </div>
    </MainLayout>
  );
}
