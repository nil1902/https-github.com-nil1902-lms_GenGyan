import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { BarChart, LineChart, PieChart } from "lucide-react";

interface AnalyticsDashboardProps {
  data: {
    userStats: {
      totalUsers: number;
      activeUsers: number;
      newUsersThisMonth: number;
      usersByRole: { role: string; count: number }[];
    };
    courseStats: {
      totalCourses: number;
      totalEnrollments: number;
      completionRate: number;
      popularCourses: { title: string; enrollments: number }[];
    };
    learningStats: {
      averageCompletionTime: string;
      averageScore: number;
      certificatesIssued: number;
      learningHoursByDay: { day: string; hours: number }[];
    };
  };
}

export function AnalyticsDashboard({
  data = {
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
  },
}: AnalyticsDashboardProps) {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="courses">Courses</TabsTrigger>
        <TabsTrigger value="learning">Learning</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.userStats.totalUsers}
              </div>
              <p className="text-xs text-muted-foreground">
                +{data.userStats.newUsersThisMonth} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.courseStats.totalCourses}
              </div>
              <p className="text-xs text-muted-foreground">
                {data.courseStats.totalEnrollments} total enrollments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.courseStats.completionRate}%
              </div>
              <p className="text-xs text-muted-foreground">
                {data.learningStats.certificatesIssued} certificates issued
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Popular Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {data.courseStats.popularCourses.map((course, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <p className="text-sm">{course.title}</p>
                    <p className="text-sm font-medium">{course.enrollments}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Learning Hours by Day</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-end justify-between">
                {data.learningStats.learningHoursByDay.map((day, i) => {
                  const maxHours = Math.max(
                    ...data.learningStats.learningHoursByDay.map(
                      (d) => d.hours,
                    ),
                  );
                  const heightPercentage = (day.hours / maxHours) * 100;

                  return (
                    <div key={i} className="flex flex-col items-center">
                      <div
                        className="w-8 bg-primary rounded-t"
                        style={{ height: `${heightPercentage}%` }}
                      />
                      <p className="text-xs mt-2">{day.day}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="users" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <div className="flex items-center space-x-8">
                {data.userStats.usersByRole.map((role, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="relative w-32 h-32 rounded-full border-8 border-primary flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{role.count}</div>
                        <div className="text-xs text-muted-foreground">
                          {(
                            (role.count / data.userStats.totalUsers) *
                            100
                          ).toFixed(1)}
                          %
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 font-medium">{role.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="courses" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Course Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-end justify-between px-2">
              {data.courseStats.popularCourses.map((course, i) => {
                const maxEnrollments = Math.max(
                  ...data.courseStats.popularCourses.map((c) => c.enrollments),
                );
                const heightPercentage =
                  (course.enrollments / maxEnrollments) * 100;

                return (
                  <div key={i} className="flex flex-col items-center w-1/6">
                    <div
                      className="w-full bg-primary rounded-t"
                      style={{ height: `${heightPercentage}%` }}
                    />
                    <p className="text-xs mt-2 text-center truncate w-full">
                      {course.title.split(" ").slice(0, 2).join(" ")}
                    </p>
                    <p className="text-xs font-medium">{course.enrollments}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="learning" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Completion Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.learningStats.averageCompletionTime}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.learningStats.averageScore}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Certificates Issued
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.learningStats.certificatesIssued}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}
