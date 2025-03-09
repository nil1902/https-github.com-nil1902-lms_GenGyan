import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { BookmarkPlus, Clock, Star, Users } from "lucide-react";
import { Badge } from "../ui/badge";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    instructor: string;
    thumbnail: string;
    duration: string;
    level: string;
    rating: number;
    enrolledCount: number;
    category: string;
  };
  onEnroll?: (courseId: string) => void;
  onViewDetails?: (courseId: string) => void;
}

export function CourseCard({
  course,
  onEnroll = () => {},
  onViewDetails = () => {},
}: CourseCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/courses/${course.id}`);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full transition-all duration-200 hover:shadow-md cursor-pointer group">
      <div
        className="relative h-48 bg-cover bg-center group-hover:brightness-90 transition-all duration-200"
        style={{ backgroundImage: `url(${course.thumbnail})` }}
        onClick={handleCardClick}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-background/80 hover:bg-background/90 h-8 w-8"
          onClick={handleBookmark}
        >
          <BookmarkPlus
            className={`h-4 w-4 ${isBookmarked ? "fill-primary text-primary" : ""}`}
          />
        </Button>
        <Badge className="absolute bottom-2 left-2">{course.category}</Badge>
      </div>
      <CardContent className="flex-1 p-4" onClick={handleCardClick}>
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">
          {course.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Instructor: {course.instructor}
        </p>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {course.duration}
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 mr-1 text-yellow-400 fill-yellow-400" />
            {course.rating}
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {course.enrolledCount}
          </div>
        </div>

        <div className="mt-3">
          <Badge variant="outline" className="text-xs">
            {course.level}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex space-x-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(course.id);
          }}
        >
          Details
        </Button>
        <Button
          className="flex-1"
          onClick={(e) => {
            e.stopPropagation();
            onEnroll(course.id);
          }}
        >
          Enroll
        </Button>
      </CardFooter>
    </Card>
  );
}
