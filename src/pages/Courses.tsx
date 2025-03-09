import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { CourseCard } from "@/components/courses/CourseCard";
import { CourseFilters } from "@/components/courses/CourseFilters";

export default function Courses() {
  const [courses] = useState([
    {
      id: "1",
      title: "Introduction to Machine Learning",
      instructor: "Dr. Sarah Johnson",
      thumbnail:
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
      duration: "8 hours",
      level: "beginner",
      rating: 4.8,
      enrolledCount: 1245,
      category: "Data Science",
    },
    {
      id: "2",
      title: "Advanced React Patterns",
      instructor: "Michael Chen",
      thumbnail:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
      duration: "10 hours",
      level: "advanced",
      rating: 4.9,
      enrolledCount: 876,
      category: "Programming",
    },
    {
      id: "3",
      title: "Business Communication Skills",
      instructor: "Emma Williams",
      thumbnail:
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80",
      duration: "6 hours",
      level: "intermediate",
      rating: 4.7,
      enrolledCount: 1532,
      category: "Business",
    },
    {
      id: "4",
      title: "UI/UX Design Fundamentals",
      instructor: "Alex Rodriguez",
      thumbnail:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
      duration: "12 hours",
      level: "beginner",
      rating: 4.6,
      enrolledCount: 982,
      category: "Design",
    },
    {
      id: "5",
      title: "Digital Marketing Strategies",
      instructor: "Jessica Lee",
      thumbnail:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      duration: "8 hours",
      level: "intermediate",
      rating: 4.5,
      enrolledCount: 745,
      category: "Marketing",
    },
    {
      id: "6",
      title: "Data Analysis with Python",
      instructor: "David Kim",
      thumbnail:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      duration: "15 hours",
      level: "intermediate",
      rating: 4.9,
      enrolledCount: 1876,
      category: "Data Science",
    },
  ]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Courses</h1>
        <p className="text-muted-foreground">
          Explore our wide range of courses to enhance your skills
        </p>

        <CourseFilters />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
