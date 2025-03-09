import { MainLayout } from "@/components/layout/MainLayout";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";

export default function AdminDashboard() {
  const analyticsData = {
    userStats: {
      totalUsers: 1250,
      activeUsers: 876,
      newUsersThisMonth: 124,
      usersByRole: [
        { role: "User", count: 1100 },
        { role: "Client Admin", count: 145 },
        { role: "Super Admin", count: 5 },
      ],
    },
    courseStats: {
      totalCourses: 78,
      totalEnrollments: 3456,
      completionRate: 68,
      popularCourses: [
        { title: "Introduction to Machine Learning", enrollments: 342 },
        { title: "Advanced React Patterns", enrollments: 289 },
        { title: "Business Communication Skills", enrollments: 254 },
        { title: "Data Analysis with Python", enrollments: 231 },
        { title: "Project Management Fundamentals", enrollments: 198 },
      ],
    },
    learningStats: {
      averageCompletionTime: "12 days",
      averageScore: 82,
      certificatesIssued: 1245,
      learningHoursByDay: [
        { day: "Mon", hours: 245 },
        { day: "Tue", hours: 267 },
        { day: "Wed", hours: 298 },
        { day: "Thu", hours: 274 },
        { day: "Fri", hours: 236 },
        { day: "Sat", hours: 187 },
        { day: "Sun", hours: 156 },
      ],
    },
  };

  return (
    <MainLayout userRole="client_admin">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor platform performance and user activity
        </p>

        <AnalyticsDashboard data={analyticsData} />
      </div>
    </MainLayout>
  );
}
