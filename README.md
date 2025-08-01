# EduCore - Learning Platform

A modern, full-stack e-learning platform built with Angular and .NET Core.

## Features

- **User Authentication**: Secure login and registration system
- **Course Management**: Browse and enroll in courses
- **Interactive Quizzes**: Test your knowledge with quizzes
- **Progress Tracking**: Monitor your learning progress
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode**: Toggle between light and dark themes

## Technology Stack

### Frontend
- **Angular 20**: Modern frontend framework
- **TypeScript**: Type-safe development
- **SCSS**: Advanced styling with CSS variables
- **RxJS**: Reactive programming for state management

### Backend
- **.NET Core**: High-performance backend framework
- **Entity Framework**: Object-relational mapping
- **SQLite**: Lightweight database for development
- **JWT Authentication**: Secure token-based authentication

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- .NET 8 SDK
- Angular CLI

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd educore-app
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend/ELearningAPI
   dotnet restore
   ```

4. **Start the backend server**
   ```bash
   dotnet run
   ```

5. **Start the frontend development server**
   ```bash
   npm start
   ```

6. **Open your browser**
   Navigate to `http://localhost:4200`

## Project Structure

```
educore-app/
├── src/                    # Angular frontend
│   ├── app/
│   │   ├── core/          # Core services and models
│   │   ├── features/      # Feature modules
│   │   ├── layout/        # Layout components
│   │   └── shared/        # Shared components
│   └── styles.scss        # Global styles
├── backend/               # .NET backend
│   └── ELearningAPI/
│       ├── Controllers/   # API controllers
│       ├── Models/        # Data models
│       ├── Services/      # Business logic
│       └── DTOs/         # Data transfer objects
└── README.md
```

## Development

### Frontend Development
- **Components**: Feature-based component organization
- **Services**: Centralized data management
- **Routing**: Lazy-loaded feature modules
- **Styling**: Modern CSS with design system

### Backend Development
- **API Controllers**: RESTful endpoints
- **Entity Framework**: Database operations
- **Authentication**: JWT token management
- **CORS**: Cross-origin resource sharing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
