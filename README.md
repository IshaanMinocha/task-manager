# Task Management Application

A fullstack task management application with secure user authentication, allowing users to register, login, and manage their personal tasks with real-time updates.

## Features

- **User Authentication**

  - Secure registration and login with JWT
  - Password hashing with bcrypt
  - Protected routes and API endpoints
  - Persistent authentication (localStorage)

- **Task Management**

  - Create, read, update, and delete tasks
  - Real-time optimistic UI updates
  - Task status tracking (Pending/Completed)
  - User-specific task isolation

- **Modern UI/UX**

  - Responsive design with TailwindCSS
  - Duochrome theme
  - Smooth animations and transitions
  - Form validation with real-time feedback

- **Testing**
  - 135 comprehensive tests (69 backend + 66 frontend)
  - Unit and integration testing
  - Test coverage reports

## Technology Stack

### Frontend

- **React 19** with Vite for fast development
- **Redux Toolkit** for state management
- **React Router** for navigation
- **TailwindCSS** for styling
- **Axios** for API calls
- **React Hook Form + Zod** for form validation
- **Jest + React Testing Library** for testing

### Backend

- **Next.js 15** (App Router) with TypeScript
- **Prisma ORM** with MongoDB
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Jest + Supertest** for testing

## Local Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/IshaanMinocha/task-manager.git
cd task-manager
```

### 2. Backend Setup

#### Install Dependencies

```bash
cd server
npm install
```

#### Set Up Environment Variables

Create a `.env` file in the `server` directory from .env.example

#### Set Up Database

```bash
npm run prisma:generate

npm run db:push
```

### 3. Frontend Setup

#### Install Dependencies

```bash
cd ../client
npm install
```

#### Set Up Environment Variables

Create a `.env` file in the `client` directory from .env.example

## Running the Application

### Start the Backend Server

```bash
cd server
npm run dev
```

The backend API will be available at `http://localhost:3000`

### Start the Frontend Development Server

In a new terminal:

```bash
cd client
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Access the Application

Open your browser and navigate to:

```
http://localhost:5173
```

## Running Tests

### Backend Tests (69 tests)

```bash
cd server

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Frontend Tests (66 tests)

```bash
cd client

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### View Coverage Reports

After running tests with coverage, open the HTML reports:

**Backend:**

```bash
cd server
start coverage/lcov-report/index.html
```

**Frontend:**

```bash
cd client
start coverage/lcov-report/index.html
```

## API Endpoints

### Authentication Endpoints

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "password": "password123"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "user_id",
    "username": "john_doe",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "password123"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_id",
      "username": "john_doe",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### Task Endpoints (Protected - Requires JWT)

All task endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

#### Get All Tasks

```http
GET /api/tasks
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": [
    {
      "id": "task_id",
      "title": "Complete project",
      "description": "Finish the task management app",
      "status": "PENDING",
      "userId": "user_id",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Create Task

```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "New Task",
  "description": "Task description (optional)",
  "status": "PENDING"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": "task_id",
    "title": "New Task",
    "description": "Task description",
    "status": "PENDING",
    "userId": "user_id",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Update Task

```http
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Task",
  "description": "Updated description",
  "status": "COMPLETED"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "id": "task_id",
    "title": "Updated Task",
    "description": "Updated description",
    "status": "COMPLETED",
    "userId": "user_id",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

#### Delete Task

```http
DELETE /api/tasks/:id
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Task deleted successfully",
  "data": {
    "id": "task_id"
  }
}
```

### Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message description"
}
```

**Common HTTP Status Codes:**

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (duplicate username)
- `500` - Internal Server Error



## Thank you!