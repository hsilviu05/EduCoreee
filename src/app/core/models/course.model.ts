export interface Course {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  instructorName: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number; // in minutes
  lessons: Lesson[];
  enrolledStudents: number;
  rating: number;
  price: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  thumbnail?: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  content: string;
  videoUrl?: string;
  duration: number; // in minutes
  order: number;
  isPublished: boolean;
  isCompleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseProgress {
  id: string;
  userId: string;
  courseId: string;
  completedLessons: string[];
  currentLessonId?: string;
  progress: number; // percentage
  startedAt: Date;
  lastAccessedAt: Date;
  completedAt?: Date;
} 