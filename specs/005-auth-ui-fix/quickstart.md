# Quickstart Guide: Authentication UI

## Overview
Quick guide to get the authentication UI up and running in the Todo application.

## Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- Python 3.13+
- PostgreSQL database (local or remote)
- Environment variables configured

## Environment Setup

### Frontend Environment Variables
Create `.env.local` in the frontend directory:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend Environment Variables
Create `.env` in the backend directory:
```
DATABASE_URL=postgresql://user:password@localhost:5432/todo_db
SECRET_KEY=your-super-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080  # 7 days in minutes
```

## Running the Application

### 1. Start the Backend Server
```bash
cd backend
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv pip install -e .
uvicorn src.main:app --reload --port 8000
```

### 2. Start the Frontend Development Server
```bash
cd frontend
npm install
npm run dev
```

### 3. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Backend docs: http://localhost:8000/docs

## Authentication Flow

### Registration Process
1. Navigate to `/register`
2. Fill in email and password (confirm password)
3. Submit form to create new account
4. User is redirected to login page on success

### Login Process
1. Navigate to `/login`
2. Enter registered email and password
3. Submit form to authenticate
4. User is redirected to dashboard on success

### Logout Process
1. Click logout button in dashboard
2. Authentication context is cleared
3. User is redirected to login page

## Key Components

### Frontend Components
- `frontend/app/(auth)/login/page.tsx` - Login page
- `frontend/app/(auth)/register/page.tsx` - Registration page
- `frontend/components/auth/LoginForm.tsx` - Login form component
- `frontend/components/auth/RegisterForm.tsx` - Registration form component
- `frontend/components/auth/SplitScreenAuth.tsx` - Auth layout
- `frontend/contexts/AuthContext.tsx` - Authentication state management

### Backend Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `POST /auth/logout` - User logout

## Troubleshooting

### Common Issues
1. **Database Connection**: Ensure PostgreSQL is running and credentials are correct
2. **CORS Errors**: Verify backend is configured to allow frontend origin
3. **Token Expiry**: JWT tokens expire after 7 days by default
4. **Validation Errors**: Check email format and password strength requirements

### Testing Authentication
- Use the API documentation at `/docs` to test endpoints directly
- Verify tokens are stored in localStorage after login
- Check that protected routes require authentication