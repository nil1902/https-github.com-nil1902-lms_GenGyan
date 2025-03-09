import { Progress } from "../ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CourseProgressCardProps {
  course: {
    id: string;
    title: string;
    thumbnail: string;
    progress: number;
    lastAccessed: string;
  };
  onContinue?: (courseId: string) => void;
}

export function CourseProgressCard({
  course,
  onContinue = () => {},
}: CourseProgressCardProps) {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate(`/courses/${course.id}`);
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md group cursor-pointer">
      <div
        className="relative h-32 bg-cover bg-center group-hover:brightness-90 transition-all duration-200"
        style={{ backgroundImage: `url(${course.thumbnail})` }}
        onClick={handleContinue}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <PlayCircle className="h-12 w-12 text-white drop-shadow-md" />
        </div>
      </div>
      <CardHeader className="p-4 pb-2" onClick={handleContinue}>
        <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            {course.progress}% Complete
          </span>
          <span className="text-xs text-muted-foreground">
            {course.lastAccessed}
          </span>
        </div>
        <Progress value={course.progress} className="h-2 mb-4" />
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onContinue(course.id);
          }}
          className="w-full"
          variant="default"
        >
          Continue Learning
        </Button>
      </CardContent>
    </Card>
  );
}
