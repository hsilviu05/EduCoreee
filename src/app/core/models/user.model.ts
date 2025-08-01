export enum UserRole {
  STUDENT = 'Student',
  PROFESSOR = 'Professor',
  ADMIN = 'Admin'
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  lastLoginAt?: Date;
  isActive: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: number; // 0=Student, 1=Professor, 2=Admin
} 