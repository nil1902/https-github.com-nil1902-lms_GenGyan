import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Button } from "../ui/button";
import { Check, Clock, FileText, Play } from "lucide-react";

interface Module {
  id: string;
  title: string;
  lessons: {
    id: string;
    title: string;
    duration: string;
    completed?: boolean;
  }[];
  quizzes: {
    id: string;
    title: string;
    completed?: boolean;
  }[];
}

interface CourseModuleAccordionProps {
  modules: Module[];
  isEnrolled?: boolean;
  onStartLesson?: (moduleId: string, lessonId: string) => void;
  onStartQuiz?: (moduleId: string, quizId: string) => void;
}

export function CourseModuleAccordion({
  modules = [
    {
      id: "1",
      title: "Introduction to the Course",
      lessons: [
        {
          id: "l1",
          title: "Welcome to the Course",
          duration: "5 min",
          completed: true,
        },
        {
          id: "l2",
          title: "Course Overview",
          duration: "10 min",
          completed: false,
        },
      ],
      quizzes: [
        {
          id: "q1",
          title: "Introduction Quiz",
          completed: false,
        },
      ],
    },
    {
      id: "2",
      title: "Getting Started with Fundamentals",
      lessons: [
        {
          id: "l3",
          title: "Basic Concepts",
          duration: "15 min",
          completed: false,
        },
        {
          id: "l4",
          title: "Setting Up Your Environment",
          duration: "20 min",
          completed: false,
        },
      ],
      quizzes: [
        {
          id: "q2",
          title: "Fundamentals Quiz",
          completed: false,
        },
      ],
    },
  ],
  isEnrolled = false,
  onStartLesson = () => {},
  onStartQuiz = () => {},
}: CourseModuleAccordionProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {modules.map((module) => (
        <AccordionItem key={module.id} value={module.id}>
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center text-left">
              <span className="font-medium">{module.title}</span>
              <span className="ml-2 text-xs text-muted-foreground">
                ({module.lessons.length} lessons, {module.quizzes.length}{" "}
                quizzes)
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {module.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50"
                >
                  <div className="flex items-center">
                    {lesson.completed ? (
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                    ) : (
                      <Play className="h-4 w-4 mr-2 text-muted-foreground" />
                    )}
                    <div>
                      <p className="font-medium">{lesson.title}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {lesson.duration}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onStartLesson(module.id, lesson.id)}
                    disabled={!isEnrolled}
                  >
                    {lesson.completed ? "Review" : "Start"}
                  </Button>
                </div>
              ))}

              {module.quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 border-t border-border pt-3 mt-3"
                >
                  <div className="flex items-center">
                    {quiz.completed ? (
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                    ) : (
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                    )}
                    <p className="font-medium">{quiz.title}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onStartQuiz(module.id, quiz.id)}
                    disabled={!isEnrolled}
                  >
                    {quiz.completed ? "Review" : "Start"}
                  </Button>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
