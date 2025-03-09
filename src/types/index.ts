export interface User {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "client_admin" | "user";
  avatar?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor: string;
  duration: string;
  level: "beginner" | "intermediate" | "advanced";
  category: string;
  enrolledCount: number;
  rating: number;
  modules: CourseModule[];
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
  quizzes: Quiz[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed?: boolean;
  content: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  completed?: boolean;
  score?: number;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOption: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: "announcement" | "message" | "system";
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Trainer {
  id: string;
  name: string;
  specialization: string;
  avatar: string;
  rating: number;
  availability: TimeSlot[];
}

export interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  booked: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  trainerId: string;
  timeSlotId: string;
  status: "confirmed" | "cancelled" | "completed";
  notes?: string;
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  issueDate: string;
  expiryDate?: string;
  certificateUrl: string;
}

export interface ProgressMetric {
  courseId: string;
  progress: number;
  lastAccessed: string;
  timeSpent: number;
}

export interface UserInsights {
  coursesEnrolled: number;
  coursesCompleted: number;
  certificatesEarned: number;
  averageScore: number;
  totalLearningHours: number;
  progressMetrics: ProgressMetric[];
}
