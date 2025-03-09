import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Clock, Star, Users, BookOpen } from "lucide-react";

interface CourseDetailHeaderProps {
  course: {
    title: string;
    instructor: string;
    thumbnail: string;
    duration: string;
    level: string;
    rating: number;
    enrolledCount: number;
    category: string;
    modules: number;
  };
  isEnrolled?: boolean;
  onEnroll?: () => void;
  onContinue?: () => void;
}

export function CourseDetailHeader({
  course,
  isEnrolled = false,
  onEnroll = () => {},
  onContinue = () => {},
}: CourseDetailHeaderProps) {
  return (
    <div className="bg-white border border-border rounded-lg overflow-hidden">
      <div
        className="h-64 bg-cover bg-center"
        style={{ backgroundImage: `url(${course.thumbnail})` }}
      />
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <Badge className="mb-2">{course.category}</Badge>
            <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
            <p className="text-muted-foreground">
              Instructor: {course.instructor}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            {isEnrolled ? (
              <Button size="lg" onClick={onContinue}>
                Continue Learning
              </Button>
            ) : (
              <Button size="lg" onClick={onEnroll}>
                Enroll Now
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-border pt-4">
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Duration</p>
              <p className="text-sm text-muted-foreground">{course.duration}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Star className="h-5 w-5 mr-2 text-yellow-400 fill-yellow-400" />
            <div>
              <p className="text-sm font-medium">Rating</p>
              <p className="text-sm text-muted-foreground">{course.rating}/5</p>
            </div>
          </div>
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Enrolled</p>
              <p className="text-sm text-muted-foreground">
                {course.enrolledCount} students
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Modules</p>
              <p className="text-sm text-muted-foreground">
                {course.modules} modules
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
