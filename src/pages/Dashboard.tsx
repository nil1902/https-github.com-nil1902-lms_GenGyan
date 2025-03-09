import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { CourseProgressCard } from "@/components/dashboard/CourseProgressCard";
import { RecommendedCourses } from "@/components/dashboard/RecommendedCourses";
import { NotificationsList } from "@/components/dashboard/NotificationsList";
import { UpcomingSessionsCard } from "@/components/dashboard/UpcomingSessionsCard";
import { BookOpen, Clock, Award, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const enrolledCourses = [
    {
      id: "1",
      title: "Introduction to Machine Learning",
      thumbnail:
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
      progress: 65,
      lastAccessed: "2 hours ago",
    },
    {
      id: "2",
      title: "Advanced React Patterns",
      thumbnail:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
      progress: 30,
      lastAccessed: "Yesterday",
    },
    {
      id: "3",
      title: "Business Communication Skills",
      thumbnail:
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80",
      progress: 85,
      lastAccessed: "3 days ago",
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Welcome Back, John!</h1>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            title="Courses Enrolled"
            value="5"
            icon={<BookOpen className="h-4 w-4" />}
            trend={{ value: 10, isPositive: true }}
          />
          <StatCard
            title="Hours Learning"
            value="42"
            icon={<Clock className="h-4 w-4" />}
            description="This month"
            trend={{ value: 15, isPositive: true }}
          />
          <StatCard
            title="Certificates"
            value="3"
            icon={<Award className="h-4 w-4" />}
          />
          <StatCard
            title="Avg. Score"
            value="85%"
            icon={<TrendingUp className="h-4 w-4" />}
            trend={{ value: 5, isPositive: true }}
          />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold mt-8">
          Continue Learning
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {enrolledCourses.map((course) => (
            <CourseProgressCard key={course.id} course={course} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mt-8">
          <div className="lg:col-span-2">
            <RecommendedCourses />
          </div>
          <div className="space-y-4 sm:space-y-6">
            <NotificationsList />
            <UpcomingSessionsCard />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
