import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Star } from "lucide-react";

interface Course {
  id: string;
  title: string;
  thumbnail: string;
  instructor: string;
  rating: number;
  level: string;
}

interface RecommendedCoursesProps {
  courses: Course[];
  onViewCourse?: (courseId: string) => void;
}

export function RecommendedCourses({
  courses = [
    {
      id: "1",
      title: "Introduction to Machine Learning",
      thumbnail:
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
      instructor: "Dr. Sarah Johnson",
      rating: 4.8,
      level: "beginner",
    },
    {
      id: "2",
      title: "Advanced React Patterns",
      thumbnail:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
      instructor: "Michael Chen",
      rating: 4.9,
      level: "advanced",
    },
    {
      id: "3",
      title: "Business Communication Skills",
      thumbnail:
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80",
      instructor: "Emma Williams",
      rating: 4.7,
      level: "intermediate",
    },
  ],
  onViewCourse = () => {},
}: RecommendedCoursesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended Courses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="flex items-center space-x-4 border-b border-border pb-4 last:border-0 last:pb-0"
            >
              <div
                className="h-16 w-24 bg-cover bg-center rounded"
                style={{ backgroundImage: `url(${course.thumbnail})` }}
              />
              <div className="flex-1">
                <h4 className="font-medium">{course.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {course.instructor}
                </p>
                <div className="flex items-center mt-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm ml-1">{course.rating}</span>
                  <span className="text-xs ml-2 px-2 py-0.5 bg-muted rounded-full">
                    {course.level}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewCourse(course.id)}
              >
                View
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
