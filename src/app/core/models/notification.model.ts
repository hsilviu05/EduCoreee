export enum NotificationType {
  COURSE_ENROLLMENT = 'course_enrollment',
  LESSON_COMPLETED = 'lesson_completed',
  QUIZ_RESULT = 'quiz_result',
  COURSE_UPDATE = 'course_update',
  SYSTEM_MESSAGE = 'system_message'
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
  readAt?: Date;
}

export interface NotificationCount {
  total: number;
  unread: number;
} 