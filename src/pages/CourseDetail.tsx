import { useState } from "react";
import { useParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { CourseDetailHeader } from "@/components/courses/CourseDetailHeader";
import { CourseModuleAccordion } from "@/components/courses/CourseModuleAccordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const [isEnrolled] = useState(false);

  // In a real app, you would fetch the course data based on courseId
  const course = {
    id: courseId || "1",
    title: "Introduction to Machine Learning",
    instructor: "Dr. Sarah Johnson",
    thumbnail:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
    duration: "8 hours",
    level: "beginner",
    rating: 4.8,
    enrolledCount: 1245,
    category: "Data Science",
    modules: 5,
    description:
      "This comprehensive course introduces you to the exciting world of machine learning. You'll learn fundamental concepts, algorithms, and practical applications. By the end of this course, you'll be able to build your own machine learning models and apply them to real-world problems.",
  };

  const modules = [
    {
      id: "1",
      title: "Introduction to Machine Learning",
      lessons: [
        {
          id: "l1",
          title: "What is Machine Learning?",
          duration: "15 min",
          completed: false,
        },
        {
          id: "l2",
          title: "Types of Machine Learning",
          duration: "20 min",
          completed: false,
        },
        {
          id: "l3",
          title: "Machine Learning Applications",
          duration: "25 min",
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
      title: "Data Preprocessing",
      lessons: [
        {
          id: "l4",
          title: "Data Cleaning",
          duration: "30 min",
          completed: false,
        },
        {
          id: "l5",
          title: "Feature Scaling",
          duration: "25 min",
          completed: false,
        },
        {
          id: "l6",
          title: "Feature Selection",
          duration: "20 min",
          completed: false,
        },
      ],
      quizzes: [
        {
          id: "q2",
          title: "Data Preprocessing Quiz",
          completed: false,
        },
      ],
    },
    {
      id: "3",
      title: "Supervised Learning Algorithms",
      lessons: [
        {
          id: "l7",
          title: "Linear Regression",
          duration: "35 min",
          completed: false,
        },
        {
          id: "l8",
          title: "Logistic Regression",
          duration: "30 min",
          completed: false,
        },
        {
          id: "l9",
          title: "Decision Trees",
          duration: "40 min",
          completed: false,
        },
      ],
      quizzes: [
        {
          id: "q3",
          title: "Supervised Learning Quiz",
          completed: false,
        },
      ],
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <CourseDetailHeader course={course} isEnrolled={isEnrolled} />

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Course Content</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="content" className="mt-6">
            <CourseModuleAccordion modules={modules} isEnrolled={isEnrolled} />
          </TabsContent>
          <TabsContent value="overview" className="mt-6">
            <div className="bg-white p-6 rounded-lg border border-border">
              <h2 className="text-xl font-semibold mb-4">About This Course</h2>
              <p className="text-muted-foreground mb-6">{course.description}</p>

              <h3 className="text-lg font-semibold mb-3">What You'll Learn</h3>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>Understand the fundamentals of machine learning</li>
                <li>Preprocess data for machine learning models</li>
                <li>Implement supervised learning algorithms</li>
                <li>Evaluate model performance</li>
                <li>Apply machine learning to real-world problems</li>
              </ul>

              <h3 className="text-lg font-semibold mb-3">Requirements</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Basic understanding of programming concepts</li>
                <li>Familiarity with Python (recommended)</li>
                <li>Basic knowledge of statistics</li>
              </ul>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <div className="bg-white p-6 rounded-lg border border-border">
              <h2 className="text-xl font-semibold mb-4">Student Reviews</h2>
              <p className="text-muted-foreground">
                Reviews will be displayed here.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
